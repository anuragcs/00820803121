const express = require('express');
const { register } = require('./controllers/registerController');
const { getAuthToken } = require('./controllers/authController');
const { getNumbers } = require('./controllers/numbersController');
const config = require('./utils/config');
const jwt = require('jsonwebtoken');

const app = express();
const port = 9876;
app.use(express.json());

app.get('/numbers/:type', getNumbers);

function isTokenExpired(token) {
    try {
        const decoded = jwt.decode(token);
        return decoded.exp < Date.now() / 1000;
    } catch (error) {
        return true;
    }
}

async function getValidAccessToken() {
    if (!config.accessToken || isTokenExpired(config.accessToken)) {
        const registerData = await register();
        if (registerData) {
            config.clientID = registerData.clientID;
            config.clientSecret = registerData.clientSecret;
            const accessToken = await getAuthToken(config.clientID, config.clientSecret);
            if (accessToken) {
                console.log('New Access Token:', accessToken);
                config.accessToken = accessToken;
            }
        }
    } else {
        console.log('Using existing token');
        console.log('Access Token:', config.accessToken);
    }
}

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    try {
        await getValidAccessToken();
    } catch (error) {
        console.log('Error:', error);
    }
});
