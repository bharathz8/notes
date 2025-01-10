import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Extend the Request interface to include a user property
export interface AuthRequest extends Request {
  user?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
     res.status(401).json({ message: 'Access denied. No token provided.' });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.user = decoded.id;
    next();
  } catch (error) {
   res.status(401).json({ message: 'Invalid token.' });
   return;
  }
};
