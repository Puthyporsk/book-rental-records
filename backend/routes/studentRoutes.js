import express from 'express';
const router = express.Router();
import studentController from '../controllers/studentController.js';

router.get('/getAll', studentController.findStudent);
router.post('/create', studentController.createStudent);
router.put('/edit', studentController.editStudent);

export default router;
