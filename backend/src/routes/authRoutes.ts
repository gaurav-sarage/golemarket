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
    resetPassword
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/shop-owner/register', registerShopOwner);
router.post('/shop-owner/login', loginShopOwner);
router.get('/logout', logout);
router.get('/me', protect, getMe);

router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
