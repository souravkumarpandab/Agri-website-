const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agri_assistant';
    
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`MongoDB Connected Local: ${conn.connection.host}`);
    } catch (localError) {
      console.warn("Local MongoDB is down. Spinning up an ephemeral In-Memory MongoDB server...");
      
      // Ensure the failed local connection attempt is fully closed before creating the memory server
      await mongoose.disconnect();

      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(memUri);
      console.log(`In-Memory MongoDB Connected! ${memUri}`);
      
      const User = require('./models/User');
      
      // Auto-seed disabled: starting with a clean slate
      console.log('In-Memory DB initialized completely empty.');
    }
  } catch (error) {
    console.error(`Fatal MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
