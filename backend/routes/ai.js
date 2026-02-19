const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Service = require('../models/Service');
const Project = require('../models/Project');
const About = require('../models/About');

// Initialize Gemini API lazily or check inside route
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to build context
const getContext = async () => {
    try {
        const [services, projects, about] = await Promise.all([
            Service.find({ active: true }).select('title description'),
            Project.find({ active: true, isPublic: true }).select('title description technologies status'),
            About.findOne().select('description mission vision values leadership')
        ]);

        let context = "You are the AI assistant for SPYWEB, a digital solutions agency.\n\n";

        // Add About Info
        if (about) {
            context += `COMPANY INFO:\n${about.description}\nMission: ${about.mission}\nVision: ${about.vision}\nValues: ${about.values}\nLeadership: ${about.leadership.map(l => `${l.name} (${l.role})`).join(', ')}\n\n`;
        }

        // Add Services
        if (services.length > 0) {
            context += "SERVICES OFFERED:\n";
            services.forEach(s => {
                context += `- ${s.title}: ${s.description}\n`;
            });
            context += "\n";
        }

        // Add Projects
        if (projects.length > 0) {
            context += "PORTFOLIO PROJECTS:\n";
            projects.forEach(p => {
                context += `- ${p.title} (${p.status}): ${p.description}. Tech: ${p.technologies.join(', ')}\n`;
            });
            context += "\n";
        }

        context += "INSTRUCTIONS:\n- Answer user questions based on the above information.\n- Be professional, helpful, and concise.\n- If you don't know the answer, say you don't have that information and suggest contacting support.\n- Do not make up facts not present in the context.";

        return context;
    } catch (error) {
        console.error("Error building context:", error);
        return "";
    }
};

// @route   POST /api/ai/chat
// @desc    Chat with AI about SPYWEB
// @access  Public
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY");
            return res.status(500).json({ message: "AI service not configured (Missing API Key)" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const context = await getContext();

        const prompt = `${context}\n\nUSER MESSAGE: ${message}\nAI RESPONSE:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ message: "Failed to generate response", error: error.message });
    }
});

module.exports = router;
