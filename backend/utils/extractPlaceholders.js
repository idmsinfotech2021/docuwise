const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function extractPlaceholders(buffer) {
  const zip = new PizZip(buffer);
  const doc = new Docxtemplater(zip, { delimiters: { start: '[[', end: ']]' } });
  const fullText = doc.getFullText();
  const matches = fullText.match(/\[\[.*?\]\]/g);
  return Array.from(new Set(matches || []));
}

module.exports = { extractPlaceholders };
