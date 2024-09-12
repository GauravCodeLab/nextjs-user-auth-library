// utils/db.ts
import mongoose from 'mongoose';

// Define the connection type for better type safety
type MongooseConnection = mongoose.Mongoose & { connections: mongoose.Connection[] };

// Define a function to retrieve an existing connection or create a new one
const getDatabaseConnection = async (): Promise<MongooseConnection> => {
    // Check if there's an existing connection
    if (mongoose.connections[0].readyState) {
        return mongoose as MongooseConnection;
    }

    // Get the MongoDB URI from the environment variable
    const uri = process.env.NEXT_MONGODB_URI;
    if (!uri) {
        throw new Error('NEXT_MONGODB_URI environment variable is not set');
    }

    try {
        // Establish a new connection to MongoDB
        await mongoose.connect(uri, {
            // Options removed if using Mongoose 6.x or later
            // Additional options can be added here
        });
        console.log('Connected to MongoDB');
        return mongoose as MongooseConnection;
    } catch (error) {
        // Log and rethrow the error to ensure it's propagated
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

export default getDatabaseConnection;
