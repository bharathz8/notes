"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a transport using Gmail SMTP server
        const transporter = nodemailer_1.default.createTransport({
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
        const info = yield transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    }
    catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw new Error('Failed to send OTP');
    }
});
exports.sendOTP = sendOTP;
