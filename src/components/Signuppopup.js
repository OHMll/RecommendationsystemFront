import React, { useState } from 'react';
import { fetchDataApi } from "@/utils/api";

export default function Signuppopup({ 
  isOpen, 
  onClose, 
  onSwitchToLogin,
  onSuccessfulSignup
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError("Please complete all required inputs!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setIsRegistering(true);
      
      // First check if user already exists
      const checkUserResult = await fetchDataApi('POST', 'auth/checkuser', { 
        email: email.toLowerCase() 
      });

      if (checkUserResult.error) {
        setError(checkUserResult.error);
        return;
      }

      if (checkUserResult.user) {
        setError("User already exists");
        return;
      }

      // If user doesn't exist, proceed with registration
      const registerResult = await fetchDataApi('POST', 'auth/register', { 
          username, 
          email: email.toLowerCase(), 
          password,
          firstname,
          lastname
      });

      if (registerResult.error) {
        setError(registerResult.error);
        return;
      }

        setError("");
        setSuccess("User registration successful!");
        
        // Store user data if needed
      if (registerResult.token) {
        localStorage.setItem('token', registerResult.token);
          localStorage.setItem('username', username);
        }
        
        // Notify parent component about successful signup
        if (onSuccessfulSignup) {
        onSuccessfulSignup(username, registerResult.token);
        }
        
        // Close the modal after successful signup
        onClose();
      
    } catch (error) {
      console.error("Error during registration: ", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-96 relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-2xl">×</button>
          <h2 className="text-2xl mb-2">Sign Up</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-500 mb-2">{success}</p>}
          <form onSubmit={handleSignup} className='mt-2'>
            <input 
              type="text" 
              name="username" 
              placeholder="Username *" 
              className="w-full p-2 mb-4 border rounded" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                name="firstname" 
                placeholder="First Name" 
                className="w-1/2 p-2 mb-4 border rounded" 
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <input 
                type="text" 
                name="lastname" 
                placeholder="Last Name" 
                className="w-1/2 p-2 mb-4 border rounded" 
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            <input 
              type="email" 
              name="email" 
              placeholder="Email *" 
              className="w-full p-2 mb-4 border rounded" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password *" 
              className="w-full p-2 mb-4 border rounded" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Confirm Password *" 
              className="w-full p-2 mb-4 border rounded" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
            <button 
              type="submit" 
              className="bg-[#2A3663] text-white px-4 py-2 rounded flex items-center justify-center w-full"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <button 
              onClick={onSwitchToLogin} 
              className="text-[#2A3663] font-bold"
              type="button"
            >
              Login
            </button>
          </p>
        </div>
      </div>
  );
}