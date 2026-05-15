import express from 'express';
import * as adminAuthController from '../controllers/admin-auth.controller';
import { authenticateAdmin } from '../middleware/admin-auth.middleware';

const router = express.Router();

router.post('/auth/login', adminAuthController.login);
router.post('/auth/logout', authenticateAdmin, adminAuthController.logout);
router.get('/user/info', authenticateAdmin, adminAuthController.getUserInfo);
router.get('/auth/codes', authenticateAdmin, adminAuthController.getAccessCodes);

export default router;
