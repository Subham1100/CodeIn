import Lenis from "@studio-freight/lenis";

export function initLenis(): Lenis {
  const lenis = new Lenis({
    duration: 4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
}
