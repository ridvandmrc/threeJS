import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";

const RotatingCube = () => {
  const mesh = useRef(null!);

  return (
    <mesh ref={mesh} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
      <cylinderGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0x9dcba6} />
    </mesh>
  );
};

export const Fiber = () => {
  return (
    <Canvas
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OrbitControls enableDamping enableZoom enableRotate />
      <directionalLight position={[1, 1, 1]} intensity={15} color={0x9dcba6} />
      <color attach="background" args={["#fff"]} />
      <RotatingCube />
    </Canvas>
  );
};
