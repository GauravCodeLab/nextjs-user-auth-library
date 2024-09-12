import mongoose from 'mongoose';
declare const getDatabaseConnection: () => Promise<typeof mongoose>;
export default getDatabaseConnection;
