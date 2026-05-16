const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generates a 6-digit random OTP
 * @returns {string} Random OTP string
 */
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number is valid
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

/**
 * POST /api/auth/signup - User signup route
 * Creates new user or sends OTP to existing unverified user
 * @route POST /api/auth/signup
 * @param {string} identifier - Email or phone number
 * @returns {Object} Success message and OTP (dev only)
 */
router.post('/signup', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Email or phone number is required' });
    }

    const isEmail = identifier.includes('@');
    
    // Validate email or phone
    if (isEmail) {
      if (!isValidEmail(identifier)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
      }
    } else {
      if (!isValidPhone(identifier)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number' });
      }
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    let query = isEmail ? { email: identifier.toLowerCase() } : { phone: identifier };
    let user = await User.findOne(query);

    // Check if user already exists and is verified
    if (user && user.isVerified) {
      return res.status(400).json({ success: false, message: 'This account already exists. Please login instead.' });
    }

    // Create new user or update existing one
    if (!user) {
      user = new User({
        ...(isEmail ? { email: identifier.toLowerCase() } : { phone: identifier }),
        isNewUser: true
      });
    }

    user.otp = { code: otp, expiresAt: otpExpiry };
    user.isNewUser = true;
    await user.save();

    console.log(`📱 OTP for signup ${identifier}: ${otp}`);

    res.json({
      success: true,
      message: `OTP sent to ${identifier}`,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/auth/login - User login route
 * Sends OTP to registered user
 * @route POST /api/auth/login
 * @param {string} identifier - Email or phone number
 * @returns {Object} Success message and OTP (dev only)
 */
router.post('/login', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Email or phone number is required' });
    }

    const isEmail = identifier.includes('@');
    
    // Validate email or phone
    if (isEmail) {
      if (!isValidEmail(identifier)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
      }
    } else {
      if (!isValidPhone(identifier)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number' });
      }
    }

    let query = isEmail ? { email: identifier.toLowerCase() } : { phone: identifier };
    let user = await User.findOne(query);

    // If user doesn't exist or not verified, suggest signup
    if (!user || !user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'This account does not exist. Please sign up first.',
        suggestSignup: true
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = { code: otp, expiresAt: otpExpiry };
    user.isNewUser = false;
    await user.save();

    console.log(`📱 OTP for login ${identifier}: ${otp}`);

    res.json({
      success: true,
      message: `OTP sent to ${identifier}`,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/auth/verify-otp - Verify OTP and login user
 * Validates OTP and creates JWT token for authenticated user
 * @route POST /api/auth/verify-otp
 * @param {string} identifier - Email or phone number
 * @param {string} otp - 6-digit OTP to verify
 * @returns {Object} JWT token and user data on success
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Identifier and OTP are required' });
    }

    const isEmail = identifier.includes('@');
    let query = isEmail ? { email: identifier.toLowerCase() } : { phone: identifier };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    if (!user.otp || !user.otp.code) {
      return res.status(400).json({ success: false, message: 'OTP not generated. Please request a new one.' });
    }
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    if (user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please enter a valid OTP' });
    }

    user.otp = undefined;
    user.isVerified = true;
    user.isNewUser = false;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, phone: user.phone }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/auth/resend-otp - Resend OTP to user
 * Generates new OTP for user who hasn't verified yet
 * @route POST /api/auth/resend-otp
 * @param {string} identifier - Email or phone number
 * @returns {Object} Success message and OTP (dev only)
 */
router.post('/resend-otp', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Identifier is required' });
    }

    const isEmail = identifier.includes('@');
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    let query = isEmail ? { email: identifier.toLowerCase() } : { phone: identifier };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found. Please login first.' });
    }

    user.otp = { code: otp, expiresAt: otpExpiry };
    await user.save();

    console.log(`📱 Resent OTP for ${identifier}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP resent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/auth/me - Get current authenticated user
 * Requires valid JWT token
 * @route GET /api/auth/me
 * @returns {Object} Current user object
 */
const authMiddleware = require('../middleware/auth');
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;