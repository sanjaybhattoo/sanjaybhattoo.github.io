// cursor-effects.js
(() => {
  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReducedMotion) return;

  // Don’t run on touch devices
  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
  const canHover = window.matchMedia?.("(hover: hover)")?.matches;
  if (isCoarsePointer || !canHover) return;

  // Create cursor elements once
  const dot = document.createElement("div");
  dot.className = "cursor-dot";

  const trail = document.createElement("div");
  trail.className = "cursor-trail";

  document.body.appendChild(dot);
  document.body.appendChild(trail);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  const speed = 0.15; // smaller = more lag

  function setPos(el, x, y) {
    el.style.left = x + "px";
    el.style.top = y + "px";
  }

  document.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPos(dot, mouseX, mouseY);
    },
    { passive: true }
  );

  // Smooth trailing animation
  function animate() {
    trailX += (mouseX - trailX) * speed;
    trailY += (mouseY - trailY) * speed;
    setPos(trail, trailX, trailY);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Hover expand for interactive elements
  const interactiveSelector = "a, button, .btn, input, textarea, select, [role='button'], .card";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest?.(interactiveSelector)) trail.classList.add("is-hovering");
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest?.(interactiveSelector)) trail.classList.remove("is-hovering");
  });

  // Click ripple + subtle trail "press"
  document.addEventListener("click", (e) => {
    // ripple
    const ripple = document.createElement("div");
    ripple.className = "cursor-ripple";
    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";
    document.body.appendChild(ripple);

    ripple.addEventListener("animationend", () => ripple.remove());

    // trail press (works because it's the correct variable)
    trail.style.transform = "translate(-50%, -50%) scale(0.85)";
    setTimeout(() => {
      trail.style.transform = "translate(-50%, -50%) scale(1)";
    }, 120);
  });
})();
