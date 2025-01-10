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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("../models/userModel");
const otpStore_1 = require("../utils/otpStore");
const nodeMailerConfig_1 = require("../utils/nodeMailerConfig");
const authValidator_1 = require("../validator/authValidator");
const router = express_1.default.Router();
// Register and send OTP
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        authValidator_1.authSchema.parse(req.body);
        const { name, email, password } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore_1.otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
        yield (0, nodeMailerConfig_1.sendOTP)(email, otp);
        let user = yield userModel_1.UserModel.findOne({ email });
        if (!user) {
            user = new userModel_1.UserModel({ name, email, password: hashedPassword });
            yield user.save();
        }
        res.status(200).json({ message: 'OTP sent to email' });
    }
    catch (err) {
        res.status(400).json({ error: 'Validation error', details: err.errors });
    }
}));
router.post('/verify', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, otp } = req.body;
            const storedOtp = otpStore_1.otpStore[email];
            if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
                res.status(400).json({ message: 'Invalid or expired OTP' });
                return;
            }
            const user = yield userModel_1.UserModel.findOne({ email });
            if (!user) {
                res.status(400).json({ message: 'User not found' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        }
        catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
exports.default = router;
