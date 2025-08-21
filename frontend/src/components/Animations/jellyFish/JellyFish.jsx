import React from 'react'
import './JellyFish.css'; // Assuming you have a CSS file for styles

const JellyFish = () => {
    return (
        <div className="loader-container">
            <div className="jellyfish">
                <div className="jellyfish-head"></div>
                <div className="tentacles">
                    <div className="tentacle"></div>
                    <div className="tentacle"></div>
                    <div className="tentacle"></div>
                    <div className="tentacle"></div>
                    <div className="tentacle"></div>
                </div>
            </div>

            <div className="bubbles">
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
            </div>
        </div>

    )
}

export default JellyFish
