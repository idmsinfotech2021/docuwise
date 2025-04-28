// /queues/agenda.js
const Agenda = require('agenda');
const Upload = require('../models/Upload');
const ExtractedResult = require('../models/ExtractedResult');
const Prompt = require('../models/Prompt');
const { callGeminiAPI } = require('../utils/geminiService');
const { extractTextFromFile } = require('../utils/ocrService');
const path = require('path');

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI,
    collection: 'agendaJobs'
  }
});

// Agenda Job Definition
agenda.define('process uploaded document', async (job) => {
  const { uploadId } = job.attrs.data;

  try {
    const upload = await Upload.findById(uploadId);
    if (!upload) {
      console.error('[Agenda] Upload not found for Job');
      return;
    }

    console.log(`[Agenda] Job running for Upload ID: ${uploadId}`);

    upload.status = 'processing';
    await upload.save();

    // Step 1: OCR the file
    const filePath = path.join(__dirname, '../uploads', upload.filename);
    const extractedText = await extractTextFromFile(filePath);

    if (!extractedText || extractedText.trim() === '') {
      console.error('[Agenda] OCR extraction failed or returned empty text');
      upload.status = 'failed';
      await upload.save();
      return;
    }

    // Step 2: Fetch Prompt based on tenantId + docType
    //console.log("Printing tenat id ", upload.tenantId);
    //console.log("Printing doc type ", upload.docType);
    // const prompt = await Prompt.findOne({ tenantId: upload.tenantId, docType: upload.docType });
    // const promptText = prompt ? prompt.promptText : null;
    // Step 2: Fetch Prompt based on tenantId + docType
    let promptText = null;

    // Try finding tenant-specific prompt
    let prompt = await Prompt.findOne({ tenantId: upload.tenantId, docType: upload.docType });

    if (!prompt) {
      // Try finding global default prompt
      prompt = await Prompt.findOne({ tenantId: null, docType: upload.docType });
    }

    if (!prompt) {
      console.warn(`[Agenda] No custom or default prompt found for docType: ${upload.docType}`);
    } else {
      promptText = prompt.promptText;
    }


    // if (!promptText) {
    //   console.warn('[Agenda] Custom prompt not found, will use default for docType:', upload.docType);
    // }

    // Step 3: Call Gemini API (passing docType also!)
    const extractedData = await callGeminiAPI(promptText, extractedText, upload.docType);

    if (!extractedData) {
      console.error('[Agenda] Gemini extraction failed');
      upload.status = 'failed';
      await upload.save();
      return;
    }

    // Step 4: Save Extracted Result
    await ExtractedResult.create({
      tenantId: upload.tenantId,
      uploadId: upload._id,
      docType: upload.docType,
      extractedData
    });

    // Step 5: Update status
    upload.status = 'completed';
    await upload.save();

    console.log(`[Agenda] Upload ${upload._id} processed successfully ✅`);

    const remainingJobs = await agenda.jobs({ name: 'process uploaded document', nextRunAt: { $ne: null } });
    if (remainingJobs.length === 0) {
      console.log('[Agenda] Queue is empty 🟢');
    }

  } catch (error) {
    console.error('[Agenda] Error processing document:', error.message);
    if (uploadId) {
      await Upload.findByIdAndUpdate(uploadId, { status: 'failed' });
    }
  }
});

agenda.on('start', (job) => {
  console.log(`[Agenda] Job started: ${job.attrs.name} (ID: ${job.attrs._id})`);
});

agenda.on('complete', (job) => {
  console.log(`[Agenda] Job completed: ${job.attrs.name} (ID: ${job.attrs._id})`);
});

agenda.on('fail', (err, job) => {
  console.error(`[Agenda] Job failed: ${job.attrs.name} → ${err.message}`);
});

const startAgenda = async () => {
  await agenda.start();
};

module.exports = {
  agenda,
  startAgenda
};
