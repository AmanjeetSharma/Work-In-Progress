import React from "react";
import "./Loader.css";

const LoaderPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center" style={{ backdropFilter: "blur(4px)" }}>
            <Loader />
        </div>
    );
};

const Loader = () => {
    return (
        <div className="loader3">
            <div className="bars bar1"></div>
            <div className="bars bar2"></div>
            <div className="bars bar3"></div>
            <div className="bars bar4"></div>
            <div className="bars bar5"></div>
            <div className="bars bar6"></div>
            <div className="bars bar7"></div>
            <div className="bars bar8"></div>
            <div className="bars bar9"></div>
            <div className="bars bar10"></div>
        </div>
    );
};

export default LoaderPage;