const app = require('./server');
const http = require('http');

let server;
const PORT = 5055;

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Integration Tests...');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  server = app.listen(PORT, async () => {
    try {
      // 1. Health check
      const health = await request('/api/health');
      assert(health.status === 200 && health.data.status === 'healthy', 'GET /api/health returns healthy');

      // 2. Profile
      const profile = await request('/api/profile');
      assert(profile.status === 200 && profile.data.data.name === 'Sharon Sofiya', 'GET /api/profile returns developer details');

      // 3. About
      const about = await request('/api/about');
      assert(about.status === 200 && Array.isArray(about.data.data.paragraphs), 'GET /api/about returns paragraphs');

      // 4. Skills
      const skills = await request('/api/skills');
      assert(skills.status === 200 && skills.data.count > 0, `GET /api/skills returns ${skills.data?.count} skills`);

      // 5. Experience
      const exp = await request('/api/experience');
      assert(exp.status === 200 && exp.data.count > 0, `GET /api/experience returns ${exp.data?.count} roles`);

      // 6. Projects
      const projects = await request('/api/projects');
      assert(projects.status === 200 && projects.data.count > 0, `GET /api/projects returns ${projects.data?.count} projects`);

      // 7. Projects Filter & Search
      const webProjects = await request('/api/projects?category=Web');
      assert(webProjects.status === 200 && webProjects.data.data.every(p => p.category === 'Web'), 'GET /api/projects?category=Web filters correctly');

      const searched = await request('/api/projects?search=telemetry');
      assert(searched.status === 200 && searched.data.count >= 1, 'GET /api/projects?search=telemetry searches correctly');

      // 8. Projects by ID
      const firstProjId = projects.data.data[0].id;
      const projById = await request(`/api/projects/${firstProjId}`);
      assert(projById.status === 200 && projById.data.data.id === firstProjId, 'GET /api/projects/:id returns single project');

      // 9. Education
      const edu = await request('/api/education');
      assert(edu.status === 200 && edu.data.count > 0, 'GET /api/education returns education entries');

      // 10. Certifications
      const certs = await request('/api/certifications');
      assert(certs.status === 200 && certs.data.count > 0, 'GET /api/certifications returns certifications');

      // 11. Achievements
      const ach = await request('/api/achievements');
      assert(ach.status === 200 && ach.data.count > 0, 'GET /api/achievements returns achievements');

      // 12. Social Links
      const soc = await request('/api/social-links');
      assert(soc.status === 200 && soc.data.data.length > 0, 'GET /api/social-links returns links');

      // 13. GitHub
      const gh = await request('/api/github');
      assert(gh.status === 200 && gh.data.data.username, 'GET /api/github returns GitHub stats');

      // 14. Contact Form - Validation Error
      const invalidContact = await request('/api/contact', {
        method: 'POST',
        body: { name: '', email: 'invalid-email', subject: '', message: '' }
      });
      assert(invalidContact.status === 400 && invalidContact.data.error === 'ValidationError', 'POST /api/contact validates input fields correctly');

      // 15. Contact Form - Success
      const validContact = await request('/api/contact', {
        method: 'POST',
        body: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Collaboration Opportunity',
          message: 'Hello Alex, I would love to talk about our engineering project!'
        }
      });
      assert(validContact.status === 201 && validContact.data.success === true, 'POST /api/contact succeeds with valid payload');

      // 16. Auth - Login
      const login = await request('/api/auth/login', {
        method: 'POST',
        body: { username: 'admin', password: 'admin123' }
      });
      assert(login.status === 200 && login.data.token, 'POST /api/auth/login authenticates admin and provides JWT');

      // 17. Auth - Verify Token
      const verify = await request('/api/auth/verify', {
        headers: { Authorization: `Bearer ${login.data.token}` }
      });
      assert(verify.status === 200 && verify.data.success === true, 'GET /api/auth/verify verifies JWT token');

      // 18. Swagger Specs
      const swagger = await request('/api-docs.json');
      assert(swagger.status === 200 && swagger.data.openapi === '3.0.3', 'GET /api-docs.json serves valid OpenAPI 3.0 spec');

      console.log(`\n📊 Tests complete! Passed: ${passed}, Failed: ${failed}`);
      server.close();
      process.exit(failed > 0 ? 1 : 0);
    } catch (e) {
      console.error('Test execution error:', e);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
