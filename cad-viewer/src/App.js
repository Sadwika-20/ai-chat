import React, { useState, useEffect } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";  // Theme for syntax highlighting
import ModelViewer from "./components/ModelViewer";

hljs.registerLanguage("javascript", javascript);

function App() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);

  // ✅ Syntax Highlighting on Component Mount
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();

    if (fileName.endsWith(".glb") || fileName.endsWith(".gltf")) {
      setFileType("glb");
    } else if (fileName.endsWith(".stl")) {
      setFileType("stl");
    } else if (fileName.endsWith(".obj")) {
      setFileType("obj");
    } else {
      alert("Unsupported file format. Please upload .glb, .gltf, .stl, or .obj.");
      return;
    }

    // ✅ Correct way to create an object URL
    const url = URL.createObjectURL(selectedFile);
    setFile(url);

    // ✅ Cleanup previous object URL to prevent memory leaks
    return () => {
      if (file) URL.revokeObjectURL(file);
    };
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>3D Model Viewer</h2>
      <input type="file" accept=".glb,.gltf,.stl,.obj" onChange={handleFileChange} />
      {file && <ModelViewer modelPath={file} fileType={fileType} />}

      {/* ✅ Example of a Highlighted Code Block */}
      <pre>
        <code className="language-javascript">
          {`console.log("Hello, 3D Model Viewer!");`}
        </code>
      </pre>
    </div>
  );
}

export default App;
