const {Router} = require('express');

const AdminAuthMiddleware = require('../../middlewares/admin-auth.middleware');
const StatsController = require('../../controllers/stats.controller');

const router = Router();

router.get(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    StatsController.getStats,
);

module.exports = router;
