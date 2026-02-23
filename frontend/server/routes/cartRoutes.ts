import { Router } from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect, authorize('customer'));

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove/:productId', removeFromCart);

export default router;
