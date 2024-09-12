"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var server_1 = require("next/server");
function middleware(req) {
    var _a;
    // const token = (req.cookies as unknown as { [key: string]: string })['auth'];
    var token = (_a = req.cookies.get('auth')) === null || _a === void 0 ? void 0 : _a.value;
    // Early return if no token is present
    if (!token) {
        return server_1.NextResponse.redirect(new URL('/login', req.url));
    }
    var jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET is not defined in environment variables.');
        return server_1.NextResponse.error();
    }
    try {
        // Verify the token and return next response if successful
        jsonwebtoken_1.default.verify(token, jwtSecret);
        return server_1.NextResponse.next();
    }
    catch (error) {
        // Log the error for debugging purposes
        console.error('Error verifying token:', error);
        // Redirect to login page if token verification fails
        return server_1.NextResponse.redirect(new URL('/login', req.url));
    }
}
//# sourceMappingURL=middleware.js.map