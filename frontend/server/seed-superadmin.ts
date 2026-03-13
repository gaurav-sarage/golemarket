import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { User } from './models/User';

const seedSuperAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the environment variables');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const superAdminEmail = 'superadmin@golemarket.com';
        const superAdminPassword = 'SuperAdmin123!';

        // Check if super admin already exists
        const existingAdmin = await User.findOne({ email: superAdminEmail });
        
        if (existingAdmin) {
            console.log('Super admin already exists!');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

        // Create super admin
        const superAdmin = new User({
            name: 'Super Admin',
            email: superAdminEmail,
            password: hashedPassword,
            role: 'superadmin',
            isVerified: true
        });

        await superAdmin.save();
        console.log('Super admin created successfully!');
        console.log(`Email: ${superAdminEmail}`);
        console.log(`Password: ${superAdminPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding super admin:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
