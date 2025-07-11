const GradientText = ({ children }) => {
    return (
        <span
            className="relative inline-block text-2xl md:text-3xl font-extrabold tracking-tighter"
        >
            {/* Gradient text with shimmer effect */}
            <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-400 bg-[length:400%_400%] animate-gradient-shimmer"
            >
                {children}
            </span>
            
            {/* Subtle glow effect */}
            <span 
                className="absolute inset-0 -z-10 opacity-75 blur-lg bg-gradient-to-r from-cyan-400/40 via-fuchsia-500/40 to-purple-500/40 animate-gradient-shimmer"
                style={{ animationDelay: '0.2s' }}
            />
        </span>
    );
};

export default GradientText;