interface OtpEntry {
    otp: string;
    expiresAt: number;
  }
  
  export const otpStore: Record<string, OtpEntry> = {};