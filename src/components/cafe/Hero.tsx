import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo, memo, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import {
  useGLTF,
  ContactShadows,
  Environment,
  Lightformer,
} from "@react-three/drei";
import planeVertexShader from "@/shaders/PlaneVertex.glsl?raw";
import planeFragmentShader from "@/shaders/PlaneFragment.glsl?raw";

// Preload GLTF model for better performance
useGLTF.preload("/cup.compressed.glb");

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "-20% 0px -20% 0px" },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef as any}
      id="home"
      className="relative h-[100svh] w-full overflow-hidden"
    >
      <Canvas
        shadows
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
        frameloop="always"
      >
        <BasicScene active={visible} />
      </Canvas>
      <div
        className="absolute inset-0 z-10 flex h-full items-start justify-center pt-[7.5rem] transform-gpu will-change-transform isolate"
        style={{ contain: "paint" }}
      >
        <div className="container mx-auto px-4 text-center text-white transform-gpu will-change-transform will-change-opacity [backface-visibility:hidden] [transform:translateZ(0)]">
          <h1 className="font-serif text-5xl leading-tight transform-gpu will-change-transform will-change-opacity [text-shadow:0_6px_30px_rgba(0,0,0,.45)] md:text-6xl lg:text-7xl">
            Brewed with Passion
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-balance text-lg text-white/90 transform-gpu will-change-transform will-change-opacity [text-shadow:0_4px_18px_rgba(0,0,0,.45)] md:text-xl">
            Cozy, elegant, and crafted to perfection. Discover our signature
            blends and seasonal specials.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a href="#menu" className="btn-primary shadow-glow">
              Order Now
            </a>
            <a href="#about" className="btn-secondary">
              Visit Café
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-white/80">
            <SteamIcon />
            <span>Freshly brewed daily</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const BasicScene = memo(function BasicScene({
  active = true,
}: {
  active?: boolean;
}) {
  return (
    <>
      {/* Neutral white lighting to preserve model albedo */}
      <ambientLight color={"#ffffff"} intensity={0.55} />
      <pointLight color={"#ffffff"} position={[4, 3, 2]} intensity={1.2} />
      <directionalLight
        color={"#ffffff"}
        position={[2, 4, 6]}
        intensity={1.7}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      {/* Procedural environment to restore warm reflections without external fetches */}
      <Environment background={false} resolution={64} frames={1}>
        {/* White key and cool fill to maintain white surfaces */}
        <Lightformer
          intensity={1.0}
          color="#ffffff"
          position={[5, 4, 3]}
          scale={6}
        />
        <Lightformer
          intensity={0.35}
          color="#dfe7ff"
          position={[-4, -3, -2]}
          scale={6}
        />
      </Environment>
      <SpinningBox />
      <ShaderPlane active={active} />
      <ContactShadows
        position={[0, -3.6, 0]}
        opacity={0.35}
        scale={20}
        blur={2.6}
        far={10}
        color="#3a3a3a"
      />
    </>
  );
});

const SpinningBox = memo(function SpinningBox() {
  const { scene } = useGLTF("/cup.compressed.glb");
  const groupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if ((mesh as any).isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const material = mesh.material as any;
        if (material) {
          if ("metalness" in material)
            material.metalness = Math.min(material.metalness ?? 0.2, 0.8);
          if ("roughness" in material)
            material.roughness = Math.max(material.roughness ?? 0.6, 0.2);
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!groupRef.current) return;
    const targetY = -3.5;
    const targetRot = { x: 0.4, y: -Math.PI / 2, z: 0 };
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(
      groupRef.current.position,
      { y: targetY - 2, x: 0.5, z: 0 },
      { y: targetY, duration: 1.2 },
    )
      .fromTo(
        groupRef.current.rotation,
        { x: targetRot.x + 0.4, y: targetRot.y - 0.6, z: targetRot.z },
        { x: targetRot.x, y: targetRot.y, z: targetRot.z, duration: 1.2 },
        0,
      )
      .fromTo(
        groupRef.current.scale,
        { x: 0.001, y: 0.001, z: 0.001 },
        { x: 4.5, y: 4.5, z: 4.5, duration: 1.2 },
        0,
      );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
});

const ShaderPlane = memo(function ShaderPlane({
  active = true,
}: {
  active?: boolean;
}) {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const lastSizeRef = useRef({ width: 0, height: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(size.width, size.height),
      },
      uIntro: { value: 0 },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    // Update time only when active to save work off-screen
    if (active) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime * 0.5;
    }

    // Only update resolution when it actually changes
    if (
      lastSizeRef.current.width !== size.width ||
      lastSizeRef.current.height !== size.height
    ) {
      materialRef.current.uniforms.uResolution.value.set(
        size.width,
        size.height,
      );
      lastSizeRef.current = { width: size.width, height: size.height };
    }
  });

  useEffect(() => {
    if (!materialRef.current) return;
    const introUniform = materialRef.current.uniforms.uIntro;
    const tween = gsap.to(introUniform, {
      value: 1,
      duration: 1.2,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
  }, []);

  // Animate plane scaling from bottom to top
  useEffect(() => {
    if (!meshRef.current) return;
    const planeHeight = 12; // matches geometry args height
    const fullCenterY = -3.5;
    const bottomY = fullCenterY - planeHeight / 2;

    meshRef.current.scale.set(1, 0, 1);
    meshRef.current.position.y = bottomY;

    const proxy = { s: 0 };
    const tween = gsap.to(proxy, {
      s: 1,
      duration: 1.0,
      ease: "power2.out",
      delay: 0.2,
      onUpdate: () => {
        if (!meshRef.current) return;
        meshRef.current.scale.y = proxy.s;
        meshRef.current.position.y = bottomY + (planeHeight * proxy.s) / 2;
      },
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <mesh ref={meshRef} position={[0.1, -3.5, 1.8]} rotation={[0, 0, 0]}>
      <planeGeometry args={[2, 12, 32, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={planeVertexShader}
        fragmentShader={planeFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
});

function SteamIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        className="steam-path"
        d="M22 50 C10 40, 30 34, 20 24"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="2"
      />
      <path
        className="steam-path"
        d="M32 52 C20 42, 40 36, 30 26"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="2"
      />
      <path
        className="steam-path"
        d="M42 50 C30 40, 50 34, 40 24"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="2"
      />
    </svg>
  );
}
