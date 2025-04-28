// /backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Prompt = require('./models/Prompt');

const seedPrompts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Prompt.deleteMany({}); // Clear previous prompts

        await Prompt.insertMany([
            {
                tenantId: 'demo-tenant',
                docType: 'invoice',
                promptText: `You are an invoice extraction AI. Extract the following fields strictly using the nearest label and value: Invoice Number, Invoice Date, Vendor Name, GST Number, Total Amount.`
            },
            {
                tenantId: 'demo-tenant',
                docType: 'po',
                promptText: `You are a purchase order extraction AI. Extract following fields: PO Number, Customer Name, PO Date, Item Names, Quantity, Delivery Date.`
            },
            {
                tenantId: 'demo-tenant',
                docType: 'coa',
                promptText: `You are a Certificate of Analysis extraction AI. Extract the following fields: Product Name, Batch Number, Test Results, Specification Limits, Approval Date.`
            }
        ]);

        console.log('Prompt Seeding Done!');
        process.exit();
    } catch (err) {
        console.error('>>>>>>>>> Seeding Error:', err);
        process.exit(1);
    }
};

seedPrompts();
