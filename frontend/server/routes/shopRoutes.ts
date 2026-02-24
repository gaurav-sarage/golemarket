import { Router } from 'express';
import {
    getShops,
    getShopById,
    getSections,
    updateShopProfile,
    getMyShop,
    createShop
} from '../controllers/shopController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', protect, authorize('shop_owner'), upload.single('logo'), createShop);
router.get('/', getShops);
router.get('/sections', getSections);
router.get('/my-shop', protect, authorize('shop_owner'), getMyShop);
router.get('/:id', getShopById);
router.put('/:id', protect, authorize('shop_owner', 'admin'), upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), updateShopProfile);

export default router;
