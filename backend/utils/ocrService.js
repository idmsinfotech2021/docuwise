// /utils/ocrService.js
const { spawn } = require('child_process');
const path = require('path');

const extractTextFromFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['ocr_service.py', filePath]);

    let ocrText = '';

    pythonProcess.stdout.on('data', (data) => {
      ocrText += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('OCR Service Error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(ocrText);
      } else {
        reject('OCR Service Failed');
      }
    });
  });
};

module.exports = { extractTextFromFile };
