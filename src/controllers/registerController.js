const axios = require('axios');
const config = require('../utils/config');

async function register() {
    const registerData = {
        companyName: config.companyName,
        ownerName: config.ownerName,
        rollNo: config.rollno,  // Ensure this is rollNo, not rollno
        ownerEmail: config.ownerEmail,
        accessCode: config.accessCode
    };
    try {
        const response = await axios.post(`${config.testServerUrl}/register`, registerData);
        console.log(`Registration has been done successfully`, response.data);
        return response.data;
    } catch (error) {
        console.log(`Error while registering`, error.response ? error.response.data : error.message);
    }
}

module.exports = { register };
