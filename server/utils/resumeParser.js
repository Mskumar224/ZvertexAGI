const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function parseResume(file) {
  let text = '';
  if (file.mimetype === 'application/pdf') {
    const data = await pdfParse(file.data);
    text = data.text.toLowerCase();
  } else if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { value } = await mammoth.extractRawText({ buffer: file.data });
    text = value.toLowerCase();
  } else if (file.mimetype === 'text/plain') {
    text = file.data.toString('utf8').toLowerCase();
  }

  const keywords = ['javascript', 'python', 'react', 'node', 'java', 'sql', 'aws', 'docker'].filter((kw) => text.includes(kw));
  return keywords.length > 0 ? keywords : ['Add manually'];
}

module.exports = { parseResume };