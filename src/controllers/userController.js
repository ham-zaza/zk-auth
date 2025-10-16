import User from "../models/User.js";

export const registerUser = async (req, res) => {
    console.log("✅ Register route called!");
    console.log("Request body:", req.body);

    try {
        const { username, publicKey } = req.body;

        if (!username || !publicKey) {
            return res.status(400).json({ message: "Username and publicKey are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user in database
        const newUser = new User({ username, publicKey });
        await newUser.save();

        console.log("✅ User saved in MongoDB:", newUser);

        res.status(201).json({
            message: "User registered successfully!",
            user: newUser
        });

    } catch (error) {
        console.error("❌ Error in registerUser:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
// GET /api/users  -> List all registered users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-__v"); // fetch all users from MongoDB
        res.status(200).json({
            message: "Users fetched successfully!",
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};
