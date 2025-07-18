import mongoose from "mongoose";

export const connectMongoDB = async () => {
	console.log(process.env.MONGO_URI);
	
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connection to mongoDB: ${error.message}`);
		process.exit(1);
	}
};

