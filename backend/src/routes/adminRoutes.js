const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const {
  getAllUsers, deleteUser, updateUserRole,
  getAllAdsAdmin, deleteAdAdmin,
} = require('../controllers/adminController');

// All admin routes require both auth + admin middleware
router.use(auth, admin);

router.get('/users',            getAllUsers);
router.delete('/users/:id',     deleteUser);
router.patch('/users/:id/role', updateUserRole);

router.get('/ads',              getAllAdsAdmin);
router.delete('/ads/:id',       deleteAdAdmin);

module.exports = router;