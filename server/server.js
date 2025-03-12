// server/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Path to the local file on your PC
const profilesPath = path.join(__dirname, 'profiles.json');

// Ensure profiles.json exists with an empty array if not present
if (!fs.existsSync(profilesPath)) {
    fs.writeFileSync(profilesPath, '[]');
}

// Helper: Load profiles from file
function loadProfiles() {
    try {
        const data = fs.readFileSync(profilesPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading profiles:', error);
        return [];
    }
}

// Helper: Save profiles to file
function saveProfiles(profiles) {
    try {
        fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
    } catch (error) {
        console.error('Error writing profiles:', error);
    }
}

// POST /register
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    const profiles = loadProfiles();

    // Check if user already exists
    if (profiles.some((p) => p.email === email)) {
        return res.status(400).json({ error: 'User already exists on server' });
    }

    // Add new user
    profiles.push({ email, password });
    saveProfiles(profiles);

    return res.json({ message: 'User registered on server successfully' });
});

// POST /login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    const profiles = loadProfiles();
    const user = profiles.find((p) => p.email === email);

    if (!user) {
        return res.status(404).json({ error: 'User not found on server' });
    }

    if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    return res.json({ message: 'Login on server successful' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
