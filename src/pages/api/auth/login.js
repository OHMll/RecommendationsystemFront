import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Proxy the login request to your backend server
      const response = await axios.post('http://localhost:3000/api/auth/login', req.body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Forward the response from the backend
      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Login API error:', error);
      return res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || 'Login failed'
      });
    }
  } else {
    // Correct method for Next.js API routes
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}