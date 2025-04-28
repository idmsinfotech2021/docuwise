// /backend/worker.js
require('dotenv').config();
const mongoose = require('mongoose');
const { startAgenda } = require('./queues/agenda');

const startWorker = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Agenda Worker ✅');

        await startAgenda();
        console.log('Agenda Worker Started and Listening for Jobs ✅');
    } catch (err) {
        console.error('Worker Startup Error:', err);
    }
};

startWorker();
