import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./react-engine/global.css";

// ---- Magnetic cursor setup ----
if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const cursor = document.createElement("div");
  cursor.className = "magnetic-cursor";
  document.body.appendChild(cursor);

  const trail = document.createElement("div");
  trail.className = "magnetic-cursor-trail";
  document.body.appendChild(trail);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover detection on interactive elements
  document.addEventListener("mouseover", (e) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[role='button']") ||
      target.closest("[role='radio']") ||
      target.closest("[role='slider']") ||
      target.closest("input") ||
      target.closest("svg")
    ) {
      cursor.classList.add("hovering");
      trail.classList.add("visible");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[role='button']")
    ) {
      cursor.classList.remove("hovering");
      trail.classList.remove("visible");
    }
  });

  document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
  document.addEventListener("mouseup", () => cursor.classList.remove("clicking"));

  // Click ripple
  document.addEventListener("click", (e) => {
    const ripple = document.createElement("div");
    ripple.className = "click-ripple";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  // Animation loop
  function animateCursor() {
    const ease = 0.12;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    trailX += (mouseX - trailX) * ease * 0.6;
    trailY += (mouseY - trailY) * ease * 0.6;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    trail.style.left = `${trailX}px`;
    trail.style.top = `${trailY}px`;

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);
}

// ---- Mount ----
const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
