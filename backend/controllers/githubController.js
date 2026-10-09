const githubService = require('../services/githubService');

class GitHubController {
  async getGitHubData(req, res, next) {
    try {
      const data = await githubService.getGitHubData();
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GitHubController();
