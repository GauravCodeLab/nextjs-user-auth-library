// pages/api/protected-route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import authMiddleware from '../../middleware'; // Adjust the path accordingly

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Your protected route logic here
  res.status(200).json({ message: 'This is a protected route' });
};

export default authMiddleware(handler);
