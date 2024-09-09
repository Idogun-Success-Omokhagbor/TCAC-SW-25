// src/utils/connectDB
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        console.log('connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoD Connected')
    } catch (error) {
        console.error('Failed to Connect MongoDB:', error)
        
    }
}

module.exports = connectDB;