/**
 * -----------------------------------------------------------------------------
 * Cat Schema (Mongoose)
 * -----------------------------------------------------------------------------
 * Defines the structure for Cat documents in MongoDB.
 *
 * Author: pawsitiv dev
 * Inspired by Valve Developer Documentation style.
 * -----------------------------------------------------------------------------
 *
 * This schema represents a cat profile, including its name, location, images,
 * personality tags, appearance details, and creation date. Used for storing
 * and retrieving cat data in the application.
 * -----------------------------------------------------------------------------
 */
const mongoose = require('mongoose');

/**
 * Cat appearance subdocument schema.
 * @typedef {Object} Appearance
 * @property {string} furColor - The color of the cat's fur.
 * @property {string} furPattern - The pattern of the cat's fur.
 * @property {string} breed - The breed of the cat.
 * @property {('kurz'|'mittel'|'lang')} hairLength - The length of the cat's hair.
 * @property {('schlank'|'normal'|'mollig'|'übergewichtig')} chonkiness - The body type of the cat.
 */

/**
 * Cat schema definition.
 * @typedef {Object} Cat
 * @property {string} name - The name of the cat. Required.
 * @property {string} location - The location of the cat. Required.
 * @property {string[]} images - Array of image URLs for the cat.
 * @property {string[]} personalityTags - Array of personality tags for the cat.
 * @property {Appearance} appearance - Appearance details of the cat.
 * @property {Date} createdAt - Date when the cat profile was created.
 */
const CatSchema = new mongoose.Schema({
  /** The name of the cat. */
  name: {
    type: String,
    required: [true, 'Cat name is required.'],
    trim: true
  },
  /** The location of the cat. */
  location: {
    type: String,
    required: [true, 'Cat location is required.'],
    trim: true
  },
  /** Array of image URLs for the cat. */
  images: {
    type: [String],
    default: []
  },
  /** Array of personality tags for the cat. */
  personalityTags: {
    type: [String],
    default: []
  },
  /** Appearance details of the cat. */
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
      enum: ['kurz', 'mittel', 'lang'],
      trim: true
    },
    chonkiness: {
      type: String,
      enum: ['schlank', 'normal', 'mollig', 'übergewichtig'],
      trim: true
    }
  },
  /** Date when the cat profile was created. */
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Cat = mongoose.model('Cat', CatSchema);

module.exports = Cat;
