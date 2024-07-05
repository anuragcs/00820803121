const axios = require('axios');
const config = require('../utils/config');

async function getAuthToken(clientID, clientSecret) {
    const authData = {
        companyName: config.companyName,
        clientID: clientID,
        clientSecret: clientSecret,
        ownerName: config.ownerName,
        ownerEmail: config.ownerEmail,
        rollno: config.rollno
    };
    try {
        const response = await axios.post(`${config.testServerUrl}/auth`, authData);
        console.log('Authorization successfully done', response.data);
        return response.data['access token'];  // Ensure the response key matches the actual response
    } catch (error) {
        console.log('Error in authorization', error.response ? error.response.data : error.message);
    }
}

module.exports = { getAuthToken };
