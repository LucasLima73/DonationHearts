declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  // Define o tipo de função que o módulo exporta
  function confetti(options?: ConfettiOptions): Promise<null>;
  
  // Define propriedades extras
  namespace confetti {
    function reset(): void;
    function create(canvas: HTMLCanvasElement, options?: { resize?: boolean; useWorker?: boolean }): {
      (options?: ConfettiOptions): Promise<null>;
      reset: () => void;
    };
  }
  
  export = confetti;
}