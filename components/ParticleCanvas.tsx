'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVy: number;
  mass: number;
  size: number;
  opacity: number;
  opacityOffset: number;
  repulsionRadius: number;
}

interface ParticleCanvasProps {
  isMobile?: boolean;
}

export default function ParticleCanvas({ isMobile = false }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = isMobile ? 15 : 30;
    const REPULSION_RADIUS = 120;
    const REPULSION_FORCE = 0.08;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const createParticle = (): Particle => {
      const baseVy = -(Math.random() * 0.5 + 0.3);
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: baseVy * 0.5,
        baseVy: baseVy * 0.5,
        mass: Math.random() * 1.5 + 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.4,
        opacityOffset: Math.random() * Math.PI * 2,
        repulsionRadius: REPULSION_RADIUS,
      };
    };

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, createParticle);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    // Also listen on window for broader coverage
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        // Mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPULSION_RADIUS && dist > 0) {
          const force = (REPULSION_RADIUS - dist) * REPULSION_FORCE / p.mass;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Dampen velocity back toward base
        p.vx *= 0.97;
        p.vy = p.vy * 0.97 + p.baseVy * 0.03;

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap: top → reappear at bottom
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.vx = (Math.random() - 0.5) * 0.4;
        }

        // Left/right wrap
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Bottom check
        if (p.y > canvas.height + 10) p.y = -10;

        // Shimmer: pulsing opacity
        const shimmerOpacity = 0.4 + 0.4 * Math.abs(Math.sin(timeRef.current * 1.5 + p.opacityOffset));

        // Draw particle - gold dust
        ctx.save();
        ctx.globalAlpha = shimmerOpacity;

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        gradient.addColorStop(0, '#f0ebe4');
        gradient.addColorStop(0.4, '#e5d9cd');
        gradient.addColorStop(1, 'rgba(229, 217, 205, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f0ebe4';
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
