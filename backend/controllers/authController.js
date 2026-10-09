const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async verify(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }
      const result = await authService.verifyToken(token);
      if (!result.valid) {
        return res.status(401).json({ success: false, message: result.message });
      }
      res.status(200).json({ success: true, user: result.user });
    } catch (err) {
      next(err);
    }
  }

  async resetData(req, res, next) {
    try {
      const result = await authService.resetData();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
