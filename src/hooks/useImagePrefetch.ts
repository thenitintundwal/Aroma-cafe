import { useEffect } from "react";

type PrefetchOptions = {
  concurrency?: number;
};

const idle = (cb: () => void) => {
  if ((window as any).requestIdleCallback) {
    (window as any).requestIdleCallback(cb, { timeout: 2000 });
  } else {
    setTimeout(cb, 200);
  }
};

export function useIdleImagePrefetch(
  urls: string[] | undefined,
  options?: PrefetchOptions,
) {
  useEffect(() => {
    if (!urls || urls.length === 0) return;

    const unique = Array.from(new Set(urls.filter(Boolean)));
    const controller = new AbortController();
    const max = Math.max(1, Math.min(options?.concurrency ?? 2, 4));
    let index = 0;
    let active = 0;

    const startNext = () => {
      if (controller.signal.aborted) return;
      while (active < max && index < unique.length) {
        const url = unique[index++];
        active++;
        const img = new Image();
        img.decoding = "async" as any;
        img.loading = "eager" as any;
        img.src = url;
        const done = () => {
          active--;
          startNext();
        };
        if ((img as any).decode) {
          (img as any)
            .decode()
            .catch(() => {})
            .finally(done);
        } else {
          img.onload = done;
          img.onerror = done;
        }
      }
    };

    idle(startNext);

    return () => {
      controller.abort();
    };
  }, [JSON.stringify(urls), options?.concurrency]);
}
