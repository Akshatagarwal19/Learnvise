import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome, Student! you have access to all the student related features of this app'});
})

export default router;