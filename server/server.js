// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- MONGODB CONNECTION ----------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err.message));

// ---------- SCHEMA & MODEL ----------
const contactSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        subject: String,
        message: String,
    },
    { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactSchema);

// ---------- NODEMAILER TRANSPORT ----------
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// ---------- ROUTES ----------
app.get("/", (req, res) => {
    res.send("Portfolio API is running");
});

app.post("/api/contact", async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    console.log("Incoming contact:", { name, email, phone, subject, message });

    try {
        // 1) Send email to owner
        const mailOptions = {
            from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
            to: process.env.OWNER_EMAIL,
            subject: subject || "New message from portfolio",
            text:
                `You received a new message from your portfolio site:\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone}\n\n` +
                `Message:\n${message}\n`,
            replyTo: email || undefined,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent to owner");

        // 2) Try to save to MongoDB (do not fail request if DB has issue)
        try {
            const doc = await ContactMessage.create({
                name,
                email,
                phone,
                subject,
                message,
            });
            console.log("Saved in MongoDB with id:", doc._id);
        } catch (dbErr) {
            console.error("Mongo save error:", dbErr.message);
            // We just log it; no error returned to client
        }

        // 3) Success response
        res.json({ success: true });
    } catch (err) {
        console.error("Contact error:", err);
        res.status(500).json({ error: err.message || "Failed to send message" });
    }
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
