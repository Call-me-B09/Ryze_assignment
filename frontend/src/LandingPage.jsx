import React from 'react';
import { motion } from 'framer-motion';

export default function LandingPage({ onStart }) {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-zinc-950 font-sans text-white selection:bg-cyan-500/30">

            {/* Background Gradients/Orbs with Floating Animation */}
            <motion.div
                animate={{
                    y: [0, -40, 0],
                    x: [0, 20, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/30 blur-[120px]"
            />
            <motion.div
                animate={{
                    y: [0, 50, 0],
                    x: [0, -30, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-cyan-600/20 blur-[100px]"
            />
            <motion.div
                animate={{
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute top-[40%] left-[30%] h-[300px] w-[300px] rounded-full bg-fuchsia-600/20 blur-[80px]"
            />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 pointer-events-none"></div>

            {/* Content Container */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-6">

                {/* Glass Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex max-w-2xl flex-col items-center text-center p-12 rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl ring-1 ring-white/10 relative overflow-hidden group"
                >
                    {/* Subtle Card Shine/Glow on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                    {/* Icon/Logo Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                        className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 relative z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <h1 className="mb-6 text-6xl font-bold tracking-tight text-white sm:text-7xl drop-shadow-sm">
                            Ryze <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300">AI</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="mb-12 text-xl text-zinc-300 leading-relaxed max-w-lg font-light tracking-wide"
                    >
                        Generate production-ready UI components instantly.
                        <br />
                        <span className="text-white/60 text-base mt-2 block">Design at the speed of thought.</span>
                    </motion.p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        onClick={onStart}
                        className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white px-10 py-4 text-lg font-semibold text-black transition-all hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                    >
                        <span className="relative z-10">Start Building</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-transform group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                    </motion.button>

                </motion.div>

                {/* Footer Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-8 text-sm text-zinc-500 font-medium tracking-widest uppercase opacity-50"
                >
                    Powered by Antigravity
                </motion.div>

            </div>

            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
}
