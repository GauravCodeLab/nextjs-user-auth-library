"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTokenCookie = exports.setTokenCookie = exports.verifyPassword = exports.hashPassword = exports.verifyToken = exports.createToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var cookie_1 = __importDefault(require("cookie"));
// Define constants for JWT secret and salt rounds
var jwtSecret = process.env.JWT_SECRET || (function () {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is not set in environment variables');
    }
    return 'default-secret';
})();
var saltRounds = 12;
// Create a function to create a JWT token for a user
var createToken = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var TOKEN_EXPIRY, payload, token;
    return __generator(this, function (_a) {
        if (!user || !user._id || !user.email) {
            throw new Error('Invalid user');
        }
        TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY || '1h';
        payload = { id: user._id, email: user.email };
        token = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: TOKEN_EXPIRY });
        return [2 /*return*/, token];
    });
}); };
exports.createToken = createToken;
// Create a function to hash a password using bcrypt
var hashPassword = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var salt, hashedPassword, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!password) {
                    throw new Error('Password is required');
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, bcryptjs_1.default.genSalt(saltRounds)];
            case 2:
                salt = _a.sent();
                return [4 /*yield*/, bcryptjs_1.default.hash(password, salt)];
            case 3:
                hashedPassword = _a.sent();
                return [2 /*return*/, hashedPassword];
            case 4:
                error_1 = _a.sent();
                console.error('Error hashing password:', error_1);
                throw new Error('Password hashing failed');
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.hashPassword = hashPassword;
var verifyPassword = function (password, hashedPassword) { return __awaiter(void 0, void 0, void 0, function () {
    var isValid, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!password || !hashedPassword) {
                    return [2 /*return*/, false];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, bcryptjs_1.default.compare(password, hashedPassword)];
            case 2:
                isValid = _a.sent();
                return [2 /*return*/, isValid];
            case 3:
                error_2 = _a.sent();
                console.error('Error comparing passwords:', error_2);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyPassword = verifyPassword;
// Function to set token cookie in the response
var setTokenCookie = function (res, token) {
    var oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    var cookieOptions = {
        httpOnly: true,
        expires: oneHourFromNow,
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Secure in production only
    };
    var COOKIE_NAME = 'token';
    var setCookieHeaderValue = cookie_1.default.serialize(COOKIE_NAME, token, cookieOptions) + '; SameSite=Strict';
    res.setHeader('Set-Cookie', setCookieHeaderValue);
};
exports.setTokenCookie = setTokenCookie;
// Function to remove the token cookie from the response
var removeTokenCookie = function (res) {
    var COOKIE_NAME = 'token';
    res.setHeader('Set-Cookie', cookie_1.default.serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: new Date(0), // Expire the cookie immediately
        sameSite: 'strict',
    }));
};
exports.removeTokenCookie = removeTokenCookie;
// Function to verify the JWT token
var verifyToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded;
    return __generator(this, function (_a) {
        if (!isValidToken(token)) {
            return [2 /*return*/, null];
        }
        if (!isValidJwtSecret(jwtSecret)) {
            return [2 /*return*/, null];
        }
        try {
            decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            return [2 /*return*/, decoded];
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                console.error('Token expired:', error);
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                console.error('Invalid token:', error);
            }
            else {
                console.error('Error verifying token:', error);
            }
            return [2 /*return*/, null];
        }
        return [2 /*return*/];
    });
}); };
exports.verifyToken = verifyToken;
// Helper function to check if token is valid
var isValidToken = function (token) {
    return typeof token === 'string' && token.trim() !== '';
};
// Helper function to check if jwtSecret is valid
var isValidJwtSecret = function (jwtSecret) {
    return typeof jwtSecret === 'string' && jwtSecret.trim() !== '';
};
//# sourceMappingURL=auth.js.map