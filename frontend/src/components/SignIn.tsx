import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthForm from './AuthForm';
import { useNavigate } from 'react-router-dom';

interface SignInFormData {
  email: string;
  otp: string;
  [key: string]: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [prevEmail, setPrevEmail] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);

  const sendOtp = async (email: string) => {
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      alert('OTP sent successfully to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please try again.');
    }
  };

  const handleSignIn = async (formData: SignInFormData) => {
    try {
      // Email was changed
      if (formData.email !== prevEmail) {
        setPrevEmail(formData.email);
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          alert('Please enter a valid email address');
          return;
        }

        // Show OTP field and send OTP after delay
        setTimeout(() => {
          setShowOtpField(true);
          sendOtp(formData.email);
        }, 3000); // 2 second delay
        
        return;
      }

      // If OTP is provided, verify it
      if (formData.otp) {
        const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
          email: formData.email,
          otp: formData.otp
        });
        localStorage.setItem('authToken', response.data.token);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <AuthForm<SignInFormData>
      title="Sign In"
      tagLine="Please enter your email to login"
      buttonText="Sign In"
      fields={[
        { name: 'email', type: 'email', placeholder: 'Email' },
        ...(showOtpField ? [{ name: 'otp', type: 'text', placeholder: 'Enter OTP' }] : [])
      ]}
      onSubmit={handleSignIn}
      redirectText="Don't have an account?"
      redirectLink="Sign up"
      redirectUrl="/signup"
    />
  );
};

export default SignIn;