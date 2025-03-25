const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

router.post('/subscribe', async (req, res) => {
  const { paymentMethodId, plan } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secret');
  const user = await User.findById(decoded.id);

  const plans = {
    STUDENT: { price: 39, resumes: 1, submissions: 45 },
    RECRUITER: { price: 79, resumes: 5, submissions: 45 },
    BUSINESS: { price: 159, resumes: 3, submissions: 145 },
  };

  try {
    await stripe.paymentIntents.create({
      amount: plans[plan].price * 100,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    user.subscription = plan;
    user.resumes = plans[plan].resumes;
    user.submissions = plans[plan].submissions;
    await user.save();

    await sendEmail(user.email, 'Subscription Confirmation', `Welcome to ${plan}!`);
    res.json({ message: 'Subscription successful' });
  } catch (error) {
    res.status(400).json({ error: 'Subscription failed' });
  }
});

module.exports = router;