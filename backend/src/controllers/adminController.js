const User = require('../models/User');
const Advertisement = require('../models/Advertisement');

// GET /api/admin/users — list all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-sifre -verifyToken -resetToken');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// DELETE /api/admin/users/:id — delete a user and all their ads
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });

    await Advertisement.deleteMany({ owner: req.params.id });
    await user.deleteOne();

    res.json({ message: 'Kullanıcı ve ilanları silindi.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// PATCH /api/admin/users/:id/role — promote or demote a user
exports.updateUserRole = async (req, res) => {
  try {
    const { rol } = req.body;
    if (!['ogrenci', 'yonetici'].includes(rol)) {
      return res.status(400).json({ message: 'Geçersiz rol.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { rol }, { new: true }).select('-sifre');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// GET /api/admin/ads — list all ads (admin view)
exports.getAllAdsAdmin = async (req, res) => {
  try {
    const ads = await Advertisement.find()
      .populate('owner', 'adSoyad email')
      .sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// DELETE /api/admin/ads/:id — admin can delete any ad
exports.deleteAdAdmin = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: 'İlan bulunamadı.' });
    res.json({ message: 'İlan silindi.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};