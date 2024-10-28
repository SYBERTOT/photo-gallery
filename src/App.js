import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PhotoGrid from "./components/PhotoGrid";
import PhotoDetails from "./components/PhotoDetails";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/photos" replace />} />
        <Route path="/photos" element={<PhotoGrid />} />
        <Route path="/photos/:id" element={<PhotoDetails />} />
        {/* Thêm route Not Found */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </div>
  );
};


export default App;