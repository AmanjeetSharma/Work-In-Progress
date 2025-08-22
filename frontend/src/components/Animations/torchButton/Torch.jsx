import './Torch.css';

const Torch = () => {
    return (
        <div class="light-button">
            <button class="bt">
                <div class="light-holder">
                    <div class="dot"></div>
                    <div class="light"></div>
                </div>
                <div class="button-holder">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
           0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 
           14l.84-2h8.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 
           21 3H5.21l-.94-2H1v2h2l3.6 7.59-1.35 
           2.44C4.52 13.37 5.48 15 7 15h12v-2H7.42z"/>
                    </svg>
                    <p>Shop Now</p>
                </div>
            </button>
        </div>

    )
}

export default Torch;
