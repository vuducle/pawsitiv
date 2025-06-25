/ --- Cat Schema ---
const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Der Name der Katze ist erforderlich.'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Der Standort der Katze ist erforderlich.'],
    trim: true
  },
  images: {
    type: [String],
    default: [] // Standardmäßig ein leeres Array
  },
  personalityTags: {
    type: [String],
    default: [] // Standardmäßig ein leeres Array
  },
  appearance: {
    furColor: {
      type: String,
      trim: true
    },
    furPattern: {
      type: String,
      trim: true
    },
    breed: {
      type: String,
      trim: true
    },
    hairLength: {
      type: String,
      enum: ['kurz', 'mittel', 'lang'], // Beispiele für mögliche Werte
      trim: true
    },
    chonkiness: {
      type: String,
      enum: ['schlank', 'normal', 'mollig', 'übergewichtig'], // Beispiele für mögliche Werte
      trim: true
    }
  },
  // Hinzugefügt: Datum der Erstellung des Katzenprofils
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Cat = mongoose.model('Cat', CatSchema);

module.exports = Cat;
