import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};
