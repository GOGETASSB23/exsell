// src/utils/dateUtils.js
export const parseDates = (text) => {
    const datePatterns = [
      {
        // Pattern for "Valid from DD/MM/YYYY"
        regex: /Valid from (\d{2}\/\d{2}\/\d{4})/i,
        group: 1
      },
      {
        // Pattern for "Start Date: DD-MM-YYYY"
        regex: /Start Date:?\s*(\d{2}-\d{2}-\d{4})/i,
        group: 1
      },
      {
        // Pattern for "Subscription started on YYYY-MM-DD"
        regex: /started on (\d{4}-\d{2}-\d{2})/i,
        group: 1
      }
    ];
  
    let startDate = null;
    let endDate = null;
  
    // Find start date
    for (const pattern of datePatterns) {
      const match = text.match(pattern.regex);
      if (match) {
        startDate = parseDate(match[pattern.group]);
        break;
      }
    }
  
    // Look for end date patterns
    const endDatePatterns = [
      /Valid until (\d{2}\/\d{2}\/\d{4})/i,
      /End Date:?\s*(\d{2}-\d{2}-\d{4})/i,
      /expires on (\d{4}-\d{2}-\d{2})/i
    ];
  
    for (const pattern of endDatePatterns) {
      const match = text.match(pattern);
      if (match) {
        endDate = parseDate(match[1]);
        break;
      }
    }
  
    return { startDate, endDate };
  };
  
  const parseDate = (dateStr) => {
    // Handle different date formats
    const formats = [
      { regex: /^\d{2}\/\d{2}\/\d{4}$/, parser: (str) => {
        const [day, month, year] = str.split('/');
        return new Date(year, month - 1, day);
      }},
      { regex: /^\d{2}-\d{2}-\d{4}$/, parser: (str) => {
        const [day, month, year] = str.split('-');
        return new Date(year, month - 1, day);
      }},
      { regex: /^\d{4}-\d{2}-\d{2}$/, parser: (str) => new Date(str) }
    ];
  
    for (const format of formats) {
      if (format.regex.test(dateStr)) {
        return format.parser(dateStr);
      }
    }
  
    throw new Error('Unsupported date format');
  };