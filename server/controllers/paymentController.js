import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';

export const intializePayment = async (req, res) => {
  //   console.log(req.body);
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        // console.log(error);

        return res.status(500).json({ msg: 'Something went wrong' });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const verify = async (req, res) => {
  try {
    // console.log(req.body);
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body.data;

    const dbId = req.params.id;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);

    shasum.update(`${order_id}|${razorpay_payment_id}`);

    const digest = shasum.digest('hex');

    // console.log('sig received ', razorpay_signature);
    // console.log('sig generated ', digest);

    // comaparing our digest with the actual signature
    if (digest !== razorpay_signature)
      return res.status(400).json({ msg: 'Transaction not legit!' });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    const temp = await Order.findByIdAndUpdate(dbId, {
      isPaid: true,
      paidAt: Date.now(),
    });

    res.status(200).json({
      msg: 'Payment Verified Successfully',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
