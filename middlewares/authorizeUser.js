module.exports = (role) => {
  return async (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    res.status(403).json({ message: '[Permission denied] only admins can use this feature' });
  };
};