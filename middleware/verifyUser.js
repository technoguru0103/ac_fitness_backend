const User = require('../models/User');

const verifyUser = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user.verified) return res.status(403).json({ message: 'Please verify your email to access this resource' });

  next();
};

module.exports = verifyUser;