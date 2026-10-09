// Input Validation Middleware

function validateContact(req, res, next) {
  const { name, email, subject, message } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required and must be at least 2 characters long.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required.' });
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
    errors.push({ field: 'subject', message: 'Subject is required and must be at least 2 characters long.' });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    errors.push({ field: 'message', message: 'Message is required and must be at least 5 characters long.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Validation failed for one or more fields.',
      errors
    });
  }

  // Sanitize
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.subject = subject.trim();
  req.body.message = message.trim();

  next();
}

function validateProject(req, res, next) {
  const { title, description, category } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    errors.push({ field: 'title', message: 'Title is required and must be at least 2 characters.' });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 5) {
    errors.push({ field: 'description', message: 'Description is required and must be at least 5 characters.' });
  }

  const validCategories = ['All', 'Web', 'Mobile', 'AI', 'Full Stack'];
  if (category && !validCategories.includes(category)) {
    errors.push({
      field: 'category',
      message: `Category must be one of: ${validCategories.slice(1).join(', ')}.`
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Project validation failed.',
      errors
    });
  }

  next();
}

function validateSkill(req, res, next) {
  const { name, category, proficiency } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    errors.push({ field: 'name', message: 'Skill name is required.' });
  }

  if (!category || typeof category !== 'string' || category.trim().length < 1) {
    errors.push({ field: 'category', message: 'Category is required (e.g., Frontend, Backend, Database).' });
  }

  if (proficiency !== undefined) {
    const prof = Number(proficiency);
    if (isNaN(prof) || prof < 0 || prof > 100) {
      errors.push({ field: 'proficiency', message: 'Proficiency must be a number between 0 and 100.' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Skill validation failed.',
      errors
    });
  }

  next();
}

function validateExperience(req, res, next) {
  const { company, position, startDate } = req.body;
  const errors = [];

  if (!company || typeof company !== 'string' || company.trim().length < 1) {
    errors.push({ field: 'company', message: 'Company is required.' });
  }

  if (!position || typeof position !== 'string' || position.trim().length < 1) {
    errors.push({ field: 'position', message: 'Position is required.' });
  }

  if (!startDate || typeof startDate !== 'string') {
    errors.push({ field: 'startDate', message: 'Start date is required.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Experience validation failed.',
      errors
    });
  }

  next();
}

module.exports = {
  validateContact,
  validateProject,
  validateSkill,
  validateExperience
};
