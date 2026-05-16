const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const upload = require('../utils/multer');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/products - List all user's products
 * Supports filtering by published status
 * @route GET /api/products
 * @query {string} [published] - Filter by published status (true/false)
 * @returns {Object} Array of products
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { published } = req.query;
    let query = { userId: req.userId };
    if (published !== undefined) query.isPublished = published === 'true';
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/products - Create new product
 * Accepts file uploads and external image URLs
 * @route POST /api/products
 * @param {File[]} images - Product images (max 10 files, 5MB each)
 * @param {string} productName - Product name (required)
 * @param {string} productType - Product type enum (required)
 * @param {number} quantityStock - Stock quantity (required)
 * @param {number} mrp - MRP (required)
 * @param {number} sellingPrice - Selling price (required)
 * @param {string} brandName - Brand name (required)
 * @param {string} exchangeEligibility - Exchange eligible (Yes/No)
 * @returns {Object} Created product object
 */
router.post('/', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { productName, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligibility } = req.body;

    if (!productName || !productName.trim()) {
      if (req.files) req.files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Accept optional external image URLs sent in the `imageUrls` field (JSON array or comma/string)
    if (req.body.imageUrls) {
      let urls = [];
      try {
        urls = JSON.parse(req.body.imageUrls);
      } catch (e) {
        // fallback: if it's a single string or comma separated
        if (typeof req.body.imageUrls === 'string') {
          urls = req.body.imageUrls.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      if (Array.isArray(urls) && urls.length > 0) {
        // only accept http(s) urls
        const valid = urls.filter(u => typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://')));
        images.push(...valid);
      }
    }

    const product = new Product({
      userId: req.userId,
      productName: productName.trim(),
      productType,
      quantityStock: Number(quantityStock),
      mrp: Number(mrp),
      sellingPrice: Number(sellingPrice),
      brandName: brandName?.trim(),
      images,
      exchangeEligibility: exchangeEligibility || 'Yes'
    });

    await product.save();
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/products/:id - Get single product
 * @route GET /api/products/:id
 * @param {string} id - Product ID
 * @returns {Object} Product object
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * PUT /api/products/:id - Update product
 * Supports adding/removing images and updating product details
 * @route PUT /api/products/:id
 * @param {string} id - Product ID
 * @param {File[]} newImages - New product images to add
 * @param {string} removedImages - JSON array of images to remove
 * @returns {Object} Updated product object
 */
router.put('/:id', authMiddleware, upload.array('newImages', 10), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { productName, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligibility, removedImages } = req.body;

    if (removedImages) {
      const toRemove = JSON.parse(removedImages);
      toRemove.forEach(imgPath => {
        const fullPath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
      product.images = product.images.filter(img => !toRemove.includes(img));
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    // Also accept external image URLs on update
    if (req.body.imageUrls) {
      let urls = [];
      try {
        urls = JSON.parse(req.body.imageUrls);
      } catch (e) {
        if (typeof req.body.imageUrls === 'string') {
          urls = req.body.imageUrls.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      if (Array.isArray(urls) && urls.length > 0) {
        const valid = urls.filter(u => typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://')));
        product.images = [...product.images, ...valid];
      }
    }

    if (productName !== undefined) product.productName = productName.trim();
    if (productType !== undefined) product.productType = productType;
    if (quantityStock !== undefined) product.quantityStock = Number(quantityStock);
    if (mrp !== undefined) product.mrp = Number(mrp);
    if (sellingPrice !== undefined) product.sellingPrice = Number(sellingPrice);
    if (brandName !== undefined) product.brandName = brandName.trim();
    if (exchangeEligibility !== undefined) product.exchangeEligibility = exchangeEligibility;

    await product.save();
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * PATCH /api/products/:id/publish - Toggle product publish status
 * @route PATCH /api/products/:id/publish
 * @param {string} id - Product ID
 * @returns {Object} Updated product object
 */
router.patch('/:id/publish', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.isPublished = !product.isPublished;
    await product.save();
    res.json({ success: true, message: product.isPublished ? 'Product published' : 'Product unpublished', product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * DELETE /api/products/:id - Delete product
 * Removes product and all associated images
 * @route DELETE /api/products/:id
 * @param {string} id - Product ID
 * @returns {Object} Success message
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.images.forEach(imgPath => {
      // only attempt to delete local uploaded files
      if (typeof imgPath === 'string' && imgPath.startsWith('/uploads/')) {
        const fullPath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    });

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;