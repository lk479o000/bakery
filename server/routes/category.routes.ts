import express from 'express';
import categoryController from '../controllers/category.controller';

const router = express.Router();

router.get('/list', categoryController.getCategoryList);

export default router;