import { motion } from "framer-motion";

export default function Spinner({ color = "bg-tertiary", size = 8 }) {
    const bars = [0, 1, 2, 3, 4];

    return (
        <div className="flex items-center justify-center space-x-1">
            {bars.map((bar) => (
                <motion.span
                    key={bar}
                    className={`${color} rounded-full`}
                    style={{
                        width: size /2 ,
                        height: size * 2,
                    }}
                    animate={{
                        scaleY: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: bar * 0.1,
                    }}
                />
            ))}
        </div>
    );
}
