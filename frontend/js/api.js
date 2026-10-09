/**
 * Portfolio API Client Module
 * Communicates dynamically with Express REST API endpoints
 */

const API = (() => {
  const BASE_URL = '/api';

  function getAuthToken() {
    return sessionStorage.getItem('admin_token') || null;
  }

  function getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: getHeaders(options.headers),
      ...options
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP Error ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (!err.status) {
        // Network or connection failure
        err.isNetworkError = true;
        err.message = 'Unable to connect to the portfolio server. Please check your network connection.';
      }
      throw err;
    }
  }

  return {
    // Profile & About
    getProfile: () => request('/profile'),
    updateProfile: (data) => request('/profile', { method: 'PUT', body: data }),
    getAbout: () => request('/about'),
    updateAbout: (data) => request('/about', { method: 'PUT', body: data }),

    // Skills
    getSkills: (category = null) => {
      const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      return request(`/skills${query}`);
    },
    getSkillById: (id) => request(`/skills/${id}`),
    createSkill: (data) => request('/skills', { method: 'POST', body: data }),
    updateSkill: (id, data) => request(`/skills/${id}`, { method: 'PUT', body: data }),
    deleteSkill: (id) => request(`/skills/${id}`, { method: 'DELETE' }),

    // Experience
    getExperience: () => request('/experience'),
    getExperienceById: (id) => request(`/experience/${id}`),
    createExperience: (data) => request('/experience', { method: 'POST', body: data }),
    updateExperience: (id, data) => request(`/experience/${id}`, { method: 'PUT', body: data }),
    deleteExperience: (id) => request(`/experience/${id}`, { method: 'DELETE' }),

    // Projects
    getProjects: (params = {}) => {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/projects${queryString}`);
    },
    getProjectById: (id) => request(`/projects/${id}`),
    createProject: (data) => request('/projects', { method: 'POST', body: data }),
    updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: data }),
    deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

    // Education
    getEducation: () => request('/education'),
    createEducation: (data) => request('/education', { method: 'POST', body: data }),
    updateEducation: (id, data) => request(`/education/${id}`, { method: 'PUT', body: data }),
    deleteEducation: (id) => request(`/education/${id}`, { method: 'DELETE' }),

    // Certifications
    getCertifications: () => request('/certifications'),
    createCertification: (data) => request('/certifications', { method: 'POST', body: data }),
    updateCertification: (id, data) => request(`/certifications/${id}`, { method: 'PUT', body: data }),
    deleteCertification: (id) => request(`/certifications/${id}`, { method: 'DELETE' }),

    // Achievements
    getAchievements: () => request('/achievements'),
    createAchievement: (data) => request('/achievements', { method: 'POST', body: data }),
    updateAchievement: (id, data) => request(`/achievements/${id}`, { method: 'PUT', body: data }),
    deleteAchievement: (id) => request(`/achievements/${id}`, { method: 'DELETE' }),

    // Social Links & GitHub
    getSocialLinks: () => request('/social-links'),
    getGitHub: () => request('/github'),

    // Contact
    submitContact: (data) => request('/contact', { method: 'POST', body: data }),
    getContactMessages: () => request('/contact'),
    markMessageRead: (id) => request(`/contact/${id}/read`, { method: 'PATCH' }),
    deleteContactMessage: (id) => request(`/contact/${id}`, { method: 'DELETE' }),

    // Auth
    login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
    verifyToken: () => request('/auth/verify'),
    resetData: () => request('/auth/reset', { method: 'POST' })
  };
})();
