// Seed script to populate initial data from current hardcoded values
// Run this once to migrate existing data to MongoDB

require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Project = require('./models/Project');
const About = require('./models/About');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Service.deleteMany({});
    await Project.deleteMany({});
    await About.deleteMany({});

    // Seed Services
    const services = [
      {
        icon: 'Shield',
        title: 'Cybersecurity Solutions',
        description: 'Protect your digital assets with our advanced security protocols.',
        order: 1,
        active: true,
      },
      {
        icon: 'Code',
        title: 'Web Development',
        description: 'Custom web applications built with cutting-edge technologies.',
        order: 2,
        active: true,
      },
      {
        icon: 'Smartphone',
        title: 'Mobile Apps',
        description: 'Native and cross-platform mobile solutions for iOS and Android.',
        order: 3,
        active: true,
      },
      {
        icon: 'Cloud',
        title: 'Cloud Infrastructure',
        description: 'Scalable cloud solutions powered by AWS, Azure, and GCP.',
        order: 4,
        active: true,
      },
      {
        icon: 'Lock',
        title: 'Data Encryption',
        description: 'End-to-end encryption services to keep your data secure.',
        order: 5,
        active: true,
      },
      {
        icon: 'Zap',
        title: 'API Development',
        description: 'RESTful and GraphQL APIs designed for performance and reliability.',
        order: 6,
        active: true,
      },
    ];

    await Service.insertMany(services);
    console.log('✅ Services seeded successfully');

    // Seed Projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured online marketplace with payment integration.',
        imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c',
        technologies: ['React', 'Node.js', 'Stripe'],
        order: 1,
        active: true,
      },
      {
        title: 'Healthcare Portal',
        description: 'Patient management system with telemedicine capabilities.',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
        technologies: ['Vue.js', 'Python', 'PostgreSQL'],
        order: 2,
        active: true,
      },
      {
        title: 'Finance Dashboard',
        description: 'Real-time analytics and reporting for financial institutions.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        technologies: ['Angular', '.NET', 'SQL Server'],
        order: 3,
        active: true,
      },
    ];

    await Project.insertMany(projects);
    console.log('✅ Projects seeded successfully');

    // Seed About
    const about = new About({
      description: `SPYWEB is your trusted partner in creating secure, innovative digital solutions. 
We specialize in developing cutting-edge web and mobile applications that prioritize security without compromising on functionality or user experience.

Our team of expert developers and security specialists work together to deliver solutions that not only meet your business needs but exceed industry standards in data protection and cybersecurity.`,
      mission: 'To deliver innovative and secure digital solutions that empower businesses to thrive in the digital age.',
      vision: 'To be the leading provider of cutting-edge technology services, setting the standard for security and excellence in digital transformation.',
      values: 'Innovation, Security, Excellence, Integrity, Client Success',
      leadership: [
        { name: 'Rushikesh Thorat', role: 'Founder' },
        { name: 'Abhishek Sudame', role: 'Co-Founder' },
        { name: 'Kaustubh Shinde', role: 'Director' },
      ],
    });

    await about.save();
    console.log('✅ About content seeded successfully');

    console.log('\n🎉 All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
