// src/lib/db.ts

import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

// --- Environment Variables ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

// --- Mongoose Connection Caching (Recommended for Next.js) ---
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Add type to global NodeJS namespace
declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache;
}

// Use global variable to maintain connection across hot reloads in development
let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectMongo(): Promise<typeof mongoose> {
    if (cached.conn) {
        // console.log('=> using cached database connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering if connection fails immediately
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
            // console.log('=> new database connection established');
            return mongooseInstance;
        }).catch(error => {
            console.error("MongoDB connection error:", error);
            cached.promise = null; // Reset promise on error
            throw error; // Rethrow error
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; // Reset promise on error
        throw e;
    }

    return cached.conn;
}

// --- Define Mongoose Schemas and Models ---

// Contact Message Schema
export interface IContactMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: Date; // Mongoose uses Date type
    // _id is automatically added by Mongoose
}

const ContactMessageSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 100 },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Prevent model recompilation in Next.js hot reloads
const Message: Model<IContactMessage> = mongoose.models.Message || mongoose.model<IContactMessage>('Message', ContactMessageSchema);


// User Schema
export interface IUser extends Document {
    username: string;
    passwordHash: string;
    role: 'admin'; // Keep role simple for now
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    // _id is automatically added
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin', required: true },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Password Hashing Middleware (Before saving)
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('passwordHash')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        // Re-assign passwordHash to the hashed version
        // Note: We store the HASH directly in 'passwordHash'. The model logic assumes this field holds the hash.
        // If you were setting a virtual 'password' field, you'd hash that and assign to 'passwordHash'.
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

// --- Define Input Type for Adding Messages ---
// This defines the plain object structure expected as input
export type AddMessageInput = {
    name: string;
    email: string;
    subject: string;
    message: string;
    // Note: 'read' is intentionally omitted, as it defaults to false in the schema
};

export interface LeanContactMessage {
    id: string; // Use 'id' here
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Include other fields returned by your schema/query
}

// --- Setting Schema and Model ---
export interface ISetting extends Document {
    key: string;    // Unique identifier for the setting (e.g., 'contactFormStatus')
    value: any;     // Can store boolean, string, number, etc.
    // _id is automatic
    // timestamps can be added if needed: { timestamps: true }
}

const SettingSchema: Schema = new Schema({
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true }, // Use Mixed for flexibility
}, { timestamps: true }); // Add timestamps for tracking changes

// Prevent model recompilation
const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// --- Export Models and Connection Function ---
export { connectMongo, Message, User, Setting };

// --- Database Operation Functions (Updated for Mongoose) ---

// Message operations
export async function getMessages(): Promise<any[]> { // Use a more specific type if possible
    await connectMongo();
    // .lean() without virtuals includes _id by default
    const messages = await Message.find({})
        .sort({ createdAt: -1 })
        .lean() // No { virtuals: true }
        .exec();
    return messages;
}

export async function addMessage(messageData: AddMessageInput): Promise<IContactMessage> {
    await connectMongo();
    // Mongoose constructor correctly handles creating a document from the plain object
    const newMessage = new Message(messageData); // 'read' defaults to false
    return newMessage.save();
}

export async function deleteMessage(id: string): Promise<boolean> {
    await connectMongo();
    if (!mongoose.Types.ObjectId.isValid(id)) return false; // Validate ID format
    const result = await Message.findByIdAndDelete(id).exec();
    return !!result; // Return true if a document was deleted, false otherwise
}

export async function markMessageAsRead(id: string): Promise<boolean> {
    await connectMongo();
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Message.findByIdAndUpdate(id, { read: true }, { new: true }).exec(); // {new: true} returns the updated doc
    return !!result; // Return true if a document was found and updated
}

// User operations
// Optional: Can be removed if not needed directly, as specific finders are better
// export async function getUsers(): Promise<IUser[]> {
//     await connectMongo();
//     return User.find({}).lean().exec();
// }

export async function getUserById(id: string): Promise<IUser | null> {
    await connectMongo();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return User.findById(id).exec(); // Don't use lean() if you need Mongoose methods like comparePassword later
}

export async function getUserByUsername(username: string): Promise<IUser | null> {
    await connectMongo();
    return User.findOne({ username: username.toLowerCase() }).exec(); // Search lowercase
}

// This function now assumes the new password IS NOT HASHED yet
// The pre-save hook in the schema will handle hashing
export async function updateUserPassword(userId: string, newPasswordPlain: string): Promise<boolean> {
    await connectMongo();
    if (!mongoose.Types.ObjectId.isValid(userId)) return false;

    const user = await User.findById(userId).exec();
    if (!user) {
        console.warn(`User not found for password update: ${userId}`);
        return false;
    }

    // Set the password field directly. The pre-save hook handles hashing.
    user.passwordHash = newPasswordPlain;

    try {
        await user.save(); // This triggers the pre-save hook
        console.log(`Password updated successfully for user: ${userId}`);
        return true;
    } catch (error) {
        console.error('Error saving user after password update:', error);
        return false;
    }
}

// Validate login credentials using the instance method
export async function validateCredentials(username: string, passwordPlain: string): Promise<IUser | null> {
    await connectMongo();
    const user = await getUserByUsername(username); // Finds user (case-insensitive)
    if (!user) {
        console.warn(`Validation failed: Username not found - ${username}`);
        return null;
    }

    const passwordMatches = await user.comparePassword(passwordPlain); // Use the model method
    if (!passwordMatches) {
        console.warn(`Validation failed: Incorrect password for username - ${username}`);
        return null;
    }
    return user; // Return the full Mongoose user document
}

// --- Setting Operation Functions ---

/**
 * Gets a setting value by its key. Returns null if not found.
 */
export async function getSetting(key: string): Promise<ISetting | null> {
    await connectMongo();
    try {
        const setting = await Setting.findOne({ key }).lean().exec();
        return setting;
    } catch (error) {
        console.error(`Error fetching setting with key "${key}":`, error);
        return null; // Return null on error
    }
}

/**
 * Updates or creates a setting (upsert).
 * @param key The unique key for the setting.
 * @param value The new value for the setting.
 * @returns The updated or created setting document, or null on error.
 */
export async function updateSetting(key: string, value: any): Promise<ISetting | null> {
    await connectMongo();
    try {
        // Use upsert: true to create if it doesn't exist, new: true to return the updated doc
        const updatedSetting = await Setting.findOneAndUpdate(
            { key },
            { $set: { value } },
            { upsert: true, new: true, lean: true }
        ).exec();
        console.log(`Setting "${key}" updated/created with value:`, value);
        return updatedSetting;
    } catch (error) {
        console.error(`Error updating setting with key "${key}":`, error);
        return null; // Return null on error
    }
}


// --- Seed Function (Optional: Add default setting) ---
// You might want to ensure the setting exists with a default value
export async function seedDefaultSettings() {
    await connectMongo();
    const existingSetting = await Setting.findOne({ key: 'contactFormStatus' });
    if (!existingSetting) {
        console.log('Seeding default contactFormStatus setting (defaulting to false)...');
        await updateSetting('contactFormStatus', false); // Default to false (inactive)
    }
}

// Call seed function (optional: maybe only in dev or via a separate script)
// seedDefaultSettings().catch(console.error); // You might run this via your migration script instead

// --- Seed Function (Example - Run this manually or via a script if needed) ---
export async function seedAdminUser() {
    await connectMongo();
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
        console.log('Seeding default admin user...');
        const adminUser = new User({
            username: 'admin',
            // Provide the plain password here; the pre-save hook will hash it
            passwordHash: 'admin123', // CHANGE THIS DEFAULT PASSWORD IMMEDIATELY!
            role: 'admin',
        });
        try {
            await adminUser.save();
            console.log('Default admin user created. Please change the password.');
        } catch (error) {
            console.error('Error seeding admin user:', error);
        }
    } else {
        // console.log('Admin user already exists.');
    }
}

// Call seed function (optional: maybe only in dev or via a separate script)
// seedAdminUser().catch(console.error);