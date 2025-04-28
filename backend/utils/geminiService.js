// /utils/geminiService.js
const axios = require('axios');

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

// Default Prompts
const defaultPrompts = {
  invoice: `
    You are an intelligent invoice extraction AI. Extract the following fields:
    - invoiceNumber
    - invoiceDate
    - supplierName
    - supplierGSTIN
    - customerName
    - customerGSTIN
    - dueDate
    - totalAmount
    - subtotal
    - taxAmount
    - lineItems (description, quantity, unitPrice, total)

    Return valid JSON without markdown or backticks.
  `,
  customerPO: `
    You are a Purchase Order extraction expert AI. Extract:
    - PONumber
    - PODate
    - customerName
    - shippingAddress
    - billingAddress
    - itemList (itemCode, description, quantity, unitRate, total)

    Only if available. Return JSON strictly.
  `,
  coa: `
    You are a COA (Certificate of Analysis) extraction AI. Extract:
    - certificateNumber
    - batchNumber
    - testResults (parameter, specification, result)

    Only output valid JSON, no markdown.
  `
};

function extractNumbersWithRegex(text, label) {
  const regex = new RegExp(`${label}\\s*[:=]?\\s*(\\d{1,3}(?:,\\d{3})*(?:\\.\\d{1,2})?)`, "i");
  const match = text.match(regex);
  return match ? parseFloat(match[1].replace(/,/g, "")) : 0;
}

function extractTextWithRegex(text, label) {
  const regex = new RegExp(`${label}\\s*[:=]?\\s*(.+)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "Not Found";
}

function cleanOCRText(text) {
  return text
    .replace(/[|]/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/\s{2,}/g, " ")
    .replace(/([a-zA-Z])\s+([0-9])/g, "$1: $2");
}

const callGeminiAPI = async (promptTextFromDB = null, fileText, docType = "invoice") => {
  try {
    // Select fallback prompt
    //let promptText = promptTextFromDB || defaultPrompts[docType] || defaultPrompts.invoice;
    let promptText = promptTextFromDB;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${promptText}\n\nDocument Text:\n${fileText}` }]
        }
      ]
    };

    const response = await axios.post(GEMINI_URL, payload);
    let responseText = response.data.candidates[0].content.parts[0].text.trim();

    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^\s*`+/, "")
      .replace(/`+$/, "")
      .trim();

    const formattedData = JSON.parse(responseText);

    // Optional regex fallback patching
    const rawText = fileText;
    formattedData.supplierName = formattedData.supplierName || extractTextWithRegex(rawText, "Bill To");
    formattedData.supplierGST = formattedData.supplierGST || extractTextWithRegex(rawText, "GSTIN");
    formattedData.taxInvoiceNo = formattedData.taxInvoiceNo || extractTextWithRegex(rawText, "Invoice No");
    formattedData.taxInvoiceDate = formattedData.taxInvoiceDate || extractTextWithRegex(rawText, "Invoice Date");
    formattedData.taxableAmt = formattedData.taxableAmt || extractNumbersWithRegex(rawText, "Basic Value");
    formattedData.IGSTAmt = formattedData.IGSTAmt || extractNumbersWithRegex(rawText, "IGST");
    formattedData.CGSTAmt = formattedData.CGSTAmt || extractNumbersWithRegex(rawText, "CGST");
    formattedData.SGSTAmt = formattedData.SGSTAmt || extractNumbersWithRegex(rawText, "SGST");
    formattedData.totalAmt = formattedData.totalAmt || extractNumbersWithRegex(rawText, "Total Value");

    return formattedData;

  } catch (err) {
    console.error('Error parsing the data:', err);
    console.error('Gemini API Error:', err.response?.data || err.message);
    return {};
  }
};

module.exports = { callGeminiAPI };
