import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';

export const saveOrder = asyncHandler(async (req, res) => {
  const {
    cartItems,
    shippingDetails,
    paymentMethod,
    itemsPrice,
    tax,
    shippingCharge,
    total,
  } = req.body;

  // console.log(req.body);

  if (cartItems && cartItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems: cartItems,

      shippingAddress: shippingDetails,
      paymentMethod,
      itemsPrice,
      taxPrice: tax,
      shippingPrice: shippingCharge,
      totalPrice: total,
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  }
});

export const getOrderById = asyncHandler(async (req, res) => {
  // console.log(req.params.id);
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);

    throw new Error('Order not found');
  }
});

export const getOrderByUser = asyncHandler(async (req, res) => {
  // console.log(req.user);

  const orders = await Order.find({ user: req.user._id });

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);

    throw new Error('Order not found');
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  // console.log(req.user);

  const orders = await Order.find({}).populate('user', 'id name');

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);

    throw new Error('Orders not found');
  }
});
