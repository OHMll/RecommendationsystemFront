import React, { useState } from 'react';
import { fetchDataApi } from "@/utils/api";
import PopupOTP from './PopupOTP';

export default function Loginpopup({ 
  isOpen, 
  onClose, 
  onSwitchToSignup,
  onSuccessfulLogin
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please complete all inputs!");
      return;
    }

    try {
      setIsLoggingIn(true);
      const result = await fetchDataApi('POST', 'auth/login', { username, password });
      console.log('Login Result:', result);
      if (result.error) {
        setError(result.error);
        return;
      }
      else{
        handleOtpSuccess(result.token);
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setError("Error Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleOtpSuccess = async (token) => {
    try {
      // Store token and username
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        
        setSuccess("Login successful!");
        setError("");
        
        // Notify parent component about successful login
        if (onSuccessfulLogin) {
          onSuccessfulLogin(username, token);
        }
        
        // Close the modal after successful login
        onClose();
        
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setError("Error during OTP verification");
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">×</button>
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            className="w-full p-2 mb-4 border rounded" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            className="w-full p-2 mb-4 border rounded" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button 
            type="submit" 
              className="bg-[#2A3663] text-white px-4 py-2 rounded w-full flex items-center justify-center"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังดำเนินการ...
                </>
              ) : (
                "Login"
              )}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button 
            onClick={onSwitchToSignup} 
            className="text-[#2A3663] font-bold"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>

      {/* <PopupOTP 
        isOpen={showOtpPopup}
        onClose={() => setShowOtpPopup(false)}
        email={username}
        password={password}
        username={username}
        onVerificationSuccess={handleOtpSuccess}
      /> */}
    </>
  );
}