const mongoose = require("mongoose");
require("dotenv").config();

// Connect to DB
const connectDB = async () => {
    try {
        const dbURI = "mongodb://127.0.0.1:27017/EcoTrack"; // MATCHED CONFIG EXACTLY
        await mongoose.connect(dbURI);
        console.log("MongoDB Connected to:", dbURI);

        // Check Users
        const userModel = require("./models/user-model");
        const admins = await userModel.find({});
        console.log("\n--- ALL USERS FOUND ---");
        console.log(admins.map(a => `Email: ${a.email}, Role: ${a.role}, ID: ${a._id}`));

        // Check Pickups
        const pickupModel = require("./models/pickupRequest-model");
        const pickups = await pickupModel.find();
        console.log("\n--- PICKUPS FOUND ---");
        console.log(`Total: ${pickups.length}`);
        pickups.forEach(p => {
            console.log(`- ID: ${p._id}, Status: ${p.status}, Material: ${p.materialType}, User: ${p.userId}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
