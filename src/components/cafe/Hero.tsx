import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo, memo } from "react";
import * as THREE from "three";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import planeVertexShader from "@/shaders/PlaneVertex.glsl?raw";
import planeFragmentShader from "@/shaders/PlaneFragment.glsl?raw";

// Preload GLTF model for better performance
useGLTF.preload("/cup.glb");

export default function Hero() {
  return (
    <section id="home" className="relative h-[100svh] w-full overflow-hidden">
      <Canvas
        shadows
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        frameloop="always"
      >
        <BasicScene />
      </Canvas>
      <div className="absolute inset-0 z-10 flex h-full items-start justify-center pt-[7.5rem]">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="font-serif text-5xl leading-tight [text-shadow:0_6px_30px_rgba(0,0,0,.45)] md:text-6xl lg:text-7xl">
            Brewed with Passion
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-balance text-lg text-white/90 [text-shadow:0_4px_18px_rgba(0,0,0,.45)] md:text-xl">
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

const BasicScene = memo(function BasicScene() {
  return (
    <>
      <ambientLight color={"#FFEAD1"} intensity={0.45} />
      <pointLight color={"#FFC38B"} position={[4, 3, 2]} intensity={1.4} />
      <directionalLight
        color={"#FFB070"}
        position={[2, 4, 6]}
        intensity={2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <Environment preset="sunset" background={false} resolution={256} />
      <ShaderPlane />
      <SpinningBox />
      <ContactShadows
        position={[0, -3.6, 0]}
        opacity={0.35}
        scale={20}
        blur={2.6}
        far={10}
        color="#8b5e34"
      />
    </>
  );
});

const SpinningBox = memo(function SpinningBox() {
  const { scene } = useGLTF("/cup.glb");

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

  return (
    <primitive
      object={scene}
      position={[0.5, -3.5, 0]}
      scale={[4.5, 4.5, 4.5]}
      rotation={[0.4, -Math.PI / 2, 0]}
    />
  );
});

const ShaderPlane = memo(function ShaderPlane() {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const lastSizeRef = useRef({ width: 0, height: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(size.width, size.height),
      },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    // Update time every frame
    materialRef.current.uniforms.uTime.value = clock.elapsedTime * 0.5;

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

  return (
    <mesh position={[0.1, -3.5, 1.8]} rotation={[0, 0, 0]}>
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
