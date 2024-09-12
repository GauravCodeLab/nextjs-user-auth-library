import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookie from 'cookie'; 
import { NextApiRequest, NextApiResponse } from 'next';

// Define interfaces for User and TokenPayload
interface User {
    _id: string;
    email: string;
}
  
interface TokenPayload {
    id: string;
    email: string;
}

// Define constants for JWT secret and salt rounds
const jwtSecret: string = process.env.JWT_SECRET || 'default-secret';
const saltRounds: number = 12;

// Create a function to create a JWT token for a user
const createToken = async (user: User): Promise<string> => {
    if (!user || !user._id || !user.email) {
      throw new Error('Invalid user');
    }
    const TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY || '1h'; // Default to 1 hour if not specified
     
    const payload: TokenPayload = { id: user._id, email: user.email };
    const token: string = jwt.sign(payload, jwtSecret, { expiresIn: TOKEN_EXPIRY });
    return token;
};

// Create a function to hash a password using bcrypt
const hashPassword = async (password: string): Promise<string> => {
    if (!password) {
      throw new Error('Password is required');
    }
  
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Password hashing failed');
    }
};

// Create a function to verify a password against a hashed password
const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    if (!password || !hashedPassword) {
      return false;
    }
  
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};

// Function to set token cookie in the response

const setTokenCookie = (res: NextApiResponse, token: string): void => {
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const cookieOptions: cookie.CookieSerializeOptions = {
        httpOnly: true,
        expires: oneHourFromNow,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' // Ensure SameSite is correctly set
    };
  
    const COOKIE_NAME = 'token';
    const setCookieHeaderValue = cookie.serialize(COOKIE_NAME, token, cookieOptions);
    res.setHeader('Set-Cookie', setCookieHeaderValue);
};


// Function to remove token cookie
const removeTokenCookie = (res: NextApiResponse): void => {
    const COOKIE_NAME = 'token';
    res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: new Date(0), // Expire the cookie immediately
        sameSite: 'strict' // Ensure SameSite is correctly capitalized
    }));
};

// Function to verify the JWT token
const verifyToken = async (token: string): Promise<TokenPayload | null> => {
    if (!isValidToken(token)) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error('Token expired:', error);
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error('Invalid token:', error);
        } else {
            console.error('Error verifying token:', error);
        }
        return null;
    }
};

// Helper function to check if token is valid
const isValidToken = (token: string): boolean => {
    return typeof token === 'string' && token.trim() !== '';
};

export { createToken, verifyToken, hashPassword, verifyPassword, setTokenCookie, removeTokenCookie };
