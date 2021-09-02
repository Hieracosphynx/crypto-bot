import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://mdlc:${process.env.MONGODB_PASSWORD}@cluster0.6qyku.mongodb.net/beta?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log('Connected to database');
  } catch (err) {
    console.error(err.message);
  }
};

export default connectDB;
