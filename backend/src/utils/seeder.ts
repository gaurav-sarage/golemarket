import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Section } from '../models/Section';
import { ShopOwner } from '../models/ShopOwner';
import { Shop } from '../models/Shop';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import bcrypt from 'bcryptjs';

dotenv.config();

const sections = [
    { name: 'Food & Groceries', description: 'Fresh produce, essential groceries, and local delicacies.' },
    { name: 'Electronics & Gadgets', description: 'Latest smartphones, computers, and home appliances.' },
    { name: 'Fashion & Apparel', description: 'Trendy clothing, accessories, and footwear for all ages.' },
    { name: 'Services & Others', description: 'Salons, repair shops, pharmacies, and specialty stores.' }
];

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/golemarket');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err: any) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await Section.deleteMany();
        await ShopOwner.deleteMany();
        await Shop.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();

        const createdSections = await Section.insertMany(sections);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const sampleOwner = await ShopOwner.create({
            name: 'Admin Owner',
            email: 'owner@golemarket.com',
            password: hashedPassword,
            phone: '1234567890',
            role: 'shop_owner',
            status: 'active'
        });

        const shopsToCreate = [];
        for (let i = 1; i <= 20; i++) {
            const sectionIndex = i % 4;
            const shopTypes = ['restaurant', 'grocery', 'clothing', 'electronics', 'services', 'others'];
            shopsToCreate.push({
                name: `Shop ${i}`,
                description: `Description for Shop ${i} offering premium services.`,
                section: createdSections[sectionIndex]._id,
                owner: sampleOwner._id,
                contactEmail: `shop${i}@golemarket.com`,
                contactPhone: `987654321${i % 10}`,
                shopType: shopTypes[i % 6] as any,
                status: 'active',
                rating: 4 + (i % 2) * 0.5
            });
        }
        const createdShops = await Shop.insertMany(shopsToCreate);

        for (const shop of createdShops) {
            const category1 = await Category.create({ shopId: shop._id, name: 'General' });
            const category2 = await Category.create({ shopId: shop._id, name: 'Premium' });

            await Product.create({
                shopId: shop._id,
                name: `Product 1 - ${shop.name}`,
                description: 'A great product from our store.',
                price: 10 + (shop.rating * 5),
                sku: `SKU-${shop._id}-1`,
                stockQuantity: 50,
                categoryId: category1._id,
                images: ['https://via.placeholder.com/300'],
                availabilityStatus: 'in_stock'
            });

            await Product.create({
                shopId: shop._id,
                name: `Product 2 - ${shop.name}`,
                description: 'Another high quality product.',
                price: 25 + (shop.rating * 2),
                sku: `SKU-${shop._id}-2`,
                stockQuantity: 20,
                categoryId: category2._id,
                images: ['https://via.placeholder.com/300'],
                availabilityStatus: 'in_stock'
            });
        }

        console.log('Data Imported!');
        process.exit();
    } catch (err: any) {
        console.error(`${err.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Section.deleteMany();
        await ShopOwner.deleteMany();
        await Shop.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (err: any) {
        console.error(`${err.message}`);
        process.exit(1);
    }
};

connectDB().then(() => {
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
});
