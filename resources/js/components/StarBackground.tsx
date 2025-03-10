
import React, { useRef, useEffect } from 'react';

const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;  // Full viewport height for more presence
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star properties
    const stars: {
      x: number;
      y: number;
      radius: number;
      color: string;
      velocity: number;
      alpha: number;
      rotation: number;
      pulse: number;
    }[] = [];

    // Create stars - more stars for more presence
    const createStars = () => {
      const starCount = Math.floor(window.innerWidth / 4); // Double the stars
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2.5; // Bigger stars
        const colors = ['#ffffff', '#f1f1f1', '#e1e1ff', '#d4f1f9', '#e1f6ff', '#0EA5E9', '#38BDF8'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const velocity = Math.random() * 0.08;
        const alpha = Math.random() * 0.9 + 0.3; // More opacity
        const rotation = Math.random() * Math.PI * 2;
        const pulse = Math.random() * 0.1 + 0.05;

        stars.push({ x, y, radius, color, velocity, alpha, rotation, pulse });
      }
    };

    createStars();

    // Animation
    let lastTime = 0;
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      stars.forEach(star => {
        // Update star position
        star.y += star.velocity * deltaTime;
        star.rotation += 0.001 * deltaTime;
        
        // Pulse effect
        star.radius += Math.sin(timestamp * 0.001) * star.pulse;
        star.alpha = 0.3 + (Math.sin(timestamp * 0.001 + star.x) + 1) * 0.5;

        // Reset star if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // Draw star
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.rotation);
        ctx.globalAlpha = star.alpha;
        
        // Draw a star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const outerRadius = star.radius * 2;
          const innerRadius = star.radius;
          const outerX = Math.cos(((i * 2 * Math.PI) / 5) - Math.PI / 2) * outerRadius;
          const outerY = Math.sin(((i * 2 * Math.PI) / 5) - Math.PI / 2) * outerRadius;
          const innerX = Math.cos((((i * 2) + 1) * Math.PI / 5) - Math.PI / 2) * innerRadius;
          const innerY = Math.sin((((i * 2) + 1) * Math.PI / 5) - Math.PI / 2) * innerRadius;
          
          if (i === 0) {
            ctx.moveTo(outerX, outerY);
          } else {
            ctx.lineTo(outerX, outerY);
          }
          
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        
        // Fill with gradient for more vibrant effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, star.radius * 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, star.color);
        gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-screen -z-10 opacity-80"
    />
  );
};

export default StarBackground;
