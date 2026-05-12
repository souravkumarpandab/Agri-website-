const User = require('../database/models/User');
const Activity = require('../database/models/Activity');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// In-memory OTP store (for development/demo purposes)
const otpStore = new Map();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  const cleanMobile = mobile ? mobile.toString().trim() : '';
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPassword = password ? password.trim() : '';

  if (!cleanMobile || cleanMobile.length < 10) {
    return res.status(400).json({ message: 'A valid mobile number is required.' });
  }
  if (!cleanEmail) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }

  try {
    let user = await User.findOne({ $or: [{ mobile: cleanMobile }, { email: cleanEmail }] });

    if (user) {
      return res.status(400).json({ message: 'User already exists with this mobile number or email.' });
    }

    user = await User.create({
      name: name?.trim(),
      mobile: cleanMobile,
      email: cleanEmail,
      password: cleanPassword,
      isVerified: true // Automatically verify since OTP is removed
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      address: user.address,
      age: user.age,
      qualification: user.qualification,
      farmingType: user.farmingType,
      finance: user.finance,
      photo: user.photo,
      token: generateToken(user._id),
      message: 'Registration successful!'
    });
  } catch (error) {
    console.error('Register Error:', error);
    if (error.name === 'MongooseServerSelectionError' || error.message?.includes('ECONNREFUSED') || error.message?.includes('timed out')) {
      return res.status(500).json({ message: 'Database connection failed. Is MongoDB running locally?' });
    }
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { mobile, password } = req.body;

  const cleanMobile = mobile ? mobile.toString().trim() : '';
  const cleanPassword = password ? password.trim() : '';

  try {
    const user = await User.findOne({ mobile: cleanMobile });

    if (user && (await user.matchPassword(cleanPassword))) {
      res.json({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        address: user.address,
        age: user.age,
        qualification: user.qualification,
        farmingType: user.farmingType,
        finance: user.finance,
        photo: user.photo,
        token: generateToken(user._id),
        message: 'Login successful!'
      });
    } else {
      res.status(401).json({ message: 'Invalid mobile number or password.' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    if (error.name === 'MongooseServerSelectionError' || error.message?.includes('ECONNREFUSED') || error.message?.includes('timed out')) {
      return res.status(500).json({ message: 'Database connection failed. Is MongoDB running locally?' });
    }
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.mobile = req.body.mobile || user.mobile;
      user.address = req.body.address || user.address;
      user.age = req.body.age || user.age;
      user.qualification = req.body.qualification || user.qualification;
      user.farmingType = req.body.farmingType || user.farmingType;
      user.finance = req.body.finance || user.finance;
      if (req.body.photo) user.photo = req.body.photo;
      
      if (req.body.password) {
        user.password = req.body.password; // pre-save hook handles hashing
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        mobile: updatedUser.mobile,
        address: updatedUser.address,
        age: updatedUser.age,
        qualification: updatedUser.qualification,
        farmingType: updatedUser.farmingType,
        finance: updatedUser.finance,
        photo: updatedUser.photo,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getUserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const trackActivity = async (req, res) => {
  try {
    const { actionType, description } = req.body;
    await Activity.create({ user: req.user.id, actionType, description });
    res.status(201).json({ message: 'Activity tracked' });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Generate OTP and send via email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  if (!cleanEmail) {
    return res.status(400).json({ message: 'Email address is required.' });
  }

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory (expires in 10 minutes)
    otpStore.set(cleanEmail, {
      otp,
      expires: Date.now() + 10 * 60 * 1000
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: [cleanEmail, 'souravkumarpandab1437@gmail.com'], // Sent to user and super admin
      subject: `AgriSahayak Password Reset OTP`,
      text: `Your OTP for resetting your AgriSahayak password is: ${otp}\nThis OTP is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP ${otp} sent to ${cleanEmail} and super admin`);

    res.status(200).json({ message: 'OTP sent to your email successfully.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: `Failed to send OTP: ${error.message}` });
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  if (!cleanEmail || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
  }

  try {
    const storedData = otpStore.get(cleanEmail);

    if (!storedData) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP.' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.password = newPassword;
    await user.save();

    // Clear OTP after successful reset
    otpStore.delete(cleanEmail);

    res.status(200).json({ message: 'Password reset successful!' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUserActivities,
  trackActivity,
  forgotPassword,
  resetPassword
};
