const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const router = express.Router();
const { verifyAdmin } = require('../middlewares/authMiddleware');

// ------------------- PUBLIC: User Login (NO Middleware) -------------------

router.post('/login', async (req, res) => {
   try {
     const { email, password } = req.body;
     //console.log("Email is ", email)
     //console.log("Password is ", password)
 
     const user = await User.findOne({ email, role: 'user' });
     if (!user) {
       return res.status(400).json({ message: 'Invalid email or not a user' });
     }
 
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
       return res.status(400).json({ message: 'Invalid password' });
     }
 
     const token = jwt.sign(
       {
         id: user._id,
         email: user.email,
         role: user.role,
         tenantId: user.tenantId
       },
       process.env.JWT_SECRET,
       { expiresIn: '1d' }
     );
 
     res.status(200).json({ token, role: user.role, tenantId: user.tenantId });
 
   } catch (error) {
     console.error('User login error:', error);
     res.status(500).json({ message: 'Server error during user login' });
   }
});

// ------------------- PROTECTED ROUTES (After this verifyAdmin is applied) -------------------

// Apply middleware AFTER login
router.use(verifyAdmin);

// ------------------- TENANT APIs -------------------

router.post('/tenants', async (req, res) => {
  try {
    const { tenantCode, tenantName, status } = req.body;

    const existingTenant = await Tenant.findOne({ tenantCode });
    if (existingTenant) {
      return res.status(400).json({ message: 'Tenant code already exists' });
    }

    const tenant = await Tenant.create({ tenantCode, tenantName, status });
    res.status(201).json(tenant);

  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ message: 'Server error creating tenant' });
  }
});

router.get('/tenants', async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.status(200).json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ message: 'Server error fetching tenants' });
  }
});

// ------------------- USER APIs -------------------

router.post('/users', async (req, res) => {
  try {
    const { email, password, tenantId, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      tenantId,
      role: role || 'user'
    });

    res.status(201).json(user);

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error creating user' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('tenantId', 'tenantCode tenantName');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;
