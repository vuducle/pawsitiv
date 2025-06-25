const mongoose = require('mongoose');

// --- Notification Schema ---
const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [
      true,
      'Eine Benachrichtigung muss einem Benutzer zugeordnet sein.',
    ],
  },
  cat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cat',
    // 'Cat' ist jetzt der korrekte Referenzname, da wir das Modell so benannt haben.
    // Falls eine Benachrichtigung nicht zwingend einer Katze zugeordnet sein muss,
    // kannst du 'required: false' oder es weglassen.
    required: [
      true,
      'Eine Benachrichtigung muss einer Katze zugeordnet sein.',
    ],
  },
  type: {
    type: String,
    required: [
      true,
      'Der Typ der Benachrichtigung ist erforderlich.',
    ],
    enum: ['neue_katze', 'update_katze', 'match', 'nachricht'], // Beispieltypen
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model(
  'Notification',
  NotificationSchema
);

module.exports = Notification;