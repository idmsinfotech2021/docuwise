const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config(); // Load your MONGO_URI from .env

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      email: 'admin@docuwise.com',
      password: hashedPassword,
      role: 'admin',
      tenantId: null // Superadmin is not tied to any tenant
    });

    await adminUser.save();
    console.log('✅ Super Admin user created: admin@docuwise.com / Password: admin123');
    process.exit(0);

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
