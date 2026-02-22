import { Router } from 'express';
import { getShopAnalytics } from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/shop', protect, authorize('shop_owner'), getShopAnalytics);

export default router;
