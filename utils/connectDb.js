import mongoose from "mongoose";
export const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECT);
    console.log(conn.connection.name);
    console.log("connected");
  } catch (error) {
    console.log(error.message);
    console.log("not connected");
    process.exit(1);
  }
};
