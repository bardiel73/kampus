const Advertisement = require('../models/Advertisement');

// GET /api/ads
exports.getAllAds = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { title:       { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    const ads = await Advertisement.find(query)
      .populate('owner', 'adSoyad email telefon')
      .sort({ createdAt: -1 });

    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// GET /api/ads/:id
exports.getAdById = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id)
      .populate('owner', 'adSoyad email telefon');
    if (!ad) return res.status(404).json({ message: 'İlan bulunamadı.' });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// POST /api/ads
exports.createAd = async (req, res) => {
  try {
    const { title, description, category, price, image } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Başlık, açıklama ve kategori zorunludur.' });
    }

    const ad = await Advertisement.create({
      title, description, category,
      price: price || 0,
      image,
      owner: req.user.userId, // injected by authMiddleware
    });

    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// PUT /api/ads/:id
exports.updateAd = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'İlan bulunamadı.' });

    const isOwner = ad.owner.toString() === req.user.userId;
    const isAdmin = req.user.rol === 'yonetici';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Yetkisiz işlem.' });
    }

    const updated = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// DELETE /api/ads/:id
exports.deleteAd = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'İlan bulunamadı.' });

    const isOwner = ad.owner.toString() === req.user.userId;
    const isAdmin = req.user.rol === 'yonetici';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Yetkisiz işlem.' });
    }

    await ad.deleteOne();
    res.json({ message: 'İlan silindi.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};