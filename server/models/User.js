// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Für das Hashing von Passwörtern

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'username is required.'],
        unique: true, // Muss einzigartig sein
        trim: true,
        lowercase: true // Speichert Benutzernamen immer in Kleinbuchstaben
    },
    password: {
        type: String,
        required: [true, 'Passwort is required.'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    email: {
        type: String,
        required: [true, 'E-Mail ist erforderlich.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Pls give a valid email address.']
    },
    profilePicture: {
        type: String,
        default: '/twice-stan.jpg' // Standard-Profilbild
    },
    subscribedCats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CatProfile' // Verweis auf ein später zu erstellendes CatProfile-Modell
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- Passwort-Hashing Pre-Save Hook ---
// Vor dem Speichern eines Benutzers wird das Passwort gehasht
userSchema.pre('save', async function(next) {
    // Hashe das Passwort nur, wenn es neu ist oder geändert wurde
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Methode zum Vergleichen von Passwörtern ---
// Eine Instanzmethode, um ein eingegebenes Passwort mit dem gehashten zu vergleichen
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;