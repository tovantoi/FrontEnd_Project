import React, { useEffect } from "react";
import "../CSS/FallingEffect.css";

const FallingEffect = ({ count = 20, imageUrl = "/assets/leaf.png" }) => {
  useEffect(() => {
    const container = document.getElementById("falling-container");
    if (container) {
      container.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.className = "falling-item";
        img.style.left = Math.random() * 100 + "vw";
        img.style.animationDuration = 5 + Math.random() * 5 + "s";
        img.style.opacity = 0.3 + Math.random() * 0.7;
        container.appendChild(img);
      }
    }
  }, [count, imageUrl]);

  return <div id="falling-container"></div>;
};

export default FallingEffect;
