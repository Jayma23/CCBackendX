const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(logger('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/auth', require('./routes/auth'));
//app.use('/clone', require('./routes/clone'));

app.get('/', (req, res) => {
    res.send('🚀 CyberClone API is running');
});

module.exports = app;
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});



