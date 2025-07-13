import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MongoDBURI, {
            dbName: "computer",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Successfully Connected With Main Database!");
    } catch (err) {
        console.log(`Error connecting to Main Database: ${err}`);
        process.exit(1);
    }
};
