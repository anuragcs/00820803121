const axios = require('axios');
const config = require('../utils/config');
const { updateWindow } = require('../utils/window');
const { getAuthToken } = require('./authController');
const { register } = require('./registerController');

const endpoints = {
    p: 'primes',
    f: 'fibo',
    e: 'even',
    r: 'rand'
};

async function fetchNumbers(type) {
    const endpoint = endpoints[type];
    if (!endpoint) {
        throw new Error('Invalid number type');
    }
    try {
        const response = await axios.get(`${config.testServerUrl}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${config.accessToken}`
            },
            timeout: 5000
        });
        if (response.data && response.data.numbers) {
            return response.data.numbers;
        } else {
            throw new Error('Failed to fetch numbers');
        }
    } catch (error) {
        if (error.response && error.response.data.message === 'Invalid authorization token') {
            console.log('Token expired, refreshing token...');
            const registerData = await register();
            if (registerData) {
                config.clientID = registerData.clientID;
                config.clientSecret = registerData.clientSecret;
                config.accessToken = await getAuthToken(config.clientID, config.clientSecret);
                const response = await axios.get(`${config.testServerUrl}/${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${config.accessToken}`
                    },
                    timeout: 5000
                });
                if (response.data && response.data.numbers) {
                    return response.data.numbers;
                } else {
                    throw new Error('Failed to fetch numbers after token refresh');
                }
            }
        } else {
            console.error('Fetching numbers error', error.response ? error.response.data : error.message);
            throw new Error('Failed to fetch numbers');
        }
    }
}

async function getNumbers(req, res) {
    const type = req.params.type;
    try {
        const numbers = await fetchNumbers(type);
        if (!numbers || !Array.isArray(numbers)) {
            throw new Error('Invalid newNumbers input');
        }
        const { windowPrevState, windowCurrState, avg } = updateWindow(numbers);
        res.json({ numbers, windowPrevState, windowCurrState, avg });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = { getNumbers };
