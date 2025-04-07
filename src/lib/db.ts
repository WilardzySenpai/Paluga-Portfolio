// src/lib/db.ts

import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// Database file paths
const DB_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DB_DIR, 'messages.json');
const USERS_FILE = path.join(DB_DIR, 'users.json');

// Types
export type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    read: boolean;
};

export type User = {
    id: string;
    username: string;
    passwordHash: string;
    role: 'admin';
    createdAt: string;
};

// Initialize the database files if they don't exist
export async function initDatabase() {
    try {
        // Create the data directory if it doesn't exist
        await fs.mkdir(DB_DIR, { recursive: true });

        // Check if messages file exists, create it if not
        try {
            await fs.access(MESSAGES_FILE);
        } catch (error) {
            await fs.writeFile(MESSAGES_FILE, JSON.stringify([], null, 2));
        }

        // Check if users file exists, create it if not
        try {
            await fs.access(USERS_FILE);
        } catch (error) {
            // Create a default admin user
            const defaultAdmin: User = {
                id: uuidv4(),
                username: 'admin',
                passwordHash: await bcrypt.hash('admin123', 10), // This should be changed after first login
                role: 'admin',
                createdAt: new Date().toISOString(),
            };
            await fs.writeFile(USERS_FILE, JSON.stringify([defaultAdmin], null, 2));
        }
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Message operations
export async function getMessages(): Promise<ContactMessage[]> {
    try {
        const data = await fs.readFile(MESSAGES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading messages:', error);
        return [];
    }
}

export async function addMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
    try {
        const messages = await getMessages();
        const newMessage: ContactMessage = {
            id: uuidv4(),
            ...message,
            createdAt: new Date().toISOString(),
            read: false,
        };

        messages.push(newMessage);
        await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));

        return newMessage;
    } catch (error) {
        console.error('Error adding message:', error);
        throw new Error('Failed to add message');
    }
}

export async function deleteMessage(id: string): Promise<boolean> {
    try {
        const messages = await getMessages();
        const updatedMessages = messages.filter(message => message.id !== id);

        if (messages.length === updatedMessages.length) {
            return false; // No message found with that id
        }

        await fs.writeFile(MESSAGES_FILE, JSON.stringify(updatedMessages, null, 2));
        return true;
    } catch (error) {
        console.error('Error deleting message:', error);
        return false;
    }
}

export async function markMessageAsRead(id: string): Promise<boolean> {
    try {
        const messages = await getMessages();
        const messageIndex = messages.findIndex(message => message.id === id);

        if (messageIndex === -1) {
            return false; // No message found with that id
        }

        messages[messageIndex].read = true;
        await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
        return true;
    } catch (error) {
        console.error('Error updating message:', error);
        return false;
    }
}

// User operations
export async function getUsers(): Promise<User[]> {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, init might fix it, but return empty for now
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.warn('Users file not found, attempting initialization.');
            await initDatabase(); // Try to initialize if not found
            try {
                // Try reading again after initialization
                const data = await fs.readFile(USERS_FILE, 'utf8');
                return JSON.parse(data);
            } catch (retryError) {
                console.error('Error reading users file after retry:', retryError);
                return [];
            }
        }
        console.error('Error reading users:', error);
        return [];
    }
}

export async function getUserById(id: string): Promise<User | null> {
    try {
        const users = await getUsers();
        return users.find(user => user.id === id) || null;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        return null;
    }
}

export async function getUserByUsername(username: string): Promise<User | null> {
    try {
        const users = await getUsers();
        return users.find(user => user.username === username) || null;
    } catch (error) {
        console.error('Error finding user by username:', error);
        return null;
    }
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    try {
        const users = await getUsers();
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            console.warn(`User not found for password update: ${userId}`);
            return false; // No user found with that id
        }

        // Hash the new password before saving
        users[userIndex].passwordHash = await bcrypt.hash(newPassword, 10);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        console.log(`Password updated successfully for user: ${userId}`);
        return true;
    } catch (error) {
        console.error('Error updating user password:', error);
        return false;
    }
}

// Validate login credentials
export async function validateCredentials(username: string, password: string): Promise<User | null> {
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            console.warn(`Validation failed: Username not found - ${username}`);
            return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) {
            console.warn(`Validation failed: Incorrect password for username - ${username}`);
            return null;
        }
        return user;
    } catch (error) {
        console.error('Error validating credentials:', error);
        return null;
    }
}
