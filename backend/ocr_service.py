import os
import sys
import pytesseract
import cv2
from PIL import Image
from pdf2image import convert_from_path
import numpy as np
from pytesseract import Output
import re

# --- Deskew Function with angle threshold ---
def deskew(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bitwise_not(gray)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    coords = np.column_stack(np.where(thresh > 0))
    angle = cv2.minAreaRect(coords)[-1]

    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    if abs(angle) > 15:
        print(f" Skipping deskew, detected angle {angle:.2f} too large")
        return image

    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    print(f" Rotated by {angle:.2f} degrees to deskew")
    return rotated

# --- Preprocessing Function ---
def preprocess_image(img, light=False):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if light:
        gray = cv2.bilateralFilter(gray, 9, 75, 75)
    else:
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    kernel = np.ones((2, 2), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    return binary

# --- Postprocessing Text Correction ---
def postprocess_ocr_text(text):
    corrected = text.replace('O', '0').replace('I', '1').replace('S', '5').replace('Z', '2')
    return corrected

# --- Extract Supplier Name ---
def extract_supplier_name(text):
    matches = re.findall(r'([A-Za-z\s&.,]+)\s+GSTIN[:：]', text, flags=re.IGNORECASE)
    if matches:
        return matches[0].strip()
    lines = text.splitlines()
    for line in lines:
        if 'GSTIN' in line.upper():
            index = lines.index(line)
            return lines[index - 1].strip() if index > 0 else ""
    return ""

# --- Extract Invoice Number ---
def extract_invoice_number(image):
    h, w = image.shape[:2]
    roi = image[int(h*0.18):int(h*0.25), int(w*0.5):w]  # Adjusted based on invoice sample
    config = r'--oem 3 --psm 7 -c tessedit_char_whitelist=0123456789-/ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    text = pytesseract.image_to_string(roi, config=config)
    matches = re.findall(r'GST-\d{4}/\d{4}[-/]?\d{0,2}', text)
    if matches:
        return matches[0]
    return text.strip()

# --- OCR for PDFs with fallback ---
def extract_text_from_pdf(pdf_path):
    # Adjust poppler_path depending on OS
    poppler_path = "/usr/bin" if os.name != "nt" else None

    print(f"Processing PDF: {pdf_path}")
    pages = convert_from_path(pdf_path, dpi=400, poppler_path=poppler_path)
    full_text = ""
    supplier_name = ""
    invoice_number = ""
    os.makedirs("debug", exist_ok=True)

    for i, page in enumerate(pages):
        img_path = f"debug/page_{i + 1}.png"
        page.save(img_path, "PNG")
        img = cv2.imread(img_path)
        img = deskew(img)
        preprocessed = preprocess_image(img)
        cv2.imwrite(f"debug/preprocessed_strong_{i + 1}.png", preprocessed)
        custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:/-'
        text = pytesseract.image_to_string(Image.fromarray(preprocessed), config=custom_config, lang='eng')
        text = postprocess_ocr_text(text)

        if len(text.strip()) < 100:
            print(" Weak OCR result, retrying with light preprocessing...")
            light_preprocessed = preprocess_image(img, light=True)
            cv2.imwrite(f"debug/preprocessed_light_{i + 1}.png", light_preprocessed)
            text = pytesseract.image_to_string(Image.fromarray(light_preprocessed), config=custom_config, lang='eng')
            text = postprocess_ocr_text(text)

        if i == 0:
            h, w = preprocessed.shape
            top_section = preprocessed[0:int(h*0.2), 0:w]
            supplier_text = pytesseract.image_to_string(top_section, config=custom_config)
            supplier_name = extract_supplier_name(supplier_text + text)
            invoice_number = extract_invoice_number(preprocessed)

        full_text += f"\n--- Page {i + 1} ---\n{text}"

    return full_text.strip(), supplier_name, invoice_number

# --- Convert Image to PDF and Extract ---
def extract_text_from_image_as_pdf(image_path):
    print(f"Converting Image to PDF for OCR: {image_path}")
    image = Image.open(image_path).convert("RGB")
    max_pixels = 89_000_000
    if image.width * image.height > max_pixels:
        print(f" Large image detected ({image.width}x{image.height}). Resizing before processing...")
        image.thumbnail((2000, 2000), Image.ANTIALIAS)
    temp_pdf = "temp_converted.pdf"
    image.save(temp_pdf)
    text, supplier, invoice_number = extract_text_from_pdf(temp_pdf)
    os.remove(temp_pdf)
    return text, supplier, invoice_number

# --- Assess OCR Quality ---
def assess_ocr_confidence(image):
    data = pytesseract.image_to_data(image, output_type=Output.DICT)
    confidences = [int(conf) for conf in data['conf'] if str(conf).isdigit()]
    if not confidences:
        print(" Unable to calculate confidence score.")
        return
    average_conf = sum(confidences) / len(confidences)
    print(f" Actual OCR Confidence: {average_conf:.2f}%")
    if average_conf < 50:
        print(" Low Confidence: OCR output may be incomplete or garbled.")
    elif average_conf < 80:
        print(" Moderate Confidence: Text may be missing key fields.")
    else:
        print(" High Confidence: Likely a good OCR result.")

# --- Main Execution ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(" Please provide a file path as argument.")
        sys.exit(1)

    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(" File not found:", file_path)
        sys.exit(1)

    ext = os.path.splitext(file_path)[-1].lower()
    if ext == ".pdf":
        extracted_text, supplier, invoice_number = extract_text_from_pdf(file_path)
    elif ext in [".jpg", ".jpeg", ".png"]:
        extracted_text, supplier, invoice_number = extract_text_from_image_as_pdf(file_path)
    else:
        print(" Unsupported file type.")
        sys.exit(1)

    print("\nOCR Extraction Complete!\n")
    print(extracted_text)
    print("\n")
    print(f"Detected Supplier Name: {supplier}")
    print(f"Detected Invoice Number: {invoice_number}\n")

    try:
        sample_image = cv2.imread("debug/preprocessed_strong_1.png")
        if sample_image is not None:
            assess_ocr_confidence(sample_image)
    except Exception as e:
        print(" OCR confidence check failed:", str(e))
