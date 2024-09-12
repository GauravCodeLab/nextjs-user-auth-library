import { NextApiResponse } from 'next';
interface User {
    _id: string;
    email: string;
}
interface TokenPayload {
    id: string;
    email: string;
}
declare const createToken: (user: User) => Promise<string>;
declare const hashPassword: (password: string) => Promise<string>;
declare const verifyPassword: (password: string, hashedPassword: string) => Promise<boolean>;
declare const setTokenCookie: (res: NextApiResponse, token: string) => void;
declare const removeTokenCookie: (res: NextApiResponse) => void;
declare const verifyToken: (token: string) => Promise<TokenPayload | null>;
export { createToken, verifyToken, hashPassword, verifyPassword, setTokenCookie, removeTokenCookie };
