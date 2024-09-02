import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export const isAuthenticated = (req: NextRequest): JwtPayload | null => {
  // const token = req.cookies.get('token') || null;

  // if (!token) {
  //   return null;
  // }

  // try {
  //   const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  //   return decodedToken;
  // } catch (error) {
  //   return null;
  // }
  return null;
};