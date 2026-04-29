import type { Request } from 'express';

export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    name: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}
