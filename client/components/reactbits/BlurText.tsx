'use client';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    variant?: Variants;
}

export const BlurText = ({
    text,
    delay = 0,
    className = '',
    variant,
}: BlurTextProps) => {
    const defaultVariants: Variants = {
        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
        visible: { filter: 'blur(0px)', opacity: 1, y: 0, transition: { duration: 0.8, delay } },
    };

    const combinedVariants = variant || defaultVariants;

    return (
        <motion.h1
            initial="hidden"
            animate="visible"
            variants={combinedVariants}
            className={cn("text-center tracking-tighter drop-shadow-sm", className)}
        >
            {text}
        </motion.h1>
    );
};
