import connectToDatabase from '../../../utils/database'; // Make sure this path is correct
import  UserModel  from '../../../models/User';
import { hashPassword } from '../../../lib/auth';
import { NextApiRequest, NextApiResponse } from 'next'; 

// Helper function for email validation
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Define the handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Connect to the database
        await connectToDatabase();

        // Extract email and password from the request body
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address format' });
        }

        // Check if a user with the same email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const user = new UserModel({ email, password: hashedPassword });

        // Save the user to the database
        await user.save();

        // Return a success response
        return res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        // Log and return a generic error response
        console.error('Registration error:', error);

        // Provide a generic message to avoid leaking implementation details
        return res.status(500).json({ message: 'Error registering user' });
    }
}
