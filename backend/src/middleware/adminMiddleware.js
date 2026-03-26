module.exports = (req, res, next) => {
  if (req.user?.rol !== 'yonetici') {
    return res.status(403).json({ message: 'Bu işlem için yönetici yetkisi gereklidir.' });
  }
  next();
};