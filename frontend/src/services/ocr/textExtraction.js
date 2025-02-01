// src/services/ocr/textExtraction.js
import Tesseract from 'tesseract.js';
import { parseDates } from '../../utils/dateUtils';

export const extractTextFromImage = async (file) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng',
      { logger: () => {} }
    );

    return text;
  } catch (error) {
    console.error('Text extraction failed:', error);
    throw error;
  }
};

export const processBillImage = async (file) => {
  const extractedText = await extractTextFromImage(file);
  const dates = parseDates(extractedText);
  
  if (!dates.startDate) {
    throw new Error('Could not detect subscription start date');
  }

  return dates;
};