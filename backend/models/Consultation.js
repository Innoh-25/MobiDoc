const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'completed', 'cancelled'],
    default: 'requested'
  },
  consultationType: {
    type: String,
    enum: ['general', 'emergency'],
    default: 'general'
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  symptoms: {
    type: String,
    required: [true, 'Symptoms description is required'],
    trim: true,
    minlength: [10, 'Symptoms description must be at least 10 characters']
  },
  consultationFee: {
    type: Number,
    default: 0,
    min: 0
  },
  requestTime: {
    type: Date,
    default: Date.now
  },
  acceptanceTime: Date,
  completionTime: Date,
  cancellationReason: {
    type: String,
    trim: true
  },
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

// Indexes for better query performance
consultationSchema.index({ patientId: 1, status: 1 });
consultationSchema.index({ doctorId: 1, status: 1 });
consultationSchema.index({ status: 1 });
consultationSchema.index({ createdAt: -1 });

// Virtual for calculating duration
consultationSchema.virtual('duration').get(function() {
  if (this.status === 'completed' && this.acceptanceTime && this.completionTime) {
    return this.completionTime - this.acceptanceTime;
  }
  return null;
});

// Update updatedAt on save
consultationSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Consultation', consultationSchema);