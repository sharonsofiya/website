/**
 * Antigravity Dynamic Portfolio - Main Application
 * Connects frontend Bootstrap components dynamically with backend REST APIs.
 * Supports loading states, empty states, error states, and retry buttons.
 */

const App = (() => {
  // State store
  const state = {
    profile: null,
    about: null,
    currentSkillCategory: 'All',
    projectCategory: 'All',
    projectSearchQuery: '',
    projectCurrentPage: 1,
    projectPageLimit: 6,
    projectTotalPages: 1
  };

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Render State Helpers
  function renderLoading(containerId, message = 'Loading content...') {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div class="state-container py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted fw-medium">${escapeHtml(message)}</p>
      </div>
    `;
  }

  function renderEmpty(containerId, message = 'No data available at this time.', icon = 'bi-inbox') {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div class="state-container py-5 text-center">
        <i class="bi ${icon} empty-state-icon text-secondary"></i>
        <h5 class="text-secondary fw-semibold">No Records Found</h5>
        <p class="text-muted small">${escapeHtml(message)}</p>
      </div>
    `;
  }

  function renderError(containerId, message = 'Unable to fetch data from API', onRetry = null) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div class="state-container py-4">
        <div class="alert alert-danger error-state-card shadow-sm p-4 w-100" role="alert">
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-exclamation-triangle-fill fs-3 text-danger me-3"></i>
            <div>
              <h6 class="alert-heading fw-bold mb-1">API Connection Error</h6>
              <div class="small text-danger-emphasis">${escapeHtml(message)}</div>
            </div>
          </div>
          ${onRetry ? `
            <div class="mt-3 pt-2 border-top border-danger-subtle d-flex justify-content-end">
              <button class="btn btn-sm btn-outline-danger retry-action-btn">
                <i class="bi bi-arrow-clockwise me-1"></i> Retry Request
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    if (onRetry) {
      const btn = el.querySelector('.retry-action-btn');
      if (btn) btn.addEventListener('click', onRetry);
    }
  }

  // ==========================================
  // 1. Profile Section & Hero
  // ==========================================
  async function loadProfile() {
    renderLoading('hero-profile-container', 'Loading profile...');
    try {
      const res = await API.getProfile();
      state.profile = res.data;
      renderProfileUI(res.data);
    } catch (err) {
      renderError('hero-profile-container', err.message, loadProfile);
    }
  }

  function renderProfileUI(p) {
    const container = document.getElementById('hero-profile-container');
    if (!container) return;

    // Update Brand Name & Document Title
    const brandName = document.getElementById('nav-brand-name');
    if (brandName) brandName.textContent = p.name;
    document.title = `${p.name} | Dynamic Full-Stack Portfolio`;

    container.innerHTML = `
      <div class="row align-items-center g-5">
        <div class="col-lg-7 order-2 order-lg-1">
          <div class="mb-3">
            <span class="status-badge">
              <span class="status-indicator-dot"></span>
              ${escapeHtml(p.status || 'Available for opportunities')}
            </span>
          </div>
          <h1 class="display-4 fw-bold mb-3">
            Hi, I'm <span class="text-gradient">${escapeHtml(p.name)}</span>
          </h1>
          <h3 class="h4 text-body-secondary fw-semibold mb-4">
            ${escapeHtml(p.headline)}
          </h3>
          <p class="lead text-secondary mb-4" style="max-width: 600px;">
            ${escapeHtml(p.bioSummary)}
          </p>

          <div class="d-flex flex-wrap gap-3 mb-5">
            <a href="#projects" class="btn btn-primary btn-lg px-4 shadow-sm">
              <i class="bi bi-code-square me-2"></i> View Projects
            </a>
            <a href="#contact" class="btn btn-outline-primary btn-lg px-4">
              <i class="bi bi-envelope me-2"></i> Contact Me
            </a>
            <button class="btn btn-outline-secondary btn-lg px-3" data-bs-toggle="modal" data-bs-target="#resumeModal">
              <i class="bi bi-file-earmark-person me-2"></i> Resume
            </button>
          </div>

          <!-- Social Links Pills in Hero -->
          <div id="hero-social-links" class="d-flex flex-wrap gap-2 mb-4"></div>
        </div>

        <div class="col-lg-5 order-1 order-lg-2 text-center">
          <div class="hero-avatar-wrapper mb-4">
            <img src="${p.avatar}" alt="${escapeHtml(p.name)}" class="hero-avatar shadow" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'">
          </div>
          <div class="d-flex align-items-center justify-content-center gap-2 text-muted small">
            <i class="bi bi-geo-alt-fill text-danger"></i>
            <span>${escapeHtml(p.location)}</span>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Counters -->
      <div class="row g-4 mt-4 pt-3">
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-number text-gradient">${p.yearsExperience || 7}+</div>
            <div class="text-muted small fw-medium mt-1">Years Experience</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-number text-gradient">${p.completedProjects || 45}+</div>
            <div class="text-muted small fw-medium mt-1">Projects Delivered</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-number text-gradient">${p.satisfiedClients || 32}+</div>
            <div class="text-muted small fw-medium mt-1">Satisfied Partners</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-number text-gradient">${p.codeCommits || 2800}+</div>
            <div class="text-muted small fw-medium mt-1">Git Commits</div>
          </div>
        </div>
      </div>
    `;

    // Load social links inside hero and contact
    loadSocialLinks();
  }

  // ==========================================
  // 2. Social Links
  // ==========================================
  async function loadSocialLinks() {
    try {
      const res = await API.getSocialLinks();
      const links = res.data || [];
      const heroContainer = document.getElementById('hero-social-links');
      const footerContainer = document.getElementById('footer-social-links');
      const contactInfoContainer = document.getElementById('contact-social-pills');

      const html = links.map(l => `
        <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-secondary rounded-pill px-3" title="${l.displayName}">
          <i class="bi ${l.icon} me-1"></i> ${escapeHtml(l.displayName)}
        </a>
      `).join('');

      if (heroContainer) heroContainer.innerHTML = html;
      if (footerContainer) footerContainer.innerHTML = html;
      if (contactInfoContainer) contactInfoContainer.innerHTML = html;
    } catch (e) {
      console.warn('Could not load social links:', e.message);
    }
  }

  // ==========================================
  // 3. About Section
  // ==========================================
  async function loadAbout() {
    renderLoading('about-content-container', 'Loading about overview...');
    try {
      const res = await API.getAbout();
      state.about = res.data;
      renderAboutUI(res.data);
    } catch (err) {
      renderError('about-content-container', err.message, loadAbout);
    }
  }

  function renderAboutUI(a) {
    const container = document.getElementById('about-content-container');
    if (!container) return;

    container.innerHTML = `
      <div class="row g-5 align-items-center">
        <div class="col-lg-6">
          <h3 class="h2 fw-bold mb-3">${escapeHtml(a.title)}</h3>
          <p class="lead text-primary fw-medium mb-4">${escapeHtml(a.summary)}</p>
          ${(a.paragraphs || []).map(p => `<p class="text-secondary">${escapeHtml(p)}</p>`).join('')}

          <div class="mt-4">
            <h6 class="fw-bold mb-3"><i class="bi bi-stars text-warning me-2"></i>Core Specializations:</h6>
            <div class="d-flex flex-wrap gap-2">
              ${(a.keyHighlights || []).map(k => `
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
                  <i class="bi bi-check2-circle me-1"></i> ${escapeHtml(k)}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border shadow-sm rounded-4 p-4">
            <h5 class="fw-bold mb-3"><i class="bi bi-info-circle-fill text-primary me-2"></i>Quick Facts & Architectural Preferences</h5>
            <div class="table-responsive">
              <table class="table table-borderless align-middle mb-0">
                <tbody>
                  ${(a.fastFacts || []).map(f => `
                    <tr class="border-bottom">
                      <th class="py-3 text-secondary" style="width: 40%;">${escapeHtml(f.label)}</th>
                      <td class="py-3 fw-semibold text-body">${escapeHtml(f.value)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="mt-4 pt-2">
              <h6 class="fw-bold mb-2 text-muted small text-uppercase">Tech Interests & Research:</h6>
              <div class="d-flex flex-wrap gap-1">
                ${(a.interests || []).map(i => `
                  <span class="badge bg-secondary-subtle text-secondary px-2 py-1">${escapeHtml(i)}</span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 4. Skills Section
  // ==========================================
  async function loadSkills(category = null) {
    if (category) state.currentSkillCategory = category;
    renderLoading('skills-grid-container', 'Loading technical proficiencies...');
    try {
      const res = await API.getSkills(state.currentSkillCategory);
      const skills = res.data || [];
      renderSkillsUI(skills);
    } catch (err) {
      renderError('skills-grid-container', err.message, () => loadSkills(state.currentSkillCategory));
    }
  }

  function renderSkillsUI(skills) {
    const container = document.getElementById('skills-grid-container');
    if (!container) return;

    if (!skills || skills.length === 0) {
      renderEmpty('skills-grid-container', `No skills found under '${state.currentSkillCategory}' category.`, 'bi-tools');
      return;
    }

    container.innerHTML = `
      <div class="row g-4">
        ${skills.map(s => `
          <div class="col-md-6 col-lg-4">
            <div class="skill-card h-100 shadow-sm">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="skill-icon-box">
                    <i class="bi ${s.icon || 'bi-code-slash'}"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-0">${escapeHtml(s.name)}</h6>
                    <small class="badge bg-secondary-subtle text-secondary">${escapeHtml(s.category)}</small>
                  </div>
                </div>
                <span class="fw-bold text-primary fs-5">${s.proficiency}%</span>
              </div>
              <div class="progress" role="progressbar" aria-label="${escapeHtml(s.name)}" aria-valuenow="${s.proficiency}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${s.proficiency}%;"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function bindSkillCategoryFilter() {
    const filterPills = document.querySelectorAll('.skill-filter-btn');
    filterPills.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-category') || 'All';
        loadSkills(cat);
      });
    });
  }

  // ==========================================
  // 5. Experience Section (Bootstrap Timeline)
  // ==========================================
  async function loadExperience() {
    renderLoading('experience-timeline-container', 'Loading career timeline...');
    try {
      const res = await API.getExperience();
      const expList = res.data || [];
      renderExperienceUI(expList);
    } catch (err) {
      renderError('experience-timeline-container', err.message, loadExperience);
    }
  }

  function renderExperienceUI(list) {
    const container = document.getElementById('experience-timeline-container');
    if (!container) return;

    if (!list || list.length === 0) {
      renderEmpty('experience-timeline-container', 'No work history records found.', 'bi-briefcase');
      return;
    }

    container.innerHTML = `
      <div class="timeline">
        ${list.map(item => `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                <h4 class="h5 fw-bold mb-0 text-primary">${escapeHtml(item.position)}</h4>
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
                  <i class="bi bi-calendar3 me-1"></i> ${escapeHtml(item.startDate)} &mdash; ${escapeHtml(item.endDate)}
                </span>
              </div>
              <h5 class="h6 fw-semibold text-body mb-3">
                <i class="bi bi-building me-1 text-secondary"></i> ${escapeHtml(item.company)}
              </h5>
              <p class="text-secondary mb-3">${escapeHtml(item.description)}</p>

              ${item.responsibilities && item.responsibilities.length ? `
                <div class="mb-3">
                  <h6 class="small fw-bold text-uppercase text-muted mb-2">Key Responsibilities:</h6>
                  <ul class="mb-0 ps-3 small text-secondary">
                    ${item.responsibilities.map(r => `<li class="mb-1">${escapeHtml(r)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${item.achievements && item.achievements.length ? `
                <div class="mb-3">
                  <h6 class="small fw-bold text-uppercase text-muted mb-2">Impact & Milestones:</h6>
                  <div class="d-flex flex-wrap gap-2">
                    ${item.achievements.map(a => `
                      <span class="badge bg-success-subtle text-success border border-success-subtle p-2">
                        <i class="bi bi-trophy me-1"></i> ${escapeHtml(a)}
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="mt-3 pt-2 border-top">
                <small class="text-muted fw-semibold me-2">Technologies:</small>
                ${(item.technologies || []).map(t => `
                  <span class="badge bg-secondary-subtle text-secondary me-1 mb-1">${escapeHtml(t)}</span>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // 6. Projects Section (Filtering, Search, Modal, Pagination)
  // ==========================================
  async function loadProjects() {
    renderLoading('projects-grid-container', 'Loading portfolio projects...');
    try {
      const res = await API.getProjects({
        category: state.projectCategory,
        search: state.projectSearchQuery,
        page: state.projectCurrentPage,
        limit: state.projectPageLimit
      });
      renderProjectsUI(res.data || [], res.pagination);
    } catch (err) {
      renderError('projects-grid-container', err.message, loadProjects);
    }
  }

  function renderProjectsUI(projects, pagination) {
    const container = document.getElementById('projects-grid-container');
    const paginationContainer = document.getElementById('projects-pagination-container');
    if (!container) return;

    if (!projects || projects.length === 0) {
      renderEmpty('projects-grid-container', 'No projects match your current filter and search criteria.', 'bi-folder-x');
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="row g-4">
        ${projects.map(p => `
          <div class="col-md-6 col-lg-4">
            <div class="portfolio-card shadow-sm">
              <div class="project-card-img-wrap">
                <img src="${p.image}" alt="${escapeHtml(p.title)}" class="project-card-img" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'">
                <span class="badge bg-primary project-category-badge rounded-pill shadow-sm">
                  ${escapeHtml(p.category)}
                </span>
                ${p.featured ? `<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-3 rounded-pill shadow-sm"><i class="bi bi-star-fill me-1"></i> Featured</span>` : ''}
              </div>
              <div class="p-4 d-flex flex-column flex-grow-1">
                <h5 class="fw-bold mb-2 text-truncate" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</h5>
                <p class="text-secondary small mb-3 flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  ${escapeHtml(p.description)}
                </p>

                <div class="d-flex flex-wrap gap-1 mb-4">
                  ${(p.technologies || []).slice(0, 4).map(t => `
                    <span class="badge bg-secondary-subtle text-secondary small">${escapeHtml(t)}</span>
                  `).join('')}
                  ${(p.technologies || []).length > 4 ? `<span class="badge bg-secondary-subtle text-secondary small">+${p.technologies.length - 4}</span>` : ''}
                </div>

                <div class="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                  <button class="btn btn-sm btn-outline-primary view-project-btn" data-id="${p.id}">
                    <i class="bi bi-eye me-1"></i> Details
                  </button>
                  <div class="d-flex gap-2">
                    ${p.githubUrl ? `
                      <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-secondary" title="View Source Code">
                        <i class="bi bi-github"></i>
                      </a>
                    ` : ''}
                    ${p.liveUrl ? `
                      <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" title="Launch Live Demo">
                        <i class="bi bi-box-arrow-up-right"></i>
                      </a>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Bind Details buttons
    container.querySelectorAll('.view-project-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openProjectModal(btn.getAttribute('data-id'));
      });
    });

    // Render Pagination
    renderPaginationUI(pagination);
  }

  function renderPaginationUI(pagination) {
    const container = document.getElementById('projects-pagination-container');
    if (!container) return;

    if (!pagination || pagination.totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    state.projectTotalPages = pagination.totalPages;

    let items = '';
    // Previous Button
    items += `
      <li class="page-item ${!pagination.hasPrev ? 'disabled' : ''}">
        <button class="page-link" data-page="${pagination.page - 1}" aria-label="Previous">&laquo; Prev</button>
      </li>
    `;

    // Numeric Pages
    for (let i = 1; i <= pagination.totalPages; i++) {
      items += `
        <li class="page-item ${i === pagination.page ? 'active' : ''}">
          <button class="page-link" data-page="${i}">${i}</button>
        </li>
      `;
    }

    // Next Button
    items += `
      <li class="page-item ${!pagination.hasNext ? 'disabled' : ''}">
        <button class="page-link" data-page="${pagination.page + 1}" aria-label="Next">Next &raquo;</button>
      </li>
    `;

    container.innerHTML = `<ul class="pagination pagination-md justify-content-center mb-0">${items}</ul>`;

    container.querySelectorAll('.page-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = parseInt(btn.getAttribute('data-page'), 10);
        if (targetPage && targetPage >= 1 && targetPage <= state.projectTotalPages && targetPage !== state.projectCurrentPage) {
          state.projectCurrentPage = targetPage;
          loadProjects();
          document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  async function openProjectModal(id) {
    const modalEl = document.getElementById('projectDetailsModal');
    const modalTitle = document.getElementById('projectModalTitle');
    const modalBody = document.getElementById('projectModalBody');
    const modalLive = document.getElementById('projectModalLiveLink');
    const modalGithub = document.getElementById('projectModalGithubLink');

    modalTitle.textContent = 'Loading project...';
    modalBody.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Retrieving project details...</p>
      </div>
    `;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();

    try {
      const res = await API.getProjectById(id);
      const p = res.data;

      modalTitle.textContent = p.title;
      modalBody.innerHTML = `
        <div class="mb-4">
          <img src="${p.image}" alt="${escapeHtml(p.title)}" class="img-fluid rounded-3 shadow-sm w-100" style="max-height: 340px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'">
        </div>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge bg-primary fs-6">${escapeHtml(p.category)}</span>
          ${p.featured ? '<span class="badge bg-warning text-dark fs-6"><i class="bi bi-star-fill me-1"></i> Featured</span>' : ''}
          <span class="badge bg-secondary-subtle text-secondary fs-6"><i class="bi bi-calendar-event me-1"></i> ${p.createdAt?.split('T')[0] || '2024'}</span>
        </div>
        <p class="lead fs-6 text-body">${escapeHtml(p.description)}</p>

        ${p.features && p.features.length ? `
          <div class="my-4">
            <h6 class="fw-bold mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Key Architectural Features:</h6>
            <ul class="list-group list-group-flush">
              ${p.features.map(f => `<li class="list-group-item bg-transparent px-0 py-2"><i class="bi bi-arrow-right text-primary me-2"></i>${escapeHtml(f)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="mt-4 pt-2 border-top">
          <h6 class="fw-bold mb-2">Technologies Used:</h6>
          <div class="d-flex flex-wrap gap-2">
            ${(p.technologies || []).map(t => `<span class="badge bg-secondary p-2">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      `;

      if (modalLive) {
        if (p.liveUrl) {
          modalLive.href = p.liveUrl;
          modalLive.classList.remove('d-none');
        } else {
          modalLive.classList.add('d-none');
        }
      }

      if (modalGithub) {
        if (p.githubUrl) {
          modalGithub.href = p.githubUrl;
          modalGithub.classList.remove('d-none');
        } else {
          modalGithub.classList.add('d-none');
        }
      }
    } catch (err) {
      modalBody.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          Failed to load project details: ${escapeHtml(err.message)}
        </div>
      `;
    }
  }

  function bindProjectFiltersAndSearch() {
    // Category pills: All, Web, Mobile, AI, Full Stack
    const filterPills = document.querySelectorAll('.project-filter-btn');
    filterPills.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.projectCategory = btn.getAttribute('data-category') || 'All';
        state.projectCurrentPage = 1;
        loadProjects();
      });
    });

    // Search bar
    const searchInput = document.getElementById('project-search-input');
    const searchClearBtn = document.getElementById('project-search-clear-btn');

    let debounceTimer = null;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        if (searchClearBtn) {
          searchClearBtn.classList.toggle('d-none', query.length === 0);
        }
        debounceTimer = setTimeout(() => {
          state.projectSearchQuery = query;
          state.projectCurrentPage = 1;
          loadProjects();
        }, 300);
      });
    }

    if (searchClearBtn && searchInput) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchClearBtn.classList.add('d-none');
        state.projectSearchQuery = '';
        state.projectCurrentPage = 1;
        loadProjects();
      });
    }
  }

  // ==========================================
  // 7. Education Section
  // ==========================================
  async function loadEducation() {
    renderLoading('education-container', 'Loading education credentials...');
    try {
      const res = await API.getEducation();
      renderEducationUI(res.data || []);
    } catch (err) {
      renderError('education-container', err.message, loadEducation);
    }
  }

  function renderEducationUI(list) {
    const container = document.getElementById('education-container');
    if (!container) return;

    if (!list || list.length === 0) {
      renderEmpty('education-container', 'No education records available.', 'bi-mortarboard');
      return;
    }

    container.innerHTML = `
      <div class="row g-4">
        ${list.map(edu => `
          <div class="col-lg-6">
            <div class="portfolio-card p-4 shadow-sm h-100">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
                  <i class="bi bi-calendar3 me-1"></i> ${escapeHtml(edu.startDate)} &mdash; ${escapeHtml(edu.endDate)}
                </span>
                ${edu.grade ? `<span class="badge bg-success-subtle text-success border border-success-subtle p-2">${escapeHtml(edu.grade)}</span>` : ''}
              </div>
              <h4 class="h5 fw-bold mb-1">${escapeHtml(edu.degree)}</h4>
              <h5 class="h6 text-primary fw-semibold mb-3">
                <i class="bi bi-bank2 me-1"></i> ${escapeHtml(edu.institution)}
              </h5>
              <p class="text-secondary small mb-3">${escapeHtml(edu.description)}</p>

              ${edu.activities && edu.activities.length ? `
                <div class="mt-auto pt-3 border-top">
                  <h6 class="small fw-bold text-muted text-uppercase mb-2">Key Highlights & Honors:</h6>
                  <ul class="mb-0 ps-3 small text-secondary">
                    ${edu.activities.map(a => `<li class="mb-1">${escapeHtml(a)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // 8. Certifications Section
  // ==========================================
  async function loadCertifications() {
    renderLoading('certifications-container', 'Loading certifications & credentials...');
    try {
      const res = await API.getCertifications();
      renderCertificationsUI(res.data || []);
    } catch (err) {
      renderError('certifications-container', err.message, loadCertifications);
    }
  }

  function renderCertificationsUI(list) {
    const container = document.getElementById('certifications-container');
    if (!container) return;

    if (!list || list.length === 0) {
      renderEmpty('certifications-container', 'No certifications found.', 'bi-patch-check');
      return;
    }

    container.innerHTML = `
      <div class="row g-4">
        ${list.map(cert => `
          <div class="col-md-6 col-lg-3">
            <div class="portfolio-card p-4 shadow-sm text-center h-100">
              <div class="mx-auto mb-3" style="width: 56px; height: 56px; border-radius: 50%; background: rgba(13, 110, 253, 0.12); display: flex; align-items: center; justify-content: center;">
                <i class="bi ${cert.badgeIcon || 'bi-patch-check-fill'} fs-3 text-primary"></i>
              </div>
              <h6 class="fw-bold mb-2">${escapeHtml(cert.name)}</h6>
              <div class="text-muted small fw-medium mb-3">${escapeHtml(cert.issuer)}</div>
              <div class="mb-3">
                <span class="badge bg-secondary-subtle text-secondary small">Issued: ${escapeHtml(cert.issueDate)}</span>
              </div>
              ${cert.credentialId ? `<div class="small text-muted mb-3 font-monospace">${escapeHtml(cert.credentialId)}</div>` : ''}
              ${cert.credentialUrl ? `
                <div class="mt-auto pt-2">
                  <a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-primary rounded-pill w-100">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Verify Credential
                  </a>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // 9. Achievements Section
  // ==========================================
  async function loadAchievements() {
    renderLoading('achievements-container', 'Loading awards & achievements...');
    try {
      const res = await API.getAchievements();
      renderAchievementsUI(res.data || []);
    } catch (err) {
      renderError('achievements-container', err.message, loadAchievements);
    }
  }

  function renderAchievementsUI(list) {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    if (!list || list.length === 0) {
      renderEmpty('achievements-container', 'No achievements found.', 'bi-trophy');
      return;
    }

    container.innerHTML = `
      <div class="row g-4">
        ${list.map(ach => `
          <div class="col-md-6 col-lg-3">
            <div class="portfolio-card p-4 shadow-sm h-100 d-flex flex-column">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255, 193, 7, 0.15); display: flex; align-items: center; justify-content: center;">
                  <i class="bi ${ach.icon || 'bi-trophy-fill'} fs-4 text-warning"></i>
                </div>
                <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 rounded-pill">
                  ${escapeHtml(ach.year)}
                </span>
              </div>
              <span class="badge bg-secondary-subtle text-secondary align-self-start mb-2">${escapeHtml(ach.category)}</span>
              <h6 class="fw-bold mb-2">${escapeHtml(ach.title)}</h6>
              <p class="text-secondary small mb-3 flex-grow-1">${escapeHtml(ach.description)}</p>
              ${ach.link && ach.link !== '#' ? `
                <div class="mt-auto pt-2 border-top">
                  <a href="${ach.link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-link p-0 text-decoration-none">
                    Read Recognition <i class="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // 10. GitHub Telemetry & Repos Section
  // ==========================================
  async function loadGitHub() {
    renderLoading('github-container', 'Syncing GitHub telemetry and repositories...');
    try {
      const res = await API.getGitHub();
      renderGitHubUI(res.data);
    } catch (err) {
      renderError('github-container', err.message, loadGitHub);
    }
  }

  function renderGitHubUI(gh) {
    const container = document.getElementById('github-container');
    if (!container) return;

    container.innerHTML = `
      <!-- GitHub Stats Bar -->
      <div class="card border rounded-4 shadow-sm p-4 mb-4">
        <div class="row align-items-center g-4">
          <div class="col-md-4 text-center text-md-start">
            <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
              <i class="bi bi-github display-4 text-primary"></i>
              <div>
                <h5 class="fw-bold mb-0">@${escapeHtml(gh.username)}</h5>
                <small class="text-muted">${escapeHtml(gh.bio || 'Open Source Contributor')}</small>
              </div>
            </div>
          </div>
          <div class="col-md-5">
            <div class="d-flex justify-content-around text-center">
              <div>
                <div class="h4 fw-bold text-gradient mb-0">${gh.publicRepos || 0}</div>
                <small class="text-muted">Public Repos</small>
              </div>
              <div>
                <div class="h4 fw-bold text-gradient mb-0">${gh.totalStars || 0}</div>
                <small class="text-muted">Total Stars</small>
              </div>
              <div>
                <div class="h4 fw-bold text-gradient mb-0">${gh.followers || 0}</div>
                <small class="text-muted">Followers</small>
              </div>
            </div>
          </div>
          <div class="col-md-3 text-center text-md-end">
            <a href="${gh.profileUrl || `https://github.com/${gh.username}`}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary px-3">
              <i class="bi bi-box-arrow-up-right me-1"></i> View Profile
            </a>
          </div>
        </div>
      </div>

      <!-- Pinned Repositories Grid -->
      <div class="row g-4">
        ${(gh.pinnedRepos || []).map(r => `
          <div class="col-md-6">
            <div class="repo-card shadow-sm">
              <div class="d-flex align-items-start justify-content-between mb-2">
                <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="fw-bold fs-5 text-decoration-none text-primary d-flex align-items-center gap-2">
                  <i class="bi bi-journal-code"></i> ${escapeHtml(r.name)}
                </a>
                <span class="badge bg-secondary-subtle text-secondary small">Public</span>
              </div>
              <p class="text-secondary small mb-3 flex-grow-1">${escapeHtml(r.description)}</p>
              <div class="d-flex align-items-center justify-content-between pt-2 border-top text-muted small">
                <div class="d-flex align-items-center">
                  <span class="lang-color-dot" style="background-color: ${r.languageColor || '#0d6efd'};"></span>
                  <span>${escapeHtml(r.language)}</span>
                </div>
                <div class="d-flex gap-3">
                  <span title="Stars"><i class="bi bi-star-fill text-warning me-1"></i>${r.stars}</span>
                  <span title="Forks"><i class="bi bi-diagram-2 me-1"></i>${r.forks}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // 11. Contact Form with Robust Bootstrap Feedback
  // ==========================================
  function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = document.getElementById('contact-submit-btn');
      const alertContainer = document.getElementById('contact-alert-container');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // Clear previous alerts
      alertContainer.innerHTML = '';

      // Client-side quick check
      if (!name || !email || !subject || !message) {
        showContactAlert(
          'Validation Error',
          'Please complete all required fields before submitting your message.',
          'warning'
        );
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending Message...
      `;

      try {
        const response = await API.submitContact({ name, email, subject, message });

        showContactAlert(
          'Success!',
          response.message || 'Thank you for reaching out! Your message was sent successfully. I will get back to you shortly.',
          'success'
        );

        // Reset form
        form.reset();

        // Trigger toast
        if (window.AdminCMS && window.AdminCMS.showToast) {
          window.AdminCMS.showToast('Message sent successfully!', 'success');
        }
      } catch (err) {
        if (err.isNetworkError) {
          showContactAlert(
            'Network Error',
            'Could not establish connection to the backend server. Please verify your internet or server status and try again.',
            'danger'
          );
        } else if (err.status === 400 && err.data?.validationErrors) {
          const errorsList = err.data.validationErrors.map(e => `<li>${escapeHtml(e.message)}</li>`).join('');
          showContactAlert(
            'Validation Errors',
            `<ul class="mb-0 ps-3 mt-1">${errorsList}</ul>`,
            'warning'
          );
        } else if (err.status === 429) {
          showContactAlert(
            'Rate Limit Exceeded',
            'You have sent multiple messages recently. Please wait a few minutes before trying again.',
            'warning'
          );
        } else {
          showContactAlert(
            'Server Error',
            err.data?.message || err.message || 'An error occurred while processing your message. Please try again later.',
            'danger'
          );
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  function showContactAlert(title, message, type = 'info') {
    const alertContainer = document.getElementById('contact-alert-container');
    if (!alertContainer) return;

    const iconMap = {
      success: 'bi-check-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      danger: 'bi-x-circle-fill',
      info: 'bi-info-circle-fill'
    };

    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
        <div class="d-flex align-items-start gap-2">
          <i class="bi ${iconMap[type] || 'bi-info-circle-fill'} fs-5"></i>
          <div>
            <strong>${escapeHtml(title)}:</strong> ${message}
          </div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ==========================================
  // 12. Back To Top Button & Scrollspy
  // ==========================================
  function setupScrollEvents() {
    const backToTopBtn = document.getElementById('btn-back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // Master Initialization
  // ==========================================
  function init() {
    loadProfile();
    loadAbout();
    bindSkillCategoryFilter();
    loadSkills();
    loadExperience();
    bindProjectFiltersAndSearch();
    loadProjects();
    loadEducation();
    loadCertifications();
    loadAchievements();
    loadGitHub();
    setupContactForm();
    setupScrollEvents();
  }

  return {
    init,
    refreshProjects: loadProjects,
    refreshSkills: () => loadSkills(state.currentSkillCategory),
    refreshExperience: loadExperience,
    refreshProfile: loadProfile
  };
})();

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
