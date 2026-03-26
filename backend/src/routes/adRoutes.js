const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../upload');
const {
  getAllAds, getAdById, createAd, updateAd, deleteAd
} = require('../controllers/adController');

router.get('/',       getAllAds);
router.get('/:id',    getAdById);
router.post('/',      auth, createAd);
router.put('/:id',    auth, updateAd);
router.delete('/:id', auth, deleteAd);

// POST /api/ads/upload — upload an image and return its URL
router.post('/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Dosya bulunamadı.' });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;