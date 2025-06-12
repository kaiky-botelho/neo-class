// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./main/App";

// Garantir que o elemento root não é nulo
const container = document.getElementById("root");

if (container) {
  const root = createRoot(container); // createRoot espera um HTMLElement
  root.render(<App />);
} else {
  console.error("Elemento 'root' não encontrado no HTML.");
}
