const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const profilesPath = path.join(__dirname, "profiles.json");
if (!fs.existsSync(profilesPath)) {
    fs.writeFileSync(profilesPath, "[]");
}

// Helpers to load/save profiles
function loadProfiles() {
    try {
        const data = fs.readFileSync(profilesPath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading profiles.json:", error);
        return [];
    }
}
function saveProfiles(profiles) {
    try {
        fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
    } catch (error) {
        console.error("Error writing profiles.json:", error);
    }
}

// POST /register
// Basic registration: adds a user with email & password. hasProfile=false by default
app.post("/register", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }
    const profiles = loadProfiles();
    if (profiles.find((p) => p.email === email)) {
        return res.status(400).json({ error: "User already exists" });
    }
    const newUser = {
        email,
        password,
        hasProfile: false,
    };
    profiles.push(newUser);
    saveProfiles(profiles);
    res.json({ message: "User registered successfully" });
});

// POST /login
// Basic login: checks email & password
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }
    const profiles = loadProfiles();
    const user = profiles.find((p) => p.email === email);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    if (user.password !== password) {
        return res.status(401).json({ error: "Invalid password" });
    }
    res.json({ message: "Login successful" });
});

// GET /profile?email=...
// Returns the user data (including hasProfile, name, coverUrl, etc.) or 404 if not found
app.get("/profile", (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Missing email query parameter" });
    }
    const profiles = loadProfiles();
    const user = profiles.find((p) => p.email === email);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});

// POST /createProfile
// Creates or updates a user’s profile. Sets hasProfile=true
app.post("/createProfile", (req, res) => {
    const {
        email,
        password,
        name,
        pronouns,
        bio,
        coverUrl,
        avatarUrl,
        favourites,
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    const profiles = loadProfiles();
    let user = profiles.find((p) => p.email === email);

    if (!user) {
        // Create a new user with profile
        user = {
            email,
            password,
            hasProfile: true,
            name: name || "",
            pronouns: pronouns || "",
            bio: bio || "",
            coverUrl: coverUrl || "",
            avatarUrl: avatarUrl || "",
            favourites: favourites || [],
        };
        profiles.push(user);
    } else {
        // Update existing user
        // (Check password if you want to ensure correct user)
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid password for updating profile" });
        }
        user.hasProfile = true;
        user.name = name || user.name;
        user.pronouns = pronouns || user.pronouns;
        user.bio = bio || user.bio;
        user.coverUrl = coverUrl || user.coverUrl;
        user.avatarUrl = avatarUrl || user.avatarUrl;
        user.favourites = favourites || user.favourites;
    }

    saveProfiles(profiles);
    res.json({ message: "Profile saved successfully", user });
});

// POST /deleteAccount
// Removes user from profiles.json
app.post("/deleteAccount", (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Missing email" });
    }
    const profiles = loadProfiles();
    const index = profiles.findIndex((p) => p.email === email);
    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }
    profiles.splice(index, 1);
    saveProfiles(profiles);
    res.json({ message: "Account deleted successfully" });
});

// POST /changePassword
// Expects: email, oldPassword, newPassword
app.post("/changePassword", (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "Missing email, oldPassword, or newPassword" });
    }

    const profiles = loadProfiles();
    const user = profiles.find((p) => p.email === email);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    if (user.password !== oldPassword) {
        return res.status(401).json({ error: "Old password is incorrect" });
    }

    user.password = newPassword;
    saveProfiles(profiles);
    res.json({ message: "Password changed successfully" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
