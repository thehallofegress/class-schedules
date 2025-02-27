"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
function Bubble({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
    return (
        <motion.circle
            cx={x}
            cy={y}
            r={size}
            fill={color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0.7, 0.3, 0.7],
                scale: [1, 1.2, 1],
                x: x + Math.random() * 50 - 25,
                y: y + Math.random() * 50 - 25,
            }}
            transition={{
                duration: 5 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
            }}
        />
    );
}

export default function FloatingBubbles() {
    const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([]);

    useEffect(() => {
        const generateBubbles = () => {
            const bubbleCount = window.innerWidth < 768 ? 20 : 50; // Fewer bubbles on mobile
            return Array.from({ length: bubbleCount }, (_, i) => ({
                id: i,
                x: Math.random() * (window.innerWidth - 50) + 25,
                y: Math.random() * (window.innerHeight - 50) + 25,
                size: Math.random() * 20 + 5,
                color: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.3)`,
            }));
        };

        setBubbles(generateBubbles());

        const handleResize = () => setBubbles(generateBubbles());
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full">
                {bubbles.map((bubble) => (
                    <Bubble key={bubble.id} {...bubble} />
                ))}
            </svg>
        </div>
    );
}
