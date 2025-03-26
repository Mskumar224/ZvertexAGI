import React, { useState } from 'react';
import axios from 'axios';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      setMessage('Password reset email sent');
    } catch (error) {
      setMessage('Error sending reset email');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={handleReset}>Send Reset Link</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;