import React from "react";
import "./Loader.css"; // We'll extract the CSS into a separate file

const Loader = () => {
    return (
        <div class="typewriter">
            <div class="slide"><i></i></div>
            <div class="paper"></div>
            <div class="keyboard"></div>
        </div>

    );
};

export default Loader;