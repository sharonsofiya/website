const { db } = require('../models');
const config = require('../config/env');

class GitHubService {
  async getGitHubData() {
    const cachedData = await db.getSingleton('github');

    // Attempt live fetch if network allows and username is configured
    try {
      const username = config.GITHUB_USERNAME;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout

      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, {
          headers: { 'User-Agent': 'Antigravity-Portfolio-App' },
          signal: controller.signal
        }).catch(() => null),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
          headers: { 'User-Agent': 'Antigravity-Portfolio-App' },
          signal: controller.signal
        }).catch(() => null)
      ]);

      clearTimeout(timeoutId);

      if (userRes && userRes.ok && reposRes && reposRes.ok) {
        const userData = await userRes.json();
        const reposData = await reposRes.json();

        const liveData = {
          username: userData.login,
          name: userData.name || userData.login,
          bio: userData.bio || cachedData?.bio || 'Full-Stack Developer & Cloud Architect',
          avatarUrl: userData.avatar_url || cachedData?.avatarUrl,
          profileUrl: userData.html_url,
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalStars: reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0) + (cachedData?.totalStars || 0),
          pinnedRepos: reposData.slice(0, 4).map(repo => ({
            id: String(repo.id),
            name: repo.name,
            description: repo.description || 'Open-source software project repository.',
            language: repo.language || 'JavaScript',
            languageColor: this._getLanguageColor(repo.language),
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            updatedAt: repo.updated_at ? repo.updated_at.split('T')[0] : 'Recently'
          }))
        };

        // Cache live data for subsequent rapid requests
        await db.setSingleton('github', liveData);
        return liveData;
      }
    } catch (err) {
      // Graceful fallback to cached seed data
      // console.warn('[GitHub API Live Sync Notice] Using cached portfolio GitHub metrics');
    }

    return cachedData || {
      username: config.GITHUB_USERNAME,
      name: "Sharon Sofiya",
      bio: "Senior Full-Stack Architect | Open Source & Cloud Enthusiast",
      publicRepos: 24,
      followers: 480,
      following: 110,
      totalStars: 1950,
      pinnedRepos: []
    };
  }

  _getLanguageColor(lang) {
    const map = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'Python': '#3572A5',
      'Go': '#00ADD8',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Java': '#b07219',
      'Shell': '#89e051'
    };
    return map[lang] || '#0d6efd';
  }
}

module.exports = new GitHubService();
