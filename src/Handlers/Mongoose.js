import mongoose from "mongoose";
import AveLog from "#structures/Logs.js";
const logger = new AveLog();

async function mongooseConnection() {

  const URI = process.env.MONGO_URI;

  logger.log(`Conectando a MongoDb...`);

  try {
    await mongoose.connect(URI, { dbName: process.env.DB_NAME });

    logger.success("[🍀] Mongoose: Database connected");

    return mongoose.connection;
  } catch (err) {
    logger.error("Error to connect mongo", err);
    process.exit(1);
  }
}

export default mongooseConnection;
