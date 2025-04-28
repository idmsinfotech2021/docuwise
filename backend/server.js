// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const documentRoutes = require('./routes/documentRoutes');
const promptRoutes = require('./routes/promptRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const extractedResultRoutes = require('./routes/extractedResultRoutes');
const menuRoutes = require('./routes/menu');
const tenantRoutes = require('./routes/tenant');
const menuAddRoutes = require('./routes/menuRoutes');

const { startAgenda } = require('./queues/agenda');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors()); // 👈 Allow CORS globally
app.use('/api/uploads', uploadRoutes);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/extracted-results', extractedResultRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api', menuAddRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
    console.log('MongoDB Connected');
    startAgenda(); // Start Agenda after DB connection
})
.catch(err => console.log('MongoDB Connection Error:', err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
