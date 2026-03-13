import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { getGlobalCustomerDashboard, getGlobalMerchantDashboard } from '../controllers/adminController';

const router = Router();

// Protect all routes with auth checks
router.use(protect);

// Require Super Admin access
router.use(authorize('superadmin'));

router.get('/customer-dashboard', getGlobalCustomerDashboard);
router.get('/merchant-dashboard', getGlobalMerchantDashboard);

export default router;
