import nodemailer from 'nodemailer';

export const sendOTP = async (email: string, otp: string) => {
  try {
    // Create a transport using Gmail SMTP server
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email,                   
      subject: 'Your OTP Code',      
      text: `Your OTP is ${otp}`,   
      html: `<p>Your OTP is <strong>${otp}</strong></p>`, 
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error: any) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error('Failed to send OTP');
  }
};
