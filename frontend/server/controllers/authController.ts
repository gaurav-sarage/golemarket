import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { ShopOwner } from '../models/ShopOwner';
import Joi from 'joi';
import sendEmail from '../utils/sendEmail';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: (process.env.JWT_EXPIRE || '30d') as any
    });
};

const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
    const token = generateToken(user._id.toString(), user.role);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional()
});

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) { res.status(400).json({ success: false, message: error.details[0].message }); return; }

        const { name, email, password, phone } = req.body;
        let user = await User.findOne({ email });
        if (user) { res.status(400).json({ success: false, message: 'User already exists' }); return; }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(20).toString('hex');

        user = await User.create({ name, email, password: hashedPassword, phone, role: 'customer', verificationToken });

        const clientUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? `https://${req.get('host')}` : 'http://localhost:3000');
        const verifyUrl = `${clientUrl}/verify-email?token=${verificationToken}`;
        await sendEmail({
            email,
            subject: 'Email Verification - Gole Market Hub',
            message: `<h1>Welcome to Gole Market!</h1><p>Please click on the link below to verify your email address and activate your account:</p><a href="${verifyUrl}">${verifyUrl}</a>`
        });

        res.status(201).json({ success: true, message: 'Registration successful! Please check your email to verify your account.' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) { res.status(400).json({ success: false, message: 'Please provide email and password' }); return; }

        const user = await User.findOne({ email }).select('+password');
        if (!user) { res.status(401).json({ success: false, message: 'User with this email not found' }); return; }

        if (!user.isVerified) { res.status(401).json({ success: false, message: 'Please verify your email address to log in.' }); return; }

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) { res.status(401).json({ success: false, message: 'Incorrect password' }); return; }

        sendTokenResponse(user, 200, res);
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const registerShopOwner = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) { res.status(400).json({ success: false, message: error.details[0].message }); return; }

        const { name, email, password, phone } = req.body;
        let owner = await ShopOwner.findOne({ email });
        if (owner) { res.status(400).json({ success: false, message: 'Shop Owner already exists' }); return; }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(20).toString('hex');

        owner = await ShopOwner.create({ name, email, password: hashedPassword, phone, role: 'shop_owner', verificationToken });

        const clientUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? `https://${req.get('host')}` : 'http://localhost:3000');
        const verifyUrl = `${clientUrl}/verify-email?token=${verificationToken}`;
        await sendEmail({
            email,
            subject: 'Seller Account Verification - Gole Market Hub',
            message: `<h1>Welcome to Gole Market!</h1><p>Please click on the link below to verify your email address and activate your Seller account:</p><a href="${verifyUrl}">${verifyUrl}</a>`
        });

        res.status(201).json({ success: true, message: 'Registration successful! Please check your email to verify your account.' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const loginShopOwner = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) { res.status(400).json({ success: false, message: 'Please provide email and password' }); return; }

        const owner = await ShopOwner.findOne({ email }).select('+password');
        if (!owner) { res.status(401).json({ success: false, message: 'Shop Owner with this email not found' }); return; }

        if (!owner.isVerified) { res.status(401).json({ success: false, message: 'Please verify your email address to log in.' }); return; }

        const isMatch = await bcrypt.compare(password, owner.password!);
        if (!isMatch) { res.status(401).json({ success: false, message: 'Incorrect password' }); return; }

        sendTokenResponse(owner, 200, res);
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const logout = (req: Request, res: Response): void => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({ success: true, data: {} });
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = (req as any).user;
        const { name, phone } = req.body;

        let Model: any = payload.role === 'customer' || payload.role === 'admin' ? User : ShopOwner;
        const updatedUser = await Model.findByIdAndUpdate(
            payload.id,
            { name, phone },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = (req as any).user;
        let user;
        if (payload.role === 'customer' || payload.role === 'admin') {
            user = await User.findById(payload.id).select('-password');
        } else {
            user = await ShopOwner.findById(payload.id).select('-password');
        }
        res.status(200).json({ success: true, data: user });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        let user = await User.findOne({ verificationToken: token });
        let owner = await ShopOwner.findOne({ verificationToken: token });

        if (!user && !owner) {
            res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
            return;
        }

        if (user) {
            user.isVerified = true;
            user.verificationToken = undefined;
            await user.save();
            sendTokenResponse(user, 200, res);
            return;
        }

        if (owner) {
            owner.isVerified = true;
            owner.verificationToken = undefined;
            await owner.save();
            sendTokenResponse(owner, 200, res);
            return;
        }
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        let owner = await ShopOwner.findOne({ email });

        const account = user || owner;
        if (!account) {
            res.status(404).json({ success: false, message: 'There is no user with that email' });
            return;
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        account.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        account.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000) as any; // 10 minutes
        await account.save({ validateBeforeSave: false });

        const clientUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? `https://${req.get('host')}` : 'http://localhost:3000');
        const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
        try {
            await sendEmail({
                email: account.email,
                subject: 'Password Reset Request',
                message: `<p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset your password:\n\n <a href="${resetUrl}">${resetUrl}</a></p>`
            });
            res.status(200).json({ success: true, message: 'Email sent successfully' });
        } catch (err) {
            account.resetPasswordToken = undefined;
            account.resetPasswordExpire = undefined;
            await account.save({ validateBeforeSave: false });
            res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token as string).digest('hex');

        let user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() as any }
        });

        let owner = await ShopOwner.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() as any }
        });

        const account = user || owner;

        if (!account) {
            res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
            return;
        }

        const { password } = req.body;
        if (!password || password.length < 6) {
            res.status(400).json({ success: false, message: 'Please provide a new password with at least 6 characters' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(password, salt);
        account.resetPasswordToken = undefined;
        account.resetPasswordExpire = undefined;
        await account.save();

        sendTokenResponse(account, 200, res);
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
