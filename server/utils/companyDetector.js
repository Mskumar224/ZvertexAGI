const axios = require('axios');

async function verifyCompany(companyName) {
  try {
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(companyName + ' official website')}`, {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (err) {
    return false;
  }
}

module.exports = { verifyCompany };