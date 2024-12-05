import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome, Manager! you have full access to this app'})
})

export default router;