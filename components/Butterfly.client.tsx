'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';

export default function ButterflyClient() {
    const controls = useAnimation();
    const shouldReduceMotion = useSafeReducedMotion();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Set initial dimensions
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (shouldReduceMotion) return;

        let isMounted = true;

        const fly = async () => {
            if (!isMounted) return;

            // Calculate random position
            const x = Math.random() * (dimensions.width - 50);
            const y = Math.random() * (dimensions.height - 50);
            const rotation = Math.random() * 360;
            const scale = 0.5 + Math.random() * 0.5; // Random size between 0.5 and 1

            // Animate to new position
            await controls.start({
                x,
                y,
                rotate: rotation,
                scale,
                transition: {
                    duration: 10 + Math.random() * 10, // Slow, graceful movement (10-20s)
                    ease: "easeInOut",
                },
            });

            // Flapping animation is handled by the child element loop

            if (isMounted) fly();
        };

        fly();

        return () => {
            isMounted = false;
        };
    }, [controls, dimensions, shouldReduceMotion]);

    if (shouldReduceMotion) return null;

    return (
        <motion.div
            className="fixed z-50 pointer-events-none top-0 left-0"
            animate={controls}
            style={{ opacity: 1 }}
        >
            {/* Butterfly Body/Wings Container */}
            <motion.div
                animate={{
                    scaleX: [1, 0.2, 1], // Flapping effect
                }}
                transition={{
                    duration: 0.25,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="filter drop-shadow-md"
            >
                <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Gradients */}
                    <defs>
                        <linearGradient id="wingGradientLeft" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#FBDA61" />
                            <stop offset="50%" stopColor="#FF5ACD" />
                            <stop offset="100%" stopColor="#85FFBD" />
                        </linearGradient>
                        <linearGradient id="wingGradientRight" x1="1" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#85FFBD" />
                            <stop offset="50%" stopColor="#FF5ACD" />
                            <stop offset="100%" stopColor="#FBDA61" />
                        </linearGradient>
                    </defs>

                    {/* Left Wing - Upper */}
                    <path
                        d="M24 25 C 20 15, 5 5, 2 15 C 0 25, 20 25, 24 25"
                        fill="url(#wingGradientLeft)"
                        opacity="0.9"
                    />
                    {/* Left Wing - Lower */}
                    <path
                        d="M24 25 C 20 35, 5 45, 8 35 C 10 28, 22 28, 24 25"
                        fill="url(#wingGradientLeft)"
                        opacity="0.8"
                    />

                    {/* Right Wing - Upper */}
                    <path
                        d="M26 25 C 30 15, 45 5, 48 15 C 50 25, 30 25, 26 25"
                        fill="url(#wingGradientRight)"
                        opacity="0.9"
                    />
                    {/* Right Wing - Lower */}
                    <path
                        d="M26 25 C 30 35, 45 45, 42 35 C 40 28, 28 28, 26 25"
                        fill="url(#wingGradientRight)"
                        opacity="0.8"
                    />

                    {/* Body */}
                    <ellipse cx="25" cy="25" rx="1.5" ry="10" fill="#333" />
                    {/* Antennae */}
                    <path d="M25 15 Q 22 10 20 12" stroke="#333" strokeWidth="1" fill="none" />
                    <path d="M25 15 Q 28 10 30 12" stroke="#333" strokeWidth="1" fill="none" />
                </svg>
            </motion.div>
        </motion.div>
    );
}
