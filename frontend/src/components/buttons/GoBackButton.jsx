import { useNavigate } from "react-router-dom";

export default function GoBackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="bg-slate-950 text-center w-36 rounded-xl h-11 relative text-white text-lg font-semibold group overflow-hidden border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer"
            type="button"
            aria-label="Go back to previous page"
        >
            {/* Glow effects */}
            <div className="absolute -left-0.5 bottom-0 w-1 h-full bg-cyan-400/70 blur-sm group-hover:bg-cyan-400/90 transition-all duration-300"></div>
            <div className="absolute left-0 -bottom-0.5 w-full h-1 bg-cyan-400/70 blur-sm group-hover:bg-cyan-400/90 transition-all duration-300"></div>
            
            {/* Animated arrow container */}
            <div className="bg-cyan-400 rounded-lg h-9 w-1/3 flex items-center justify-center absolute left-1 top-[3px] group-hover:w-[135px] z-10 duration-500 ease-in-out">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                    height="20px"
                    width="20px"
                    className="transition-transform duration-300 group-hover:translate-x-2"
                >
                    <path
                        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                        fill="#000000"
                    ></path>
                    <path
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                        fill="#000000"
                    ></path>
                </svg>
            </div>
            
            {/* Text */}
            <p className="translate-x-6 transition-all duration-300 group-hover:translate-x-5 text-white/90 group-hover:text-white">
                Go Back
            </p>
        </button>
    );
}