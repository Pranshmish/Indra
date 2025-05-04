import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Rain from "./../Rain";

const RainScene = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
    <Canvas camera={{ position: [0, 3, 5], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} />
      <Rain />
      <OrbitControls />
    </Canvas>
    </div>
  );
};

export default RainScene;
