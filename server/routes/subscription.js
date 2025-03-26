const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSubscriptionEmail } = require('../server');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/subscribe', async (req, res) => {
  const { paymentMethodId, plan } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });
  if (!paymentMethodId || !plan) return res.status(400).json({ error: 'Missing paymentMethodId or plan' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User not found');

    const planPriceMap = {
      STUDENT: 'price_xxxxxxxxxxxxxx',
      RECRUITER: 'price_yyyyyyyyyyyy',
      BUSINESS: 'price_zzzzzzzzzzzz',
    };
    const priceId = planPriceMap[plan];
    if (!priceId) throw new Error(`Invalid plan: ${plan}`);

    let customer = await stripe.customers.list({ email: user.email });
    if (!customer.data.length) {
      customer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    } else {
      customer = customer.data[0];
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
      await stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const planLimits = {
      STUDENT: { resumes: 1, submissions: 45 },
      RECRUITER: { resumes: 5, submissions: 45 },
      BUSINESS: { resumes: 3, submissions: 145 },
    };
    user.subscription = plan;
    user.resumes = planLimits[plan].resumes;
    user.submissions = planLimits[plan].submissions;
    await user.save();

    await sendSubscriptionEmail(user.email, plan);

    const paymentIntent = subscription.latest_invoice.payment_intent;
    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation') {
      return res.status(200).json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    }

    res.status(200).json({ message: 'Subscription successful', subscriptionId: subscription.id });
  } catch (error) {
    console.error('Stripe Subscription Error:', error.message);
    res.status(400).json({ error: error.message || 'An error occurred with Stripe' });
  }
});

module.exports = router;