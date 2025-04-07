// src/lib/types.ts
import { Types } from 'mongoose'; // Importing Types is generally safe

export interface BaseContactMessage {
    _id?: Types.ObjectId | string;
    // id?: string; // If using lean virtuals elsewhere
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: Date | string;
    updatedAt?: Date | string;
}

export interface BaseUser {
    _id: Types.ObjectId | string; // Make _id mandatory here for clarity
    // id?: string;
    username: string;
    // passwordHash?: string; // Often not needed outside DB/Auth logic
    role: 'admin';
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

// JwtPayload uses userId (which is derived from _id.toString())
export type JwtPayload = {
    userId: string;
    username: string;
    role: string;
};

export type AddMessageInput = {
    name: string;
    email: string;
    subject: string;
    message: string;
};