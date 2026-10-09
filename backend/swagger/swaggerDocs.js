const config = require('../config/env');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Dynamic Developer Portfolio REST API',
    version: '1.0.0',
    description: `A production-ready RESTful API empowering a dynamic personal developer portfolio built with Node.js, Express.js, and Bootstrap 5.
    
### Features:
- **Comprehensive Portfolio Data**: Endpoints for profile, skills, experience, projects, education, certifications, achievements, social links, and GitHub telemetry.
- **Project Filtering & Search**: Query projects by category (Web, Mobile, AI, Full Stack), keyword search, and pagination.
- **Interactive Contact API**: Rate-limited submission with input validation and feedback alerts.
- **Admin Management & CRUD**: Secure JWT & API Key authentication for headless CMS management.
- **Database Abstraction**: Clean decoupled persistence with pluggable storage providers.`,
    contact: {
      name: 'Portfolio Support & API Engineering',
      email: 'sharon.sofiya.dev@example.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}`,
      description: 'Local Development Server'
    }
  ],
  tags: [
    { name: 'Profile', description: 'Personal overview, headline, metrics, and core identity' },
    { name: 'About', description: 'Detailed bio, technical narrative, highlights, and fast facts' },
    { name: 'Skills', description: 'Technical skills, categories, icons, and proficiency percentages' },
    { name: 'Experience', description: 'Work history, roles, responsibilities, and achievements' },
    { name: 'Projects', description: 'Portfolio projects with categories, filters, live links, and features' },
    { name: 'Education', description: 'Academic degrees, institutions, GPA, and activities' },
    { name: 'Certifications', description: 'Industry credentials, badges, licenses, and verifications' },
    { name: 'Achievements', description: 'Hackathon awards, open-source recognitions, and publications' },
    { name: 'Social Links', description: 'External profile links (GitHub, LinkedIn, Twitter, etc.)' },
    { name: 'Contact', description: 'Visitor inquiries submission and admin message management' },
    { name: 'GitHub', description: 'Real-time and cached GitHub repositories and stats' },
    { name: 'Auth', description: 'Administrative authentication and session verification' }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from `/api/auth/login`.'
      },
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-admin-key',
        description: 'Administrative secret API key configured in server environment.'
      }
    },
    schemas: {
      StandardResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'ValidationError' },
          message: { type: 'string', example: 'Invalid input parameters provided.' },
          validationErrors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'A valid email address is required.' }
              }
            }
          }
        }
      },
      Profile: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'profile-main' },
          name: { type: 'string', example: 'Sharon Sofiya' },
          headline: { type: 'string', example: 'Senior Full-Stack & Cloud Solutions Architect' },
          bioSummary: { type: 'string', example: 'Passionate software craftsman with 7+ years of experience...' },
          avatar: { type: 'string', format: 'uri', example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
          location: { type: 'string', example: 'San Francisco, CA (Open to Remote)' },
          email: { type: 'string', format: 'email', example: 'sharon.sofiya.dev@example.com' },
          phone: { type: 'string', example: '+1 (555) 234-5678' },
          status: { type: 'string', example: 'Available for contract & full-time roles' },
          resumeUrl: { type: 'string', example: '#resume-modal' },
          yearsExperience: { type: 'integer', example: 7 },
          completedProjects: { type: 'integer', example: 45 },
          satisfiedClients: { type: 'integer', example: 32 },
          codeCommits: { type: 'integer', example: 2840 }
        }
      },
      About: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'about-main' },
          title: { type: 'string', example: 'Engineering Scalable Systems with Precision & Empathy' },
          summary: { type: 'string', example: 'I bridge the gap between rigorous systems engineering and user experiences.' },
          paragraphs: {
            type: 'array',
            items: { type: 'string' },
            example: ['Hello! I am Sharon Sofiya...', 'Throughout my career...']
          },
          keyHighlights: {
            type: 'array',
            items: { type: 'string' },
            example: ['Microservice Architecture', 'Cloud Automation', 'Clean Architecture']
          },
          interests: {
            type: 'array',
            items: { type: 'string' },
            example: ['Distributed Consensus', 'Generative AI', 'Open Source']
          },
          fastFacts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string', example: 'Primary Language' },
                value: { type: 'string', example: 'JavaScript / TypeScript / Go' }
              }
            }
          }
        }
      },
      Skill: {
        type: 'object',
        required: ['name', 'category', 'proficiency'],
        properties: {
          id: { type: 'string', example: 'skill-1' },
          name: { type: 'string', example: 'JavaScript (ES6+) & TypeScript' },
          category: { type: 'string', example: 'Frontend' },
          icon: { type: 'string', example: 'bi-filetype-js' },
          proficiency: { type: 'integer', minimum: 0, maximum: 100, example: 95 }
        }
      },
      Experience: {
        type: 'object',
        required: ['company', 'position', 'startDate'],
        properties: {
          id: { type: 'string', example: 'exp-1' },
          company: { type: 'string', example: 'Apex Cloud Systems' },
          position: { type: 'string', example: 'Lead Full-Stack Solutions Architect' },
          startDate: { type: 'string', example: '2023-03' },
          endDate: { type: 'string', example: 'Present' },
          description: { type: 'string', example: 'Spearheading engineering efforts on SaaS cloud observability...' },
          responsibilities: {
            type: 'array',
            items: { type: 'string' },
            example: ['Architected distributed REST API layer', 'Led squad of 8 engineers']
          },
          achievements: {
            type: 'array',
            items: { type: 'string' },
            example: ['35% latency reduction via Redis caching']
          },
          technologies: {
            type: 'array',
            items: { type: 'string' },
            example: ['Node.js', 'Express', 'TypeScript', 'Docker']
          }
        }
      },
      Project: {
        type: 'object',
        required: ['title', 'description', 'category'],
        properties: {
          id: { type: 'string', example: 'proj-1' },
          title: { type: 'string', example: 'OmniMetrics - Cloud Telemetry & Observability Hub' },
          description: { type: 'string', example: 'An enterprise-grade observability and metrics visualization dashboard...' },
          image: { type: 'string', format: 'uri', example: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71' },
          category: {
            type: 'string',
            enum: ['All', 'Web', 'Mobile', 'AI', 'Full Stack'],
            example: 'Full Stack'
          },
          technologies: {
            type: 'array',
            items: { type: 'string' },
            example: ['Node.js', 'Express', 'Bootstrap 5', 'PostgreSQL']
          },
          githubUrl: { type: 'string', format: 'uri', example: 'https://github.com/sharonsofiya/omni-metrics' },
          liveUrl: { type: 'string', format: 'uri', example: 'https://omni-metrics-demo.example.com' },
          featured: { type: 'boolean', example: true },
          features: {
            type: 'array',
            items: { type: 'string' },
            example: ['Real-time event streaming via WebSockets', 'OpenAPI/Swagger documented REST API']
          },
          createdAt: { type: 'string', example: '2024-08-15' }
        }
      },
      Education: {
        type: 'object',
        required: ['degree', 'institution', 'startDate'],
        properties: {
          id: { type: 'string', example: 'edu-1' },
          degree: { type: 'string', example: 'Master of Science in Computer Science' },
          institution: { type: 'string', example: 'University of California, Berkeley' },
          fieldOfStudy: { type: 'string', example: 'Software Systems & Cloud Architecture' },
          startDate: { type: 'string', example: '2016-09' },
          endDate: { type: 'string', example: '2018-05' },
          grade: { type: 'string', example: 'GPA: 3.92 / 4.0' },
          description: { type: 'string', example: 'Specialized in distributed systems and cloud virtualization.' },
          activities: {
            type: 'array',
            items: { type: 'string' },
            example: ['Graduate Research Assistant', 'Teaching Assistant for CS 162']
          }
        }
      },
      Certification: {
        type: 'object',
        required: ['name', 'issuer', 'issueDate'],
        properties: {
          id: { type: 'string', example: 'cert-1' },
          name: { type: 'string', example: 'AWS Certified Solutions Architect â€“ Professional' },
          issuer: { type: 'string', example: 'Amazon Web Services (AWS)' },
          issueDate: { type: 'string', example: '2023-04' },
          expiryDate: { type: 'string', example: '2026-04' },
          credentialId: { type: 'string', example: 'AWS-PSA-9204128' },
          credentialUrl: { type: 'string', format: 'uri', example: 'https://aws.amazon.com/verification' },
          badgeIcon: { type: 'string', example: 'bi-cloud-check-fill' }
        }
      },
      Achievement: {
        type: 'object',
        required: ['title', 'category', 'year'],
        properties: {
          id: { type: 'string', example: 'ach-1' },
          title: { type: 'string', example: '1st Place Winner - Global Cloud Native Hackathon 2024' },
          category: { type: 'string', example: 'Hackathon' },
          year: { type: 'string', example: '2024' },
          description: { type: 'string', example: 'Engineered an AI-augmented Kubernetes pod auto-scaler...' },
          icon: { type: 'string', example: 'bi-trophy-fill' },
          link: { type: 'string', example: 'https://hackathon.example.com/winners/2024' }
        }
      },
      ContactMessage: {
        type: 'object',
        required: ['name', 'email', 'subject', 'message'],
        properties: {
          id: { type: 'string', example: 'msg-1' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          subject: { type: 'string', example: 'Project Inquiry' },
          message: { type: 'string', example: 'Hello Alex, I would love to collaborate on a new project!' },
          createdAt: { type: 'string', example: '2024-10-08T12:00:00.000Z' },
          read: { type: 'boolean', example: false }
        }
      },
      SocialLink: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'soc-1' },
          platform: { type: 'string', example: 'github' },
          url: { type: 'string', example: 'https://github.com/sharonsofiya' },
          icon: { type: 'string', example: 'bi-github' },
          displayName: { type: 'string', example: 'GitHub' }
        }
      },
      GitHubData: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'sharonsofiya' },
          name: { type: 'string', example: 'Sharon Sofiya' },
          bio: { type: 'string', example: 'Senior Full-Stack Architect' },
          avatarUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
          profileUrl: { type: 'string', example: 'https://github.com/sharonsofiya' },
          publicRepos: { type: 'integer', example: 38 },
          followers: { type: 'integer', example: 1240 },
          following: { type: 'integer', example: 185 },
          totalStars: { type: 'integer', example: 4850 },
          pinnedRepos: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'gh-repo-1' },
                name: { type: 'string', example: 'omni-metrics' },
                description: { type: 'string', example: 'Observability dashboard' },
                language: { type: 'string', example: 'JavaScript' },
                languageColor: { type: 'string', example: '#f1e05a' },
                stars: { type: 'integer', example: 1420 },
                forks: { type: 'integer', example: 215 },
                url: { type: 'string', example: 'https://github.com/sharonsofiya/omni-metrics' },
                updatedAt: { type: 'string', example: '2024-09-12' }
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/api/profile': {
      get: {
        tags: ['Profile'],
        summary: 'Get developer profile details',
        description: 'Returns profile name, headline, avatar, summary metrics, and contact info.',
        responses: {
          200: {
            description: 'Profile retrieved successfully',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Profile' } } } } }
          },
          404: { description: 'Profile not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Profile'],
        summary: 'Update developer profile',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } }
        },
        responses: {
          200: { description: 'Profile updated successfully' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/about': {
      get: {
        tags: ['About'],
        summary: 'Get About section details',
        responses: {
          200: {
            description: 'About section retrieved',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/About' } } } } }
          }
        }
      },
      put: {
        tags: ['About'],
        summary: 'Update About section details',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/About' } } }
        },
        responses: {
          200: { description: 'About section updated' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/skills': {
      get: {
        tags: ['Skills'],
        summary: 'List all skills',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter skills by category (e.g. Frontend, Backend, Database)' }
        ],
        responses: {
          200: {
            description: 'Skills list retrieved',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, count: { type: 'integer', example: 18 }, data: { type: 'array', items: { $ref: '#/components/schemas/Skill' } } } } } }
          }
        }
      },
      post: {
        tags: ['Skills'],
        summary: 'Create a new skill',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } }
        },
        responses: {
          201: { description: 'Skill created successfully' },
          400: { description: 'Validation error' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/skills/{id}': {
      get: {
        tags: ['Skills'],
        summary: 'Get skill by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Skill retrieved' },
          404: { description: 'Skill not found' }
        }
      },
      put: {
        tags: ['Skills'],
        summary: 'Update skill by ID',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } }
        },
        responses: {
          200: { description: 'Skill updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Skill not found' }
        }
      },
      delete: {
        tags: ['Skills'],
        summary: 'Delete skill by ID',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Skill deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Skill not found' }
        }
      }
    },
    '/api/experience': {
      get: {
        tags: ['Experience'],
        summary: 'List all professional experiences',
        responses: {
          200: {
            description: 'Experience history retrieved',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, count: { type: 'integer' }, data: { type: 'array', items: { $ref: '#/components/schemas/Experience' } } } } } }
          }
        }
      },
      post: {
        tags: ['Experience'],
        summary: 'Create a new experience entry',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Experience' } } }
        },
        responses: {
          201: { description: 'Experience entry created' },
          400: { description: 'Validation error' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/experience/{id}': {
      get: {
        tags: ['Experience'],
        summary: 'Get experience entry by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Experience found' },
          404: { description: 'Experience not found' }
        }
      },
      put: {
        tags: ['Experience'],
        summary: 'Update experience entry by ID',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Experience' } } }
        },
        responses: {
          200: { description: 'Experience updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' }
        }
      },
      delete: {
        tags: ['Experience'],
        summary: 'Delete experience entry by ID',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Experience deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' }
        }
      }
    },
    '/api/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List portfolio projects with filter, search, and pagination',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string', enum: ['All', 'Web', 'Mobile', 'AI', 'Full Stack'] }, description: 'Filter by project category' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Keyword search in title, description, or technologies' },
          { name: 'featured', in: 'query', schema: { type: 'boolean' }, description: 'Filter featured projects' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number for pagination' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 6 }, description: 'Items per page' }
        ],
        responses: {
          200: {
            description: 'Projects retrieved successfully',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, count: { type: 'integer' }, total: { type: 'integer' }, data: { type: 'array', items: { $ref: '#/components/schemas/Project' } } } } } }
          }
        }
      },
      post: {
        tags: ['Projects'],
        summary: 'Create a new project',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } }
        },
        responses: {
          201: { description: 'Project created successfully' },
          400: { description: 'Validation error' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Get project details by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project details retrieved', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Project' } } } } } },
          404: { description: 'Project not found' }
        }
      },
      put: {
        tags: ['Projects'],
        summary: 'Update project details by ID',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } }
        },
        responses: {
          200: { description: 'Project updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Project not found' }
        }
      },
      delete: {
        tags: ['Projects'],
        summary: 'Delete project by ID',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Project deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Project not found' }
        }
      }
    },
    '/api/education': {
      get: {
        tags: ['Education'],
        summary: 'List all education entries',
        responses: {
          200: {
            description: 'Education list retrieved',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, count: { type: 'integer' }, data: { type: 'array', items: { $ref: '#/components/schemas/Education' } } } } } }
          }
        }
      },
      post: {
        tags: ['Education'],
        summary: 'Create an education entry',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Education' } } }
        },
        responses: {
          201: { description: 'Created' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/education/{id}': {
      get: {
        tags: ['Education'],
        summary: 'Get education entry by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Success' },
          404: { description: 'Not found' }
        }
      },
      put: {
        tags: ['Education'],
        summary: 'Update education entry',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Education' } } }
        },
        responses: { 200: { description: 'Updated' }, 401: { description: 'Unauthorized' } }
      },
      delete: {
        tags: ['Education'],
        summary: 'Delete education entry',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/certifications': {
      get: {
        tags: ['Certifications'],
        summary: 'List all certifications',
        responses: {
          200: {
            description: 'Certifications retrieved',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, count: { type: 'integer' }, data: { type: 'array', items: { $ref: '#/components/schemas/Certification' } } } } } }
          }
        }
      },
      post: {
        tags: ['Certifications'],
        summary: 'Create a certification',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Certification' } } }
        },
        responses: { 201: { description: 'Created' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/certifications/{id}': {
      get: {
        tags: ['Certifications'],
        summary: 'Get certification by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' }, 404: { description: 'Not found' } }
      },
      put: {
        tags: ['Certifications'],
        summary: 'Update certification',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Certification' } } } },
        responses: { 200: { description: 'Updated' }, 401: { description: 'Unauthorized' } }
      },
      delete: {
        tags: ['Certifications'],
        summary: 'Delete certification',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/achievements': {
      get: {
        tags: ['Achievements'],
        summary: 'List all achievements',
        responses: {
          200: {
            description: 'Achievements retrieved',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, count: { type: 'integer' }, data: { type: 'array', items: { $ref: '#/components/schemas/Achievement' } } } } } }
          }
        }
      },
      post: {
        tags: ['Achievements'],
        summary: 'Create an achievement',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Achievement' } } } },
        responses: { 201: { description: 'Created' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/achievements/{id}': {
      get: {
        tags: ['Achievements'],
        summary: 'Get achievement by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' }, 404: { description: 'Not found' } }
      },
      put: {
        tags: ['Achievements'],
        summary: 'Update achievement',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Achievement' } } } },
        responses: { 200: { description: 'Updated' }, 401: { description: 'Unauthorized' } }
      },
      delete: {
        tags: ['Achievements'],
        summary: 'Delete achievement',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/social-links': {
      get: {
        tags: ['Social Links'],
        summary: 'List all social links',
        responses: {
          200: {
            description: 'Social links retrieved',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/SocialLink' } } } } } }
          }
        }
      }
    },
    '/api/contact': {
      post: {
        tags: ['Contact'],
        summary: 'Submit a contact inquiry message',
        description: 'Rate-limited endpoint validating name, email, subject, and message. Returns confirmation feedback.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  subject: { type: 'string', example: 'Project Inquiry' },
                  message: { type: 'string', example: 'Hello Sharon, I would like to discuss a project with you.' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Message sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Message sent successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'msg-9b12a8' },
                        createdAt: { type: 'string', example: '2024-10-08T12:00:00.000Z' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation Error',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
          },
          429: {
            description: 'Too Many Requests (Rate limit reached)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
          }
        }
      },
      get: {
        tags: ['Contact'],
        summary: 'List all submitted messages (Admin only)',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        responses: {
          200: {
            description: 'Messages list retrieved',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, count: { type: 'integer' }, data: { type: 'array', items: { $ref: '#/components/schemas/ContactMessage' } } } } } }
          },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/contact/{id}/read': {
      patch: {
        tags: ['Contact'],
        summary: 'Mark contact message as read (Admin only)',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Message marked as read' },
          401: { description: 'Unauthorized' },
          404: { description: 'Message not found' }
        }
      }
    },
    '/api/contact/{id}': {
      delete: {
        tags: ['Contact'],
        summary: 'Delete contact message (Admin only)',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Message deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Message not found' }
        }
      }
    },
    '/api/github': {
      get: {
        tags: ['GitHub'],
        summary: 'Get GitHub statistics and pinned repositories',
        description: 'Returns GitHub profile metrics and top public repositories with fallback caching.',
        responses: {
          200: {
            description: 'GitHub data retrieved',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/GitHubData' } } } } }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Admin login to obtain JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string', example: 'admin' },
                  password: { type: 'string', example: 'admin123' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Admin authentication successful' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    user: { type: 'object', properties: { username: { type: 'string' }, role: { type: 'string' } } }
                  }
                }
              }
            }
          },
          401: { description: 'Invalid admin credentials' }
        }
      }
    },
    '/api/auth/verify': {
      get: {
        tags: ['Auth'],
        summary: 'Verify JWT session validity',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Token is valid' },
          401: { description: 'Invalid or expired token' }
        }
      }
    },
    '/api/auth/reset': {
      post: {
        tags: ['Auth'],
        summary: 'Reset database to default seed state (Admin only)',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        responses: {
          200: { description: 'Database reset to default seeds successfully' },
          401: { description: 'Unauthorized' }
        }
      }
    }
  }
};

module.exports = swaggerDefinition;

