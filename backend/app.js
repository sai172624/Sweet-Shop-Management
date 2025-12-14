const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// CORS Configuration - Update port if your frontend uses 5175
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// MONGOOSE MODELS
// =====================================================

// User Model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
}, { timestamps: true });

// Sweet Model
const sweetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Sweet name is required'],
        unique: true,
        trim: true,
        minlength: [2, 'Sweet name must be at least 2 characters'],
        maxlength: [100, 'Sweet name cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['chocolate', 'candy', 'gummy', 'lollipop', 'pastry', 'cake', 'cookie', 'other', 'Indian Sweet'],
        default: 'other'
    },
    description: { type: String, maxlength: [500, 'Description cannot exceed 500 characters'] },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    quantity: { type: Number, required: [true, 'Quantity is required'], min: [0, 'Quantity cannot be negative'], default: 0 },
    imageUrl: { type: String, default: null },
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Purchase History Model
const purchaseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Sweet', required: true },
    quantity: { type: Number, required: true, min: [1, 'Purchase quantity must be at least 1'] },
    totalPrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' }
}, { timestamps: true });

// Inventory Log Model
const inventoryLogSchema = new mongoose.Schema({
    sweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Sweet', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['purchase', 'restock', 'adjustment'], required: true },
    quantityChange: { type: Number, required: true },
    quantityBefore: { type: Number, required: true },
    quantityAfter: { type: Number, required: true },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Create Models (Use existing or create new to prevent overwrite errors in tests)
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Sweet = mongoose.models.Sweet || mongoose.model('Sweet', sweetSchema);
const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);
const InventoryLog = mongoose.models.InventoryLog || mongoose.model('InventoryLog', inventoryLogSchema);

// =====================================================
// MIDDLEWARE FUNCTIONS
// =====================================================

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'Access token is missing' });
        }

        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid or expired token' });
            }

            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ success: false, message: 'Authentication error' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const isValidEmail = (email) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

// =====================================================
// API ROUTES
// =====================================================

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Sweet Shop API is running!', timestamp: new Date().toISOString() });
});

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
        if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email' });
        if (password.length < 6) return res.status(400).json({ success: false, message: 'Password too short' });

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(409).json({ success: false, message: 'User exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role: role === 'admin' ? 'admin' : 'user' });
        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(201).json({ success: true, message: 'Registered', data: { user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }, token } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Fields required' });

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        user.lastLogin = new Date();
        await user.save();
        const token = generateToken(user._id);

        res.json({ success: true, message: 'Login successful', data: { user: { id: user._id, username: user.username, email: user.email, role: user.role }, token } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
    res.json({ success: true, data: { user: req.user } });
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const { username } = req.body;
        if (!username || username.length < 3) return res.status(400).json({ success: false, message: 'Username too short' });
        
        req.user.username = username;
        await req.user.save();
        res.json({ success: true, message: 'Updated', data: { username: req.user.username } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

// --- PUBLIC SWEETS ROUTES ---

app.get('/api/public/sweets', async (req, res) => {
    try {
        const sweets = await Sweet.find({ isAvailable: true }).sort({ name: 1 });
        res.json({ success: true, data: { sweets } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch sweets' });
    }
});

app.get('/api/public/sweets/search', async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice, available } = req.query;
        let query = {};
        if (name) query.name = { $regex: name, $options: 'i' };
        if (category) query.category = category;
        if (available !== undefined) query.isAvailable = available === 'true';
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        const sweets = await Sweet.find(query).sort({ name: 1 });
        res.json({ success: true, data: { sweets } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Search failed' });
    }
});

// --- PROTECTED SWEETS ROUTES (ADMIN/USER) ---

app.post('/api/sweets', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { name, category, description, price, quantity, imageUrl, ingredients, allergens } = req.body;
        if (!name || !category || price === undefined || quantity === undefined) {
            return res.status(400).json({ success: false, message: 'Missing fields' });
        }
        const existingSweet = await Sweet.findOne({ name });
        if (existingSweet) return res.status(409).json({ success: false, message: 'Sweet exists' });

        const newSweet = new Sweet({
            name, category, description, price, quantity, imageUrl, ingredients, allergens,
            isAvailable: quantity > 0, createdBy: req.user._id
        });
        await newSweet.save();
        res.status(201).json({ success: true, message: 'Sweet added', data: newSweet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Add failed', error: error.message });
    }
});

app.get('/api/sweets', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;
        const skip = (page - 1) * limit;
        const sortOrder = order === 'desc' ? -1 : 1;

        const sweets = await Sweet.find().sort({ [sortBy]: sortOrder }).skip(skip).limit(Number(limit))
            .populate('createdBy', 'username').populate('updatedBy', 'username');
        
        const total = await Sweet.countDocuments();
        res.json({ success: true, data: { sweets, pagination: { total, page, limit } } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Fetch failed', error: error.message });
    }
});

// Re-using search logic for protected route
app.get('/api/sweets/search', authenticateToken, async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice, available } = req.query;
        let query = {};
        if (name) query.name = { $regex: name, $options: 'i' };
        if (category) query.category = category;
        if (available !== undefined) query.isAvailable = available === 'true';
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        const sweets = await Sweet.find(query);
        res.json({ success: true, data: { sweets } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Search failed', error: error.message });
    }
});

app.get('/api/sweets/:id', authenticateToken, async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id).populate('createdBy', 'username').populate('updatedBy', 'username');
        if (!sweet) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: sweet });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/sweets/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const updates = req.body;
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ success: false, message: 'Not found' });

        Object.assign(sweet, updates);
        if (updates.quantity !== undefined) sweet.isAvailable = updates.quantity > 0;
        sweet.updatedBy = req.user._id;
        
        await sweet.save();
        res.json({ success: true, message: 'Updated', data: sweet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
});

app.delete('/api/sweets/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        await Sweet.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
    }
});

// =====================================================
// INVENTORY & PURCHASE ROUTES (CRITICAL RESTORED)
// =====================================================

// Purchase a sweet
app.post('/api/sweets/:id/purchase', authenticateToken, async (req, res) => {
    try {
        const { quantity } = req.body;
        const sweetId = req.params.id;

        if (!quantity || quantity < 1) return res.status(400).json({ success: false, message: 'Invalid quantity' });

        const sweet = await Sweet.findById(sweetId);
        if (!sweet) return res.status(404).json({ success: false, message: 'Not found' });

        if (!sweet.isAvailable || sweet.quantity < quantity) {
            return res.status(400).json({ success: false, message: `Insufficient stock: ${sweet.quantity}` });
        }

        const totalPrice = sweet.price * quantity;
        const quantityBefore = sweet.quantity;
        
        sweet.quantity -= quantity;
        sweet.isAvailable = sweet.quantity > 0;
        await sweet.save();

        const purchase = await Purchase.create({
            user: req.user._id, sweet: sweetId, quantity, totalPrice, status: 'completed'
        });

        await InventoryLog.create({
            sweet: sweetId, user: req.user._id, action: 'purchase',
            quantityChange: -quantity, quantityBefore, quantityAfter: sweet.quantity,
            reason: `Purchase by ${req.user.username}`
        });

        res.json({ success: true, message: 'Purchased', data: { purchase } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Purchase failed', error: error.message });
    }
});

// Restock (Admin)
app.post('/api/sweets/:id/restock', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { quantity, reason } = req.body;
        const sweetId = req.params.id;

        if (!quantity || quantity < 1) return res.status(400).json({ success: false, message: 'Invalid qty' });

        const sweet = await Sweet.findById(sweetId);
        if (!sweet) return res.status(404).json({ success: false, message: 'Not found' });

        const quantityBefore = sweet.quantity;
        sweet.quantity += quantity;
        sweet.isAvailable = true;
        sweet.updatedBy = req.user._id;
        await sweet.save();

        await InventoryLog.create({
            sweet: sweetId, user: req.user._id, action: 'restock',
            quantityChange: quantity, quantityBefore, quantityAfter: sweet.quantity,
            reason: reason || `Restock by ${req.user.username}`
        });

        res.json({ success: true, message: 'Restocked', data: { sweet: sweet.name, newTotal: sweet.quantity } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Inventory Logs (Admin)
app.get('/api/sweets/:id/inventory-logs', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const logs = await InventoryLog.find({ sweet: req.params.id })
            .populate('user', 'username').sort({ timestamp: -1 }).limit(50);
        res.json({ success: true, data: { logs } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// =====================================================
// PURCHASE HISTORY ROUTES (CRITICAL RESTORED)
// =====================================================

// User History
app.get('/api/purchases/my-history', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const purchases = await Purchase.find({ user: req.user._id })
            .populate('sweet', 'name category price')
            .sort({ purchaseDate: -1 })
            .skip(skip).limit(Number(limit));

        const total = await Purchase.countDocuments({ user: req.user._id });
        res.json({ success: true, data: { purchases, total } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch history', error: error.message });
    }
});

// Admin All Purchases
app.get('/api/purchases', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, userId, sweetId } = req.query;
        const skip = (page - 1) * limit;
        let query = {};
        if (userId) query.user = userId;
        if (sweetId) query.sweet = sweetId;

        const purchases = await Purchase.find(query)
            .populate('user', 'username email')
            .populate('sweet', 'name category price')
            .sort({ purchaseDate: -1 })
            .skip(skip).limit(Number(limit));

        const total = await Purchase.countDocuments(query);
        res.json({ success: true, data: { purchases, total } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// =====================================================
// STATISTICS ROUTES (CRITICAL RESTORED)
// =====================================================

app.get('/api/stats/dashboard', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const totalSweets = await Sweet.countDocuments();
        const availableSweets = await Sweet.countDocuments({ isAvailable: true });
        const outOfStockSweets = await Sweet.countDocuments({ quantity: 0 });
        const totalUsers = await User.countDocuments();
        const totalPurchases = await Purchase.countDocuments();
        
        const revenueData = await Purchase.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' }, totalItems: { $sum: '$quantity' } } }
        ]);
        const revenue = revenueData[0] || { totalRevenue: 0, totalItems: 0 };

        const topSweets = await Purchase.aggregate([
            { $group: { _id: '$sweet', totalSold: { $sum: '$quantity' }, totalRevenue: { $sum: '$totalPrice' } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'sweets', localField: '_id', foreignField: '_id', as: 'sweetDetails' } },
            { $unwind: '$sweetDetails' },
            { $project: { name: '$sweetDetails.name', category: '$sweetDetails.category', totalSold: 1, totalRevenue: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalSweets, availableSweets, outOfStockSweets, totalUsers,
                    totalPurchases, totalRevenue: revenue.totalRevenue, totalItemsSold: revenue.totalItems
                },
                topSellingSweets: topSweets
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Stats failed', error: error.message });
    }
});

// =====================================================
// ERROR HANDLING
// =====================================================

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// =====================================================
// EXPORT APP (SERVER IS IN server.js)
// =====================================================
module.exports = app;