import React, { Suspense, useState, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MeshStandardMaterial, Mesh } from "three";

// Loading Placeholder
const Loading = () => <p>Loading Model...</p>;

const ModelViewer = ({ modelPath, fileType }) => {
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);

  // ✅ Always call loaders (React rules)
  const gltf = useGLTF(fileType === "glb" || fileType === "gltf" ? modelPath : "null");
  const stlGeometry = useLoader(STLLoader, fileType === "stl" ? modelPath : "null");
  const obj = useLoader(OBJLoader, fileType === "obj" ? modelPath : "null");

  // ✅ Handle model assignment safely
  useEffect(() => {
    try {
      if (fileType === "glb" || fileType === "gltf") {
        setModel(gltf?.scene || null);
      } else if (fileType === "stl" && stlGeometry) {
        const material = new MeshStandardMaterial({ color: "gray", metalness: 0.5, roughness: 0.5 });
        setModel(new Mesh(stlGeometry, material));
      } else if (fileType === "obj") {
        setModel(obj);
      } else {
        setError("Unsupported file format.");
      }
    } catch (err) {
      setError("Failed to load model.");
      console.error("Error loading model:", err);
    }
  }, [gltf, stlGeometry, obj, fileType]);

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={<Loading />}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} />
            {model && <primitive object={model} scale={1.5} />}
            <OrbitControls />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default ModelViewer;
