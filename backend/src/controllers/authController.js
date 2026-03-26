const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Helper: send an email via Gmail
async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { adSoyad, email, telefon, sifre } = req.body;

    // 1. University email check
    if (!email.endsWith('@beun.edu.tr')) {
      return res.status(400).json({ message: 'Sadece @beun.edu.tr e-postası kabul edilir.' });
    }

    // 2. Duplicate check
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });
    }

    // 3. Hash password (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(sifre, 10);

    // TODO: fix this, temporarily disabled email sending
    const verifyToken = crypto.randomBytes(32).toString('hex');
    await User.create({ adSoyad, email, telefon, sifre: hashedPassword, verifyToken, isVerified: true});

/*     // 4. Create verify token and save user
    const verifyToken = crypto.randomBytes(32).toString('hex');
    await User.create({ adSoyad, email, telefon, sifre: hashedPassword, verifyToken });

    
    // 5. Send verification email 
    const link = `${process.env.CLIENT_URL}/verify/${verifyToken}`;
    await sendEmail(
      email,
      'Kampüs Platformu - E-posta Doğrulama',
      `<p>Hesabınızı doğrulamak için <a href="${link}">tıklayın</a>.</p>`
    ); */

    res.status(201).json({ message: 'Kayıt başarılı. E-postanızı doğrulayın.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', error: err.message });
  }
};

// GET /api/auth/verify/:token
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verifyToken: req.params.token });
    if (!user) return res.status(400).json({ message: 'Geçersiz token.' });

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.json({ message: 'E-posta doğrulandı. Giriş yapabilirsiniz.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, sifre } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Hatalı e-posta veya şifre.' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'E-postanızı doğrulamadan giriş yapamazsınız.' });
    }

    const match = await bcrypt.compare(sifre, user.sifre);
    if (!match) return res.status(401).json({ message: 'Hatalı e-posta veya şifre.' });

    const token = jwt.sign(
      { userId: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, adSoyad: user.adSoyad, email: user.email, rol: user.rol }
    });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond with the same message to avoid leaking whether an email exists
    const genericMsg = 'Eğer bu e-posta kayıtlıysa, sıfırlama bağlantısı gönderildi.';
    if (!user) return res.json({ message: genericMsg });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour from now
    await user.save();

    const link = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(
      email,
      'Kampüs Platformu - Şifre Sıfırlama',
      `<p>Şifrenizi sıfırlamak için <a href="${link}">tıklayın</a>. Bu bağlantı 1 saat geçerlidir.</p>`
    );

    res.json({ message: genericMsg });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { sifre } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // token must not be expired
    });

    if (!user) return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token.' });

    user.sifre = await bcrypt.hash(sifre, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Şifre başarıyla sıfırlandı. Giriş yapabilirsiniz.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};