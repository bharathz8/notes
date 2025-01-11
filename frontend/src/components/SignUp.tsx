import React, { useState } from 'react';
import axios from 'axios';
import AuthForm from './AuthForm';
import { useNavigate } from 'react-router-dom';

interface SignUpFormData {
  name: string;
  email: string;
  dob: string;
  otp: string;
  [key: string]: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [prevEmail, setPrevEmail] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);

  const sendOtp = async (email: string) => {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { email });
      alert('OTP sent successfully to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please try again.');
    }
  };

  const handleSignUp = async (formData: SignUpFormData) => {
    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.dob) {
        alert('Please fill in all fields');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // If email changed
      if (formData.email !== prevEmail) {
        setPrevEmail(formData.email);
        
        // Show OTP field and send OTP after delay
        setTimeout(() => {
          setShowOtpField(true);
          sendOtp(formData.email);
        }, 2000); // 2 second delay
        
        return;
      }

      // If OTP is provided, complete registration
      if (formData.otp) {
        const response = await axios.post('http://localhost:5000/api/auth/verify', {
          name: formData.name,
          email: formData.email,
          dob: formData.dob,
          otp: formData.otp
        });
        
        console.log('Registration success:', response.data);
        alert('Registration successful! Please login.');
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <AuthForm<SignUpFormData>
      title="Sign Up"
      tagLine="Create your account to get started"
      buttonText="Sign Up"
      fields={[
        { name: 'name', type: 'text', placeholder: 'Name' },
        { name: 'email', type: 'email', placeholder: 'Email' },
        { name: 'dob', type: 'date', placeholder: 'Date of Birth' },
        ...(showOtpField ? [{ name: 'otp', type: 'text', placeholder: 'Enter OTP' }] : [])
      ]}
      onSubmit={handleSignUp}
      redirectText="Already have an account?"
      redirectLink="Log in"
      redirectUrl="/signin"
    />
  );
};

export default SignUp;