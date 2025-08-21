// refreshToken.js
import axios from 'axios';


// 🔎 Explanation

// Access token is short-lived. Stored in localStorage.
// Refresh token is in a cookie (HttpOnly, so frontend can’t access it directly).
// When access token expires and returns 401, frontend uses refresh token (from cookie) to get a new access token automatically.

const refreshToken = async () => {
    try {
        // Make an API call to refresh the token
        const response = await axios.post(import.meta.env.VITE_API_URL + '/auth/refresh-token', null, {
            withCredentials: true, // Ensure the refresh token is sent in cookies
        });

        // Get the new access token from the response
        const newAccessToken = response.data.accessToken;
        // Save the new access token in localStorage
        localStorage.setItem('accessToken', newAccessToken);

        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error; // If refresh fails, throw error
    }
};

export default refreshToken;
