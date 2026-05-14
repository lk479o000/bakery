import express from 'express';
import rechargePackageController from '../controllers/recharge-package.controller';

const router = express.Router();

router.get('/list', rechargePackageController.getPackageList);

router.post('/recharge', rechargePackageController.createRecharge);

export default router;