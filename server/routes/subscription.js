const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const JWT_SECRET = process.env.JWT_SECRET;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post('/subscribe', async (req, res) => {
  const { plan, paymentMethodId } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const planLimits = {
      STUDENT: { resumes: 1, submissions: 45, priceId: 'price_student_id' },
      RECRUITER: { resumes: 5, submissions: 45, priceId: 'price_recruiter_id' },
      BUSINESS: { resumes: 3, submissions: 145, priceId: 'price_business_id' },
    };

    if (!planLimits[plan]) return res.status(400).json({ error: 'Invalid plan' });

    // Stripe payment (optional for now)
    if (paymentMethodId) {
      const customer = await stripe.customers.create({ email: user.email, payment_method: paymentMethodId });
      await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: planLimits[plan].priceId }],
      });
    }

    user.subscription = plan;
    user.resumes = planLimits[plan].resumes;
    user.submissions = planLimits[plan].submissions;
    await user.save();

    // Send subscription confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to ZvertexAGI!',
      text: `Thank you for subscribing to the ${plan} plan! You can now upload ${planLimits[plan].resumes} resume(s) and submit up to ${planLimits[plan].submissions} applications per day.`,
    });

    res.json({ message: 'Subscription successful', plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;