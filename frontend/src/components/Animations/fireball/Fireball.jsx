import React from 'react'
import './Fireball.css'
const FireBall = () => {
    return (
        <div className="fire">
            <div className="fire-left">
                <div className="main-fire"></div>
                <div className="particle-fire"></div>
            </div>
            <div className="fire-center">
                <div className="main-fire"></div>
                <div className="particle-fire"></div>
            </div>
            <div className="fire-right">
                <div className="main-fire"></div>
                <div className="particle-fire"></div>
            </div>
            <div className="fire-bottom">
                <div className="main-fire"></div>
            </div>
        </div>
    )
}

export default FireBall
