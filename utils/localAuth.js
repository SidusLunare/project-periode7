// utils/localAuth.js
import * as FileSystem from 'expo-file-system';

// We'll store our profiles in a file called profiles.json in the app's document directory
const profilesFileUri = FileSystem.documentDirectory + 'profiles.json';

// 1. Load profiles from the JSON file
export async function loadProfiles() {
    const fileInfo = await FileSystem.getInfoAsync(profilesFileUri);
    if (!fileInfo.exists) {
        // If the file doesn't exist, return an empty array
        return [];
    }
    // Read the file's contents
    const fileContents = await FileSystem.readAsStringAsync(profilesFileUri);
    // Parse the JSON
    return JSON.parse(fileContents);
}

// 2. Save profiles to the JSON file
export async function saveProfiles(profiles) {
    // Convert profiles array to JSON
    const jsonString = JSON.stringify(profiles, null, 2);
    // Write it to the file
    await FileSystem.writeAsStringAsync(profilesFileUri, jsonString);
}

// 3. Register a new user (No password hashing yet!)
export async function registerUser(email, password) {
    // Load existing profiles
    const profiles = await loadProfiles();

    // Check if user already exists
    const existingUser = profiles.find((p) => p.email === email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Create a new profile object
    const newProfile = { email, password };

    // Add to the list of profiles
    profiles.push(newProfile);

    // Save them back to the file
    await saveProfiles(profiles);

    return newProfile;
}

// 4. Login a user (No password hashing yet!)
export async function loginUser(email, password) {
    const profiles = await loadProfiles();

    // Find the user by email
    const user = profiles.find((p) => p.email === email);
    if (!user) {
        throw new Error('User not found');
    }

    // Compare the plain-text passwords
    if (user.password !== password) {
        throw new Error('Invalid password');
    }

    return user;
}
