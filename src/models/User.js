const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['parent', 'admin'],
    default: 'parent'
  },
  children: [{
    name: String,
    age: Number,
    interests: [String]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Método para obtener información pública del usuario
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.googleId;
  return user;
};

module.exports = mongoose.model('User', userSchema);