const { db } = require('./database');
const Profile = require('./Profile');
const About = require('./About');
const Skill = require('./Skill');
const Experience = require('./Experience');
const Project = require('./Project');
const Education = require('./Education');
const Certification = require('./Certification');
const Achievement = require('./Achievement');
const ContactMessage = require('./ContactMessage');
const SocialLink = require('./SocialLink');

module.exports = {
  db,
  Profile,
  About,
  Skill,
  Experience,
  Project,
  Education,
  Certification,
  Achievement,
  ContactMessage,
  SocialLink
};
