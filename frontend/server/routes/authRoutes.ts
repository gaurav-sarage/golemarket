import { Router } from 'express';
import {
    registerUser,
    loginUser,
    registerShopOwner,
    loginShopOwner,
    getMe,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/shop-owner/register', registerShopOwner);
router.post('/shop-owner/login', loginShopOwner);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('profileImage'), updateProfile);

router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
