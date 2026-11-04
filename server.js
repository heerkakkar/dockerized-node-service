require('dotenv').config();

const express = require('express');

const app = express();

const PORT = 3000;

// Basic Authentication Middleware
function authenticate(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Secret Area"');
        return res.status(401).send('Authentication required');
    }

    const credentials = Buffer.from(
        authHeader.split(' ')[1],
        'base64'
    ).toString();

    const [username, password] = credentials.split(':');

    if (
        username === process.env.AUTH_USERNAME &&
        password === process.env.AUTH_PASSWORD
    ) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Secret Area"');
        return res.status(401).send('Invalid username or password');
    }
}

// Home route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Protected route
app.get('/secret', authenticate, (req, res) => {
    res.send(process.env.SECRET_MESSAGE);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});