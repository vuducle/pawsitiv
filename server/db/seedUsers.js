require('dotenv').config(); // Um Umgebungsvariablen zu laden, falls du sie außerhalb von Docker Compose nutzt
const mongoose = require('mongoose');
const User = require('../models/User'); // Pfad zu deinem User-Modell

const seedUsers = async () => {

    try {
        console.log('🗑️ Lösche bestehende Benutzer...');
        await User.deleteMany({}); // Löscht alle vorhandenen Benutzer

        console.log('✨ Erstelle neue Benutzer...');
        const usersData = [
            {
                name: 'Cloud Strife',
                username: 'cloudstrife',
                password: 'cloudstrife', // Dieses Passwort wird gehasht
                email: 'cloud.strife@example.com',
                profilePicture: '/upload/profile/cloudstrife.jpg',
            },
            {
                name: 'Tifa Lockhart',
                username: 'tifalockhart',
                password: 'tifalockhart', // Auch dieses wird gehasht
                email: 'tifa.lockhart@example.com',
                profilePicture: '/upload/profile/tifalockhart.jpg'
            },
            {
                name: 'Malte Szemlics',
                username: 'malteszemlics',
                password: 'malteszemlics', // Auch dieses wird gehasht
                email: 'malte.szemlics@example.com',
                profilePicture: '/upload/profile/malteszemlics.jpg'
            },
            {
                name: 'Leticia Halm',
                username: 'leticiahalm',
                password: 'leticiahalm', // Auch dieses wird gehasht
                email: 'leticia.halm@example.com',
                profilePicture: '/upload/profile/leticiahalm.jpg'
            },
            {
                name: 'Sophia Kawgan Kagan',
                username: 'sophiakawgankagan',
                password: 'sophiakawgankagan', // Auch dieses wird gehasht
                email: 'sophia.kawgankagan@example.com',
                profilePicture: '/upload/profile/sophiakawgankagan.jpg'
            },
            {
                name: 'Vu Duc Le',
                username: 'vuducle',
                password: 'vuducle', // Auch dieses wird gehasht
                email: 'vuducle@example.com',
                profilePicture: '/upload/profile/vuducle.jpg'
            },
            {
                name: 'Winston Reichelt',
                username: 'winstonreichelt',
                password: 'winstonreichelt', // Auch dieses wird gehasht
                email: 'winston.reichelt@example.com',
                profilePicture: '/upload/profile/winstonreichelt.jpg'
            },
            {
                name: 'Homam Mousa',
                username: 'homammousa',
                password: 'homammousa', // Auch dieses wird gehasht
                email: 'homam.mousa@example.com',
                profilePicture: '/upload/profile/homammousa.jpg'
            },
            {
                name: 'Triesnha Ameilya',
                username: 'triesnhaameilya',
                password: 'triesnhaameilya', // Auch dieses wird gehasht
                email: 'triesnha.ameilya@example.com',
                profilePicture: '/upload/profile/triesnhaameilya.jpg'
            },
            {
                name: 'Armin Dorri',
                username: 'armindorri',
                password: 'armindorri', // Auch dieses wird gehasht
                email: 'armin.dorri@example.com',
                profilePicture: '/upload/profile/armindorri.jpg'
            },
        ];

        // Verwende insertMany, um die Benutzer zu erstellen.
        // Die pre('save') Hooks für das Hashing werden hier nicht ausgelöst,
        // da insertMany auf der Collection-Ebene arbeitet.
        // Daher müssen wir die Passwörter manuell hashen oder create verwenden.
        // Um den pre('save') Hook zu nutzen, iterieren und speichern wir einzeln:
        const createdUsers = [];
        for (const userData of usersData) {
            const user = new User(userData);
            await user.save(); // Löst den pre('save') Hook aus
            createdUsers.push(user);
        }

        // Alternative für insertMany, wenn du keine Hooks in pre-save hast:
        // const createdUsers = await User.insertMany(usersData);

        console.log('✅ Benutzer erfolgreich erstellt!');
        console.log(createdUsers.map(user => ({ username: user.username, email: user.email })));

    } catch (error) {
        console.error('❌ Fehler beim Seeden der Benutzer:', error.message);
    }
};

exports.seedUsers = seedUsers;