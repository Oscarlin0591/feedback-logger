import type { Request } from 'express';

// Augment Express's User type globally so req.user carries our JWT payload shape.
// Passport's type defs already declare `req.user: Express.User | undefined`; we just
// flesh out Express.User with the fields we put in the JWT.
declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
            role: string;
            name: string;
        }
    }
}

export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    name: string;
}

// Backwards-compatible alias. Prefer `Request` directly in new code.
export type AuthRequest = Request;
