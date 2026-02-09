const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    lowercase: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true,
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  medicalSchool: {
    type: String,
    trim: true
  },
  graduationYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // NEW: Add location fields for area-based search
  location: {
    area: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    county: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  
  // NEW: Add onboarding fields
  isOnboarded: {
    type: Boolean,
    default: false
  },
  
  // Onboarding profile details (filled after registration)
  profile: {
    consultationFee: {
      type: Number,
      min: 0,
      default: 0
    },
    availability: {
      days: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }],
      hours: {
        start: { type: String }, // Format: "09:00"
        end: { type: String }    // Format: "17:00"
      }
    },
    languages: [{
      type: String,
      trim: true
    }],
    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true }
    }
  },
  
  // Documents (now separate from the documents array for verification)
  documents: {
    licenseDocument: { type: String }, // File path
    idDocument: { type: String }, // File path
    qualificationDocument: { type: String } // File path
  },
  
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for location-based queries
doctorSchema.index({ 'location.area': 1, 'location.city': 1 });
doctorSchema.index({ verificationStatus: 1, isOnboarded: 1 });

// Keep existing pre-save hooks
doctorSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

doctorSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);