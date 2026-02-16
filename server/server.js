// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors({
    origin: "*",              // allow all frontend domains
    methods: ["GET", "POST"],
}));
app.use(express.json());

// ---------- MONGODB CONNECTION ----------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => console.error("MongoDB error ❌", err.message));

// ---------- SCHEMA & MODEL ----------
const contactSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        subject: String,
        message: String,
    },
    { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactSchema);

// ---------- NODEMAILER TRANSPORT ----------
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// ---------- VERIFY EMAIL CONFIG ----------
transporter.verify((error) => {
    if (error) {
        console.error("EMAIL CONFIG ERROR ❌", error);
    } else {
        console.log("EMAIL READY ✅");
    }
});

// ---------- ROUTES ----------
app.get("/", (req, res) => {
    res.send("Portfolio API is running 🚀");
});

// 🔹 CONTACT FORM API
app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    console.log("Incoming contact:", req.body);

    try {
        // 1️⃣ Send email to owner
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
            to: process.env.OWNER_EMAIL,
            subject: subject || "New message from portfolio",
            text:
                `You received a new message:\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n\n` +
                `Message:\n${message}`,
            replyTo: email,
        });

        console.log("Email sent to owner ✅");

        // 2️⃣ Save to MongoDB
        await ContactMessage.create({
            name,
            email,
            subject,
            message,
        });

        console.log("Saved to MongoDB ✅");

        res.json({ success: true });
    } catch (err) {
    console.error("Contact error ❌", err.message);
    res.status(500).json({
        success: false,
        error: err.message
    });
}


// 🔹 TEST EMAIL ROUTE
app.get("/test", async (req, res) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.OWNER_EMAIL,
            subject: "Test Email",
            text: "Backend email is working 🎉",
        });

        res.send("Test email sent successfully ✅");
    } catch (err) {
        console.error(err);
        res.status(500).send("Email failed ❌");
    }
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
