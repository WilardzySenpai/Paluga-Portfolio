// scripts/migrate.ts

import { connectMongo, User, Message, seedAdminUser, seedDefaultSettings  } from '@/lib/db'; // Adjust path
import { promises as fs } from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DB_DIR, 'messages.json');
const USERS_FILE = path.join(DB_DIR, 'users.json');

async function runMigration() {
    console.log('Connecting to MongoDB...');
    await connectMongo();
    console.log('Connected.');

    // Seed settings after connecting
    console.log('Seeding default settings...');
    await seedDefaultSettings();

    // --- Migrate Users ---
    try {
        console.log('Checking existing users...');
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log(`${userCount} users already exist. Skipping user migration.`);
            // Optionally seed admin if it doesn't exist
            await seedAdminUser();
        } else {
            console.log('Migrating users from users.json...');
            const usersData = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
            if (usersData && usersData.length > 0) {
                // Assume passwords in JSON are already hashed
                const usersToInsert = usersData.map((u: any) => ({
                    username: u.username,
                    passwordHash: u.passwordHash, // Directly use the stored hash
                    role: u.role,
                    createdAt: u.createdAt ? new Date(u.createdAt) : new Date(), // Preserve original date if available
                }));
                await User.insertMany(usersToInsert);
                console.log(`Successfully migrated ${usersToInsert.length} users.`);
            } else {
                console.log('No users found in users.json. Seeding default admin.');
                await seedAdminUser();
            }
        }
    } catch (error: any) {
        if (error.code === 'ENOENT') {
             console.warn('users.json not found. Seeding default admin.');
             await seedAdminUser();
        } else {
             console.error('Error migrating users:', error);
        }

    }

    // --- Migrate Messages ---
     try {
        console.log('Checking existing messages...');
        const messageCount = await Message.countDocuments();
         if (messageCount > 0) {
             console.log(`${messageCount} messages already exist. Skipping message migration.`);
         } else {
            console.log('Migrating messages from messages.json...');
            const messagesData = JSON.parse(await fs.readFile(MESSAGES_FILE, 'utf8'));
            if (messagesData && messagesData.length > 0) {
                 const messagesToInsert = messagesData.map((m: any) => ({
                     name: m.name,
                     email: m.email,
                     subject: m.subject,
                     message: m.message,
                     read: m.read || false,
                     createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
                 }));
                await Message.insertMany(messagesToInsert);
                console.log(`Successfully migrated ${messagesToInsert.length} messages.`);
            } else {
                console.log('No messages found in messages.json.');
            }
         }
    } catch (error: any) {
         if (error.code !== 'ENOENT') { // Ignore if file not found
            console.error('Error migrating messages:', error);
         } else {
             console.log('messages.json not found. No messages to migrate.');
         }
    }

    console.log('Migration script finished.');
    // Mongoose connection might keep the script running, explicitly exit
    process.exit(0);
}

runMigration().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
