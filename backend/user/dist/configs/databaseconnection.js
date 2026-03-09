import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`❌ MongoDB Error: ${error.message}`);
        }
        else {
            console.error("❌ Unknown MongoDB Error");
        }
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=databaseconnection.js.map