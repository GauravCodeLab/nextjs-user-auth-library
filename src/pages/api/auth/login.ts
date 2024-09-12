import connectToDatabase from '../../../utils/database';
import UserModel  from '../../../models/User';
import { verifyPassword, createToken } from '../../../lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { CookieSerializeOptions, serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
  }

  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email and password are required' });
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const user = await UserModel.findOne({ email });
    
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid password' });
    }

    // Create a token for the user
    const token = await createToken(user);

    // Set the token cookie with secure flags
    const cookieOptions: CookieSerializeOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Ensure 'Strict' is used instead of 'strict'
      path: '/',
    };

    const cookieString = serialize('token', token, cookieOptions);
    res.setHeader('Set-Cookie', cookieString);
    
    // Log the successful login
    console.log(`User ${user.email} logged in successfully.`);
    return res.json({ message: 'Logged in successfully' });

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Login error:', error);

    // Return a generic error response to the client
    return res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred during login' });
  }
}
