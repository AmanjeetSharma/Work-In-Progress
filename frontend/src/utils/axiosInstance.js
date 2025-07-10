// axiosInstance.js
import axios from 'axios';
import refreshToken from './refreshToken'; // Import the refreshToken utility

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Your backend API base URL
  withCredentials: true, // Send cookies with every request (important for sending refresh token)
});







// 🔎 Explanation

// Runs before each request.
// Checks if access token exists in localStorage.
// If yes, attaches it to Authorization header as Bearer <token>.

// Request Interceptor:-------------
api.interceptors.request.use(
  (config) => {
    // Get the access token from localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Attach the access token to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);




// // 🔎 Explanation
// Runs after each response basically runs after a request fails.
// Checks if error is 401 Unauthorized (means access token expired).
// Calls refreshToken() to get a new access token.
// Updates original request with new token.
// Retries original request using axios(error.config).


// Response interceptor:-------------
api.interceptors.response.use(
  (response) => response, // If the request succeeds, return the response
  async (error) => {
    // If we get a 401 error (Unauthorized), it could mean the access token has expired
    if (error.response.status === 401) {
      try {
        // Attempt to refresh the access token using the refresh token
        const newAccessToken = await refreshToken(); // Refresh the token
        // Set the new access token in the original request headers
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        // Retry the original request with the new token
        return axios(error.config);
      } catch (refreshError) {
        console.error('Unable to refresh token', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
