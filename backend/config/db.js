import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })

    //using local db in development not to be always connected if using compass
    // const conn = await mongoose.connect("mongodb://localhost:27017/proshop", {
    //   useUnifiedTopology: true,
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    // });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.error(`Error: ${err.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
