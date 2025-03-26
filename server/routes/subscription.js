const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/create-checkout-session', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const planDetails = {
      STUDENT: { priceId: 'price_1NsaXwLmt3YaM34gXvN8iZ5Q', resumes: 1, submissions: 45 },
      RECRUITER: { priceId: 'price_1NsaYELmt3YaM34gX8K9jL2P', resumes: 5, submissions: 45 },
      BUSINESS: { priceId: 'price_1NsaYpLmt3YaM34gXvN8iZ5Q', resumes: 3, submissions: 145 },
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: planDetails[plan].priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/student-dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription`,
      metadata: { userId: user._id.toString(), plan },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/update-selection', async (req, res) => {
  const { companies, technology } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.selectedCompanies = companies;
    user.selectedTechnology = technology;
    await user.save();

    res.json({ message: 'Selection updated successfully' });
  } catch (error) {
    console.error('Error updating selection:', error.message);
    res.status(500).json({ error: 'Failed to update selection' });
  }
});

module.exports = router;