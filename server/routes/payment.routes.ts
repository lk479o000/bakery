import express from 'express';
import paymentController from '../controllers/payment.controller';

const router = express.Router();

router.post('/create', paymentController.createPayment);

router.get('/query', paymentController.queryPayment);

router.post('/callback', paymentController.paymentCallback);

export default router;