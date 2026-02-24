const mongoose = require('mongoose');

const connectMongoDB = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 MongoDB connection attempt ${attempt}/${retries}...`);
      
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      
      console.log('✅ MongoDB connected:', conn.connection.host);
      console.log('📍 Database:', conn.connection.name);
      return conn;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        const waitTime = attempt * 3000; // 3s, 6s, 9s
        console.log(`⏳ Waiting ${waitTime / 1000}s before retry...\n`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error('\n⚠️  All connection attempts failed.');
        console.error('Possible causes:');
        console.error('1. Network/DNS issue - check if you can reach MongoDB Atlas');
        console.error('2. IP whitelist - verify 0.0.0.0/0 is ACTIVE in MongoDB Atlas');
        console.error('3. Credentials - check MONGO_URI in .env file');
        console.error('\nCurrent URI:', process.env.MONGO_URI?.substring(0, 50) + '...');
        process.exit(1);
      }
    }
  }
};

module.exports = connectMongoDB;

