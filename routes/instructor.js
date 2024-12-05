import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome, Instructure this is your space you have access to the insturctoreonly features of this app'})
})

export default router;