const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const SECRET = process.env.JWT_SECRET || 'your_dev_secret';

const users = [];

// 注册
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    const existing = users.find(u => u.email === email);
    if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });

    const token = jwt.sign({ email }, SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token });
});

// 登录
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ email }, SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token });
});

// 受保护路由
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: `Hello, ${req.user.email}. This is protected content.` });
});

module.exports = router;
