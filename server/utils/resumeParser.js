const pdfParse = require('pdf-parse');

async function parseResume(file) {
  const dataBuffer = file.data;
  const data = await pdfParse(dataBuffer);
  const text = data.text.toLowerCase();
  const keywords = ['javascript', 'python', 'react', 'node'].filter((kw) => text.includes(kw));
  return keywords.length > 0 ? keywords : ['Add manually'];
}

module.exports = { parseResume };