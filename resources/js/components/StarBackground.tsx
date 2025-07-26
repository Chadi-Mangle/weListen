
import React, { useEffect, useRef } from 'react';

interface StarBackgroundProps {
  intensity?: number;
  speed?: number;
}

const StarBackground = ({ intensity = 1, speed = 1 }: StarBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Star {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = (Math.random() * 0.2 + 0.1) * speed;
        this.opacity = Math.random() * 0.7 + 0.3;
      }
      
      update() {
        this.y += this.speedY;
        
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const stars: Star[] = [];
    const starCount = 100 * intensity;
    
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
    
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [intensity, speed]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-10 pointer-events-none"
    />
  );
};

export default StarBackground;