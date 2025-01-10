import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/userModel';
import { otpStore } from '../utils/otpStore';
import { sendOTP } from '../utils/nodeMailerConfig';
import { authSchema } from '../validator/authValidator';
import { AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();

// Register and send OTP
router.post('/register', async (req: Request, res: Response) => {
  try {
    authSchema.parse(req.body);
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
    await sendOTP(email, otp);

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({ name, email, password: hashedPassword });
      await user.save();
    }

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err: any) {
    res.status(400).json({ error: 'Validation error', details: err.errors });
  }
});

router.post('/verify', async function (req: AuthRequest, res: Response) {
  try {
    const { email, otp } = req.body;
    const storedOtp = otpStore[email];

    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
