import { Router } from 'express';
import { checkout, verifyPayment, getUserOrders, getShopOrders } from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/checkout', protect, authorize('customer'), checkout);
router.post('/verify-payment', protect, authorize('customer'), verifyPayment);
router.get('/my-orders', protect, authorize('customer'), getUserOrders);
router.get('/shop/:shopId', protect, authorize('shop_owner'), getShopOrders);

export default router;
