import express from 'express';
import bannerController from '../controllers/banner.controller';

const router = express.Router();

router.get('/list', bannerController.getBannerList);

export default router;