// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');

const documentRoutes = require('./routes/documentRoutes');
const promptRoutes = require('./routes/promptRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const extractedResultRoutes = require('./routes/extractedResultRoutes');
const menuRoutes = require('./routes/menu');
const tenantRoutes = require('./routes/tenant');
const menuAddRoutes = require('./routes/menuRoutes');
const validationRuleRoutes = require('./routes/validationRuleRoutes');
const extractionRoutes = require('./routes/extractionRoutes'); // Adjust path as needed
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const templateRoutes = require('./routes/templateRoutes');
const sectionRoutes = require('./routes/sectionConfigRoutes');
const questionRoutes = require('./routes/questionConfigRoutes');
const proposalSessionRoutes = require('./routes/proposalSessionRoutes');
const proposalDocRoutes = require('./routes/proposalDocRoutes');

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
app.use('/api/validation-rules', validationRuleRoutes);
app.use('/api/extractions', extractionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/proposal/template', templateRoutes);
app.use('/api/proposal/section', sectionRoutes);
app.use('/api/proposal/question', questionRoutes);
app.use('/api/proposal', proposalSessionRoutes);
app.use('/api/proposal', proposalDocRoutes);

app.use('/api', menuAddRoutes);

// Serve static frontend in production
app.use(express.static(path.join(__dirname, './../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './../frontend/build/index.html'));
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected');
    startAgenda(); // Start Agenda after DB connection
})
.catch(err => console.log('MongoDB Connection Error:', err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
