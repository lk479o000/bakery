import express from 'express';
import storeController from '../controllers/store.controller';

const router = express.Router();

router.get('/list', storeController.getStoreList);

router.get('/detail/:id', storeController.getStoreDetail);

router.get('/nearby', storeController.getNearbyStores);

export default router;