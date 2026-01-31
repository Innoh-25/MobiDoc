const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin already exists. Updating...');
      existingAdmin.password = process.env.ADMIN_PASSWORD;
      existingAdmin.fullName = process.env.ADMIN_NAME;
      existingAdmin.role = 'super-admin';
      existingAdmin.permissions = ['manage-doctors', 'manage-patients', 'manage-consultations', 'view-reports'];
      
      await existingAdmin.save();
      console.log('Admin updated successfully');
    } else {
      // Create new admin
      const admin = await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        fullName: process.env.ADMIN_NAME,
        role: 'super-admin',
        permissions: ['manage-doctors', 'manage-patients', 'manage-consultations', 'view-reports']
      });
      
      console.log('Admin created successfully:', {
        id: admin._id,
        email: admin.email,
        name: admin.fullName,
        role: admin.role
      });
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

// Run seed function
seedAdmin();