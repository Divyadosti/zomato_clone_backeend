const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors'); // ✅ Import CORS
const User = require('./models/User'); // Ensure this file exists

const app = express();
const PORT = 3000;

// ✅ Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));

// ✅ Middleware to parse JSON request body
app.use(express.json());

// ✅ Home Route
app.get('/', (req, res) => {
    res.send("Welcome to the Authentication API!");
});

// ✅ Register Route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        res.json({ message: "Login Successful", username: user.username });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://divyadosti93:divya2004@cluster0.wncub.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ DB connection successful..."))
    .catch((err) => console.error("❌ DB connection error:", err));

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
