import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  content: { 
    type: String, 
    required: [true, 'Review content is required'],
  },
  sentiment: { 
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  approved: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    enum: {
      values: [
        'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale',
        'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna',
        'Mannar', 'Vavuniya', 'Mullaitivu', 'Kilinochchi', 'Batticaloa',
        'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura',
        'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'
      ],
      message: '{VALUE} is not a valid Sri Lankan district'
    }
  },
  developer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Developer reference is required']
  },
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster querying
projectSchema.index({ location: 1 });
projectSchema.index({ approved: 1 });
projectSchema.index({ createdAt: -1 });

// Virtual for formatted date
projectSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Query helper for pagination
projectSchema.query.paginate = function(page, limit) {
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.max(1, parseInt(limit) || 10);
  const skip = (page - 1) * limit;
  
  return this.skip(skip).limit(limit);
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
