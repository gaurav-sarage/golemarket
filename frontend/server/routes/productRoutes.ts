import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', protect, authorize('shop_owner'), upload.array('images', 3), createProduct);
router.put('/:id', protect, authorize('shop_owner'), upload.array('images', 3), updateProduct);
router.delete('/:id', protect, authorize('shop_owner'), deleteProduct);

export default router;
