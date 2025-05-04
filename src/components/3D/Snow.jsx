import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import snowTextureImage from "../3D/snow.png"

const Snow = () => {
  const rainCount = 1500;
  const rainRef = useRef();


  const dropTexture = useLoader(THREE.TextureLoader, snowTextureImage);

  const positions = useMemo(() => {
    const arr = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      arr[i * 3 + 0] = Math.random() * 20 - 10; 
      arr[i * 3 + 1] = Math.random() * 20;      
      arr[i * 3 + 2] = Math.random() * 20 - 10; 
    }
    return arr;
  }, []);

  useFrame(() => {
    const pos = rainRef.current.geometry.attributes.position.array;
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3 + 1] -= 0.02;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 20;
      }
    }
    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      
      <pointsMaterial
        attach="material"
        map={dropTexture}
        size={0.5}
        transparent={true}
        alphaTest={0.5}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default Snow;