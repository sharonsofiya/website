/**
 * Admin & Content Management System (CMS) Module
 * Handles authentication, CRUD operations for Projects, Skills, and Experience,
 * and Contact Messages inspection without code modification.
 */

const AdminCMS = (() => {
  let currentUser = null;
  let adminModalInstance = null;
  let loginModalInstance = null;

  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'text-bg-success' : type === 'danger' ? 'text-bg-danger' : 'text-bg-primary';
    const icon = type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';

    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi ${icon} fs-5"></i>
            <div>${message}</div>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
    bsToast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }

  async function checkAuth() {
    const token = sessionStorage.getItem('admin_token');
    const adminNavBtn = document.getElementById('admin-nav-btn');
    if (!token) {
      currentUser = null;
      if (adminNavBtn) {
        adminNavBtn.innerHTML = '<i class="bi bi-shield-lock me-1"></i> Admin Login';
        adminNavBtn.classList.remove('btn-success');
        adminNavBtn.classList.add('btn-outline-primary');
      }
      return false;
    }

    try {
      const res = await API.verifyToken();
      currentUser = res.user;
      if (adminNavBtn) {
        adminNavBtn.innerHTML = '<i class="bi bi-speedometer2 me-1"></i> Admin CMS';
        adminNavBtn.classList.remove('btn-outline-primary');
        adminNavBtn.classList.add('btn-success');
      }
      return true;
    } catch (err) {
      sessionStorage.removeItem('admin_token');
      currentUser = null;
      if (adminNavBtn) {
        adminNavBtn.innerHTML = '<i class="bi bi-shield-lock me-1"></i> Admin Login';
        adminNavBtn.classList.remove('btn-success');
        adminNavBtn.classList.add('btn-outline-primary');
      }
      return false;
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username-input').value.trim();
    const password = document.getElementById('admin-password-input').value.trim();
    const alertBox = document.getElementById('admin-login-alert');
    const submitBtn = document.getElementById('admin-login-submit-btn');

    alertBox.classList.add('d-none');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';

    try {
      const res = await API.login(username, password);
      sessionStorage.setItem('admin_token', res.token);
      currentUser = res.user;
      showToast('Admin logged in successfully!');

      if (loginModalInstance) loginModalInstance.hide();
      await checkAuth();
      openAdminPanel();
    } catch (err) {
      alertBox.textContent = err.data?.message || err.message || 'Login failed';
      alertBox.classList.remove('d-none');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> Login';
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_token');
    currentUser = null;
    checkAuth();
    if (adminModalInstance) adminModalInstance.hide();
    showToast('Admin logged out successfully', 'info');
  }

  function openAdminPanel() {
    loadAdminProjects();
    loadAdminSkills();
    loadAdminExperience();
    loadAdminMessages();

    const modalEl = document.getElementById('adminCmsModal');
    if (!adminModalInstance) {
      adminModalInstance = new bootstrap.Modal(modalEl);
    }
    adminModalInstance.show();
  }

  // --- Projects Management ---
  async function loadAdminProjects() {
    const container = document.getElementById('admin-projects-list');
    container.innerHTML = '<tr><td colspan="5" class="text-center py-4"><span class="spinner-border spinner-border-sm text-primary me-2"></span>Loading projects...</td></tr>';
    try {
      const res = await API.getProjects({ limit: 50 });
      const projects = res.data || [];
      if (projects.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No projects found.</td></tr>';
        return;
      }
      container.innerHTML = projects.map(p => `
        <tr>
          <td><strong class="d-block">${escapeHtml(p.title)}</strong><small class="text-muted">${p.id}</small></td>
          <td><span class="badge bg-secondary">${escapeHtml(p.category)}</span></td>
          <td>${p.featured ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-dark">No</span>'}</td>
          <td><small class="text-muted">${p.createdAt?.split('T')[0] || ''}</small></td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary me-1 edit-project-btn" data-id="${p.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-sm btn-outline-danger delete-project-btn" data-id="${p.id}" title="Delete"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `).join('');

      container.querySelectorAll('.edit-project-btn').forEach(btn => {
        btn.addEventListener('click', () => editProjectPrompt(btn.dataset.id));
      });
      container.querySelectorAll('.delete-project-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteProjectPrompt(btn.dataset.id));
      });
    } catch (err) {
      container.innerHTML = `<tr><td colspan="5" class="text-danger py-3 text-center">Error: ${err.message}</td></tr>`;
    }
  }

  async function openNewProjectModal() {
    document.getElementById('project-form-id').value = '';
    document.getElementById('project-form-title').value = '';
    document.getElementById('project-form-desc').value = '';
    document.getElementById('project-form-category').value = 'Web';
    document.getElementById('project-form-tech').value = '';
    document.getElementById('project-form-image').value = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
    document.getElementById('project-form-github').value = 'https://github.com';
    document.getElementById('project-form-live').value = 'https://example.com';
    document.getElementById('project-form-features').value = '';
    document.getElementById('project-form-featured').checked = false;

    document.getElementById('projectEditorModalTitle').textContent = 'Add New Project';
    const editorModal = new bootstrap.Modal(document.getElementById('projectEditorModal'));
    editorModal.show();
  }

  async function editProjectPrompt(id) {
    try {
      const res = await API.getProjectById(id);
      const p = res.data;
      document.getElementById('project-form-id').value = p.id;
      document.getElementById('project-form-title').value = p.title;
      document.getElementById('project-form-desc').value = p.description;
      document.getElementById('project-form-category').value = p.category;
      document.getElementById('project-form-tech').value = (p.technologies || []).join(', ');
      document.getElementById('project-form-image').value = p.image || '';
      document.getElementById('project-form-github').value = p.githubUrl || '';
      document.getElementById('project-form-live').value = p.liveUrl || '';
      document.getElementById('project-form-features').value = (p.features || []).join('\n');
      document.getElementById('project-form-featured').checked = Boolean(p.featured);

      document.getElementById('projectEditorModalTitle').textContent = `Edit Project: ${p.title}`;
      const editorModal = new bootstrap.Modal(document.getElementById('projectEditorModal'));
      editorModal.show();
    } catch (err) {
      showToast('Error loading project details: ' + err.message, 'danger');
    }
  }

  async function saveProjectForm(e) {
    e.preventDefault();
    const id = document.getElementById('project-form-id').value;
    const data = {
      title: document.getElementById('project-form-title').value.trim(),
      description: document.getElementById('project-form-desc').value.trim(),
      category: document.getElementById('project-form-category').value,
      technologies: document.getElementById('project-form-tech').value.split(',').map(s => s.trim()).filter(Boolean),
      image: document.getElementById('project-form-image').value.trim(),
      githubUrl: document.getElementById('project-form-github').value.trim(),
      liveUrl: document.getElementById('project-form-live').value.trim(),
      features: document.getElementById('project-form-features').value.split('\n').map(s => s.trim()).filter(Boolean),
      featured: document.getElementById('project-form-featured').checked
    };

    const submitBtn = document.getElementById('project-form-submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

    try {
      if (id) {
        await API.updateProject(id, data);
        showToast('Project updated successfully!');
      } else {
        await API.createProject(data);
        showToast('New project created successfully!');
      }
      bootstrap.Modal.getInstance(document.getElementById('projectEditorModal')).hide();
      loadAdminProjects();
      if (window.App && window.App.refreshProjects) window.App.refreshProjects();
    } catch (err) {
      showToast('Failed to save project: ' + (err.data?.message || err.message), 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-check2 me-1"></i> Save Project';
    }
  }

  async function deleteProjectPrompt(id) {
    if (!confirm(`Are you sure you want to permanently delete project '${id}'?`)) return;
    try {
      await API.deleteProject(id);
      showToast('Project deleted successfully');
      loadAdminProjects();
      if (window.App && window.App.refreshProjects) window.App.refreshProjects();
    } catch (err) {
      showToast('Failed to delete project: ' + err.message, 'danger');
    }
  }

  // --- Skills Management ---
  async function loadAdminSkills() {
    const container = document.getElementById('admin-skills-list');
    container.innerHTML = '<tr><td colspan="5" class="text-center py-4"><span class="spinner-border spinner-border-sm text-primary me-2"></span>Loading skills...</td></tr>';
    try {
      const res = await API.getSkills();
      const skills = res.data || [];
      container.innerHTML = skills.map(s => `
        <tr>
          <td><i class="bi ${s.icon || 'bi-gear-fill'} me-2 text-primary"></i>${escapeHtml(s.name)}</td>
          <td><span class="badge bg-secondary">${escapeHtml(s.category)}</span></td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="progress flex-grow-1" style="height: 6px;">
                <div class="progress-bar" style="width: ${s.proficiency}%;"></div>
              </div>
              <small>${s.proficiency}%</small>
            </div>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger delete-skill-btn" data-id="${s.id}"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `).join('');

      container.querySelectorAll('.delete-skill-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteSkillPrompt(btn.dataset.id));
      });
    } catch (err) {
      container.innerHTML = `<tr><td colspan="5" class="text-danger py-3 text-center">Error: ${err.message}</td></tr>`;
    }
  }

  async function handleAddSkill(e) {
    e.preventDefault();
    const name = document.getElementById('skill-add-name').value.trim();
    const category = document.getElementById('skill-add-category').value;
    const proficiency = parseInt(document.getElementById('skill-add-proficiency').value, 10);
    const icon = document.getElementById('skill-add-icon').value.trim() || 'bi-gear-fill';

    try {
      await API.createSkill({ name, category, proficiency, icon });
      showToast('Skill added successfully!');
      document.getElementById('skill-add-name').value = '';
      loadAdminSkills();
      if (window.App && window.App.refreshSkills) window.App.refreshSkills();
    } catch (err) {
      showToast('Failed to add skill: ' + err.message, 'danger');
    }
  }

  async function deleteSkillPrompt(id) {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await API.deleteSkill(id);
      showToast('Skill deleted');
      loadAdminSkills();
      if (window.App && window.App.refreshSkills) window.App.refreshSkills();
    } catch (err) {
      showToast('Failed to delete skill: ' + err.message, 'danger');
    }
  }

  // --- Experience Management ---
  async function loadAdminExperience() {
    const container = document.getElementById('admin-experience-list');
    container.innerHTML = '<tr><td colspan="4" class="text-center py-4"><span class="spinner-border spinner-border-sm text-primary me-2"></span>Loading experience...</td></tr>';
    try {
      const res = await API.getExperience();
      const list = res.data || [];
      container.innerHTML = list.map(e => `
        <tr>
          <td><strong>${escapeHtml(e.company)}</strong></td>
          <td>${escapeHtml(e.position)}</td>
          <td><small class="badge bg-secondary">${escapeHtml(e.startDate)} - ${escapeHtml(e.endDate)}</small></td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger delete-exp-btn" data-id="${e.id}"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `).join('');

      container.querySelectorAll('.delete-exp-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteExpPrompt(btn.dataset.id));
      });
    } catch (err) {
      container.innerHTML = `<tr><td colspan="4" class="text-danger py-3 text-center">Error: ${err.message}</td></tr>`;
    }
  }

  async function deleteExpPrompt(id) {
    if (!confirm('Are you sure you want to delete this experience entry?')) return;
    try {
      await API.deleteExperience(id);
      showToast('Experience deleted');
      loadAdminExperience();
      if (window.App && window.App.refreshExperience) window.App.refreshExperience();
    } catch (err) {
      showToast('Failed to delete experience: ' + err.message, 'danger');
    }
  }

  // --- Messages Inbox ---
  async function loadAdminMessages() {
    const container = document.getElementById('admin-messages-list');
    container.innerHTML = '<div class="text-center py-4"><span class="spinner-border spinner-border-sm text-primary me-2"></span>Loading messages...</div>';
    try {
      const res = await API.getContactMessages();
      const list = res.data || [];
      if (list.length === 0) {
        container.innerHTML = '<div class="text-muted text-center py-4">No contact inquiries received yet.</div>';
        return;
      }

      container.innerHTML = list.map(m => `
        <div class="card mb-3 border ${m.read ? 'bg-body-tertiary' : 'border-primary'}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="mb-0 fw-bold">${escapeHtml(m.name)} <small class="text-muted fw-normal">&lt;${escapeHtml(m.email)}&gt;</small></h6>
              <div>
                ${!m.read ? '<span class="badge bg-primary me-2">Unread</span>' : ''}
                <small class="text-muted">${new Date(m.createdAt).toLocaleString()}</small>
              </div>
            </div>
            <div class="fw-semibold text-primary mb-1">${escapeHtml(m.subject)}</div>
            <p class="mb-2 text-body">${escapeHtml(m.message)}</p>
            <div class="d-flex justify-content-end gap-2">
              ${!m.read ? `<button class="btn btn-sm btn-outline-success mark-read-btn" data-id="${m.id}"><i class="bi bi-check2"></i> Mark Read</button>` : ''}
              <button class="btn btn-sm btn-outline-danger delete-msg-btn" data-id="${m.id}"><i class="bi bi-trash"></i> Delete</button>
            </div>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.mark-read-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          await API.markMessageRead(btn.dataset.id);
          loadAdminMessages();
        });
      });
      container.querySelectorAll('.delete-msg-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('Delete this message?')) {
            await API.deleteContactMessage(btn.dataset.id);
            loadAdminMessages();
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="text-danger py-3 text-center">Error: ${err.message}</div>`;
    }
  }

  async function handleResetData() {
    if (!confirm('WARNING: Are you sure you want to reset all portfolio records back to initial default seed values?')) return;
    try {
      await API.resetData();
      showToast('Portfolio database reset to seed values!');
      openAdminPanel();
      if (window.App && window.App.init) window.App.init();
    } catch (err) {
      showToast('Reset failed: ' + err.message, 'danger');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function init() {
    checkAuth();

    // Bind Admin Nav button
    const adminNavBtn = document.getElementById('admin-nav-btn');
    if (adminNavBtn) {
      adminNavBtn.addEventListener('click', () => {
        if (currentUser) {
          openAdminPanel();
        } else {
          const modalEl = document.getElementById('adminLoginModal');
          loginModalInstance = new bootstrap.Modal(modalEl);
          loginModalInstance.show();
        }
      });
    }

    // Bind Forms
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const newProjectBtn = document.getElementById('admin-new-project-btn');
    if (newProjectBtn) newProjectBtn.addEventListener('click', openNewProjectModal);

    const projectForm = document.getElementById('project-editor-form');
    if (projectForm) projectForm.addEventListener('submit', saveProjectForm);

    const addSkillForm = document.getElementById('admin-add-skill-form');
    if (addSkillForm) addSkillForm.addEventListener('submit', handleAddSkill);

    const resetBtn = document.getElementById('admin-reset-db-btn');
    if (resetBtn) resetBtn.addEventListener('click', handleResetData);
  }

  return {
    init,
    showToast,
    openAdminPanel,
    checkAuth
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  AdminCMS.init();
});
