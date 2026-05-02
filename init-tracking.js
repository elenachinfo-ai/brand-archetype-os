// ==================== WIRE TRACKING + PIVOT INTO ENGINE ====================
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // ---- Init Pivot (scan overlay + UI transformer) ----
    Pivot.init();

    // ---- Start sensors ----
    Tracker.init();
    Interpreter.init();

    // ---- Register dashboard panels as attention zones ----
    Tracker.registerSections([
      {
        id: "controllers",
        element: document.getElementById("panel-controllers"),
        type: "interactive",
      },
      {
        id: "field",
        element: document.getElementById("panel-field"),
        type: "image",
      },
      {
        id: "output",
        element: document.getElementById("panel-output"),
        type: "text",
      },
    ]);

    // ---- Signal that CTA is visible ----
    Tracker.ctaAppeared();

    // ---- Archetype lock → PIVOT UI ----
    Interpreter.onLock((archetype) => {
      console.log(
        `%c[Engine] 🎯 ARCHETYPE LOCKED: ${archetype.nameRu}`,
        "color: #a5d6a7; font-size: 14px;",
      );
      console.log(
        `  Vector: [${archetype.vector.control}, ${archetype.vector.energy}, ${archetype.vector.focus}, ${archetype.vector.method}]`,
      );

      // ---- EXECUTE THE PIVOT ----
      Pivot.execute(archetype.id);
    });

    // ---- Every tick: update signal bars ----
    Interpreter.onUpdate((_vector, _confidence) => {
      ["control", "energy", "focus", "method"].forEach((dim) => {
        const bar = document.getElementById(`hud-signal-bar-${dim}`);
        if (bar) {
          const signal = Tracker.signals[dim];
          bar.style.width = (((signal + 1) / 2) * 100).toFixed(0) + "%";
        }
      });
    });

    console.log(
      "%c[Engine] Behavior Tracker + Pivot active.",
      "color: #7bbcd4;",
    );
  }, 150);
});
