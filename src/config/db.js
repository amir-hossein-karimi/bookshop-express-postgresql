import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "../prisma/contract.json" with { type: "json" };

export const db = postgres({
  contractJson,
  url: process.env.DATABASE_URL,
});

export const connectDB = async () => {
  try {
    // connect() is lazy, so run a real query to verify the connection
    // (this also checks the database schema matches the contract).
    await db.orm.public.User.first();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await db.close();
};
