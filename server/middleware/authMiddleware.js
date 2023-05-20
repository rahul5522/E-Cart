import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //   console.log(decoded);

      req.user = await User.findById(decoded.data).select('-password');

      next();
    } catch (error) {
      // console.log(error);
      res.status(401);

      throw new Error('Not Authorized , Token verification failed');
    }
  }

  if (!token) {
    res.status(401);

    throw new Error('Not Authorized, Please login to get access!!');
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({
      msg: 'Access Denied. You are not ADMIN!!!',
    });
  }
});
