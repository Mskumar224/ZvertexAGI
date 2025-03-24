const express = require('express');
const Stripe = require('stripe');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { sendSubscriptionEmail } = require('../utils/email');
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create', auth, async (req, res) => {
  const { plan } = req.body;
  const plans = {
    STUDENT: { price: 3900, resumes: 1, submissions: 45 },
    RECRUITER: { price: 7900, resumes: 5, submissions: 45 },
    BUSINESS: { price: 15900, recruiters: 3, submissions: 145 },
  };

  try {
    const user = await User.findById(req.user.userId);
    const subscription = new Subscription({
      userId: req.user.userId,
      plan,
    });
    await subscription.save();

    user.subscription = { plan, ...plans[plan] };
    await user.save();

    // Optional Stripe payment (for now, allow skipping)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `${plan} Plan` },
          unit_amount: plans[plan].price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });

    subscription.stripeSessionId = session.id;
    await subscription.save();

    sendSubscriptionEmail(user.email, plan);
    res.json({ sessionId: session.id }); // Return sessionId for Stripe, but allow proceeding without payment
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;