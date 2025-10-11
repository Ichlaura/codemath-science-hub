const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['programming', 'math', 'physics'],
    required: true
  },
  ageRange: {
    min: {
      type: Number,
      required: true,
      min: 3,
      max: 18
    },
    max: {
      type: Number,
      required: true,
      min: 3,
      max: 18
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['game', 'app', 'book', 'course'],
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  demoUrl: {
    type: String,
    default: ''
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Índice para búsquedas eficientes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, ageRange: 1 });

module.exports = mongoose.model('Product', productSchema);