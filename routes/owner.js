import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome, Owner! You have full access.' });
});

export default router;
