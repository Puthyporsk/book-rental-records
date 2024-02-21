import express from 'express';
const router = express.Router();
import bookController from '../controllers/bookController.js';

router.get('/getAll', bookController.getAllBooks);
router.post('/create', bookController.createBook);

export default router;
