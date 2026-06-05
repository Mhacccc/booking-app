import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

// Connection event listeners for runtime monitoring
mongoose.connection.on('disconnected', () => {
    console.log(`\n\x1b[33m⚠️  MongoDB Disconnected! Lost connection to database.\x1b[0m`);
});

mongoose.connection.on('error', (err) => {
    console.error(`\n\x1b[31m❌ MongoDB Runtime Error:\x1b[0m`, err.message);
});

export default async function connectDatabase() {
    const dbUri = process.env.MONGO_URI;
    const dbName = dbUri ? dbUri.split('?')[0].split('/').pop() : 'unknown';

    try {
        await mongoose.connect(dbUri);
        console.log(`\x1b[32m🍃 MongoDB Connected successfully!\x1b[0m`);
        console.log(`   📁 Database Name: \x1b[36m${dbName}\x1b[0m`);
        console.log(`==================================================\n`);
    } catch (error) {
        console.log(`\x1b[31m🚨 Initial database connection failed!\x1b[0m`);
        console.log(`   Error: ${error.message}`);
        console.log(`   Server is still running, but endpoints requiring MongoDB will fail.`);
        console.log(`==================================================\n`);
    }
}