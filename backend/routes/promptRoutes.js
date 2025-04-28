const express = require('express');
const Prompt = require('../models/Prompt');
const mongoose = require('mongoose');

const router = express.Router();

// Get all prompts
router.get('/', async (req, res) => {
  try {
   const prompts = await Prompt.find().populate('tenantId', 'tenantCode tenantName');
      res.status(200).json(prompts);
   } catch (err) {
      console.error('Error fetching prompts:', err);
      res.status(500).json({ message: 'Server error fetching prompts' });
  }
});

// Create new prompt
router.post('/', async (req, res) => {
   try {
     const { tenantId, docType, promptText } = req.body;
 
     // Convert tenantId to ObjectId safely
     //const objectTenantId = new mongoose.Types.ObjectId(tenantId);
 
     const prompt = new Prompt({
      tenantId: tenantId ? new mongoose.Types.ObjectId(tenantId) : null,
       docType,
       promptText
     });
 
     await prompt.save();
     res.status(201).json(prompt);
 
   } catch (error) {
     console.error('Error creating prompt:', error);
     res.status(500).json({ message: 'Server Error' });
   }
});

// Update existing prompt
router.patch('/:id', async (req, res) => {
  try {
    const { promptText } = req.body;
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { promptText },
      { new: true }
    );
    res.status(200).json(updatedPrompt);
  } catch (err) {
    console.error('Error updating prompt:', err);
    res.status(500).json({ message: 'Server error updating prompt' });
  }
});

// Delete a prompt
router.delete('/:id', async (req, res) => {
  try {
    await Prompt.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Prompt deleted successfully' });
  } catch (err) {
    console.error('Error deleting prompt:', err);
    res.status(500).json({ message: 'Server error deleting prompt' });
  }
});

module.exports = router;
