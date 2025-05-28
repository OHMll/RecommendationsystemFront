import React, { useState, useEffect } from 'react';

export default function PopupOTP({ 
  isOpen, 
  onClose, 
  password,
  onVerificationSuccess,
  username
}) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // OTP timeout countdown
  useEffect(() => {
    let timer;
    if (isOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, isOpen]);

  // Automatically send OTP when popup opens
  useEffect(() => {
    if (isOpen && username) {
      sendOTP();
    }
  }, [isOpen, username]);

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    setCanResend(false);
    
    try {
      const response = await fetch('http://localhost:8000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      if (response.ok) {
        setCountdown(60); // Reset countdown
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send OTP. Please try again.');
        setCanResend(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Network error. Please try again.');
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username,
          otp,
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token if available
        if (data.token) {
          localStorage.setItem('token', data.token);
          if (username) {
            localStorage.setItem('username', username);
          }
        }
        
        // Call success callback
        if (onVerificationSuccess) {
          onVerificationSuccess(data.token);
        }
        
        // Close popup
        onClose();
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-2xl"
          type="button"
        >
          ×
        </button>
        
        <h2 className="text-2xl mb-4 text-center">Verify Your Email</h2>
        
        <p className="mb-6 text-center text-gray-600">
          We've sent a verification code to <span className="font-medium">{username}</span>
        </p>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <form onSubmit={verifyOTP}>
          <div className="mb-6">
            <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-700">
              Enter OTP Code
            </label>
            <input 
              type="text" 
              id="otp"
              placeholder="Enter 6-digit code" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              maxLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#2A3663] text-white p-3 rounded-md hover:bg-opacity-90 transition disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          {canResend ? (
            <button 
              onClick={sendOTP} 
              className="text-[#2A3663] font-medium"
              disabled={loading}
              type="button"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500">
              Resend OTP in {countdown} seconds
            </p>
          )}
        </div>
      </div>
    </div>
  );
}