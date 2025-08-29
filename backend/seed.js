const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Progress = require('./models/Progress');

// Sample users
const sampleUsers = [
  {
    name: 'Demo Student',
    email: 'student@demo.com',
    password: 'password123',
    role: 'student'
  },
  {
    name: 'John Instructor',
    email: 'instructor@demo.com',
    password: 'password123',
    role: 'instructor'
  },
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@demo.com',
    password: 'password123',
    role: 'instructor'
  },
  {
    name: 'Mike Chen',
    email: 'mike@demo.com',
    password: 'password123',
    role: 'instructor'
  }
];

// Sample courses
const sampleCourses = [
  {
    title: 'Complete JavaScript Bootcamp',
    description: 'Learn JavaScript from beginner to advanced level. This comprehensive course covers ES6+, DOM manipulation, async programming, and modern JavaScript frameworks.',
    category: 'Programming',
    level: 'Beginner',
    price: 0,
    isPublished: true,
    tags: ['JavaScript', 'Programming', 'Web Development', 'ES6'],
    lessons: [
      {
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript, variables, and data types',
        duration: 45,
        order: 0,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
      },
      {
        title: 'Functions and Scope',
        description: 'Understanding functions, parameters, and variable scope',
        duration: 60,
        order: 1,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
      },
      {
        title: 'DOM Manipulation',
        description: 'Learn how to interact with HTML elements using JavaScript',
        duration: 75,
        order: 2,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4'
      },
      {
        title: 'Async JavaScript',
        description: 'Promises, async/await, and handling asynchronous operations',
        duration: 90,
        order: 3,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_7mb.mp4'
      }
    ]
  },
  {
    title: 'React for Beginners',
    description: 'Master React.js and build modern web applications. Learn components, hooks, state management, and build real-world projects.',
    category: 'Programming',
    level: 'Intermediate',
    price: 49,
    isPublished: true,
    tags: ['React', 'JavaScript', 'Frontend', 'Components'],
    lessons: [
      {
        title: 'React Fundamentals',
        description: 'Introduction to React, JSX, and creating your first component',
        duration: 50,
        order: 0
      },
      {
        title: 'Components and Props',
        description: 'Understanding React components and passing data with props',
        duration: 55,
        order: 1
      },
      {
        title: 'State and Hooks',
        description: 'Managing component state with useState and other hooks',
        duration: 70,
        order: 2
      },
      {
        title: 'Building a Todo App',
        description: 'Put it all together by building a complete React application',
        duration: 120,
        order: 3
      }
    ]
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Learn professional UI/UX design principles, tools, and create stunning user interfaces. Perfect for beginners and intermediate designers.',
    category: 'Design',
    level: 'Beginner',
    price: 79,
    isPublished: true,
    tags: ['UI Design', 'UX Design', 'Figma', 'Design Principles'],
    lessons: [
      {
        title: 'Design Fundamentals',
        description: 'Color theory, typography, and layout principles',
        duration: 60,
        order: 0
      },
      {
        title: 'User Research',
        description: 'Understanding your users and their needs',
        duration: 45,
        order: 1
      },
      {
        title: 'Wireframing and Prototyping',
        description: 'Creating wireframes and interactive prototypes',
        duration: 80,
        order: 2
      },
      {
        title: 'Design Systems',
        description: 'Building consistent and scalable design systems',
        duration: 70,
        order: 3
      }
    ]
  },
  {
    title: 'Digital Marketing Strategy',
    description: 'Complete digital marketing course covering SEO, social media, email marketing, and paid advertising strategies.',
    category: 'Marketing',
    level: 'Beginner',
    price: 0,
    isPublished: true,
    tags: ['Digital Marketing', 'SEO', 'Social Media', 'Email Marketing'],
    lessons: [
      {
        title: 'Marketing Fundamentals',
        description: 'Understanding digital marketing landscape and customer journey',
        duration: 40,
        order: 0
      },
      {
        title: 'SEO Basics',
        description: 'Search engine optimization strategies and best practices',
        duration: 65,
        order: 1
      },
      {
        title: 'Social Media Marketing',
        description: 'Building brand presence across social platforms',
        duration: 55,
        order: 2
      },
      {
        title: 'Email Marketing',
        description: 'Creating effective email campaigns and automation',
        duration: 50,
        order: 3
      }
    ]
  },
  {
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning using Python. Perfect for aspiring data scientists.',
    category: 'Data Science',
    level: 'Intermediate',
    price: 99,
    isPublished: true,
    tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas'],
    lessons: [
      {
        title: 'Python for Data Science',
        description: 'Python basics and libraries for data analysis',
        duration: 90,
        order: 0
      },
      {
        title: 'Data Manipulation with Pandas',
        description: 'Working with datasets using Pandas library',
        duration: 85,
        order: 1
      },
      {
        title: 'Data Visualization',
        description: 'Creating charts and graphs with Matplotlib and Seaborn',
        duration: 75,
        order: 2
      },
      {
        title: 'Machine Learning Basics',
        description: 'Introduction to machine learning algorithms',
        duration: 110,
        order: 3
      }
    ]
  },
  {
    title: 'Photography Fundamentals',
    description: 'Master the art of photography with this comprehensive course covering composition, lighting, and post-processing.',
    category: 'Photography',
    level: 'Beginner',
    price: 59,
    isPublished: true,
    tags: ['Photography', 'Composition', 'Lighting', 'Post-processing'],
    lessons: [
      {
        title: 'Camera Basics',
        description: 'Understanding your camera settings and controls',
        duration: 35,
        order: 0
      },
      {
        title: 'Composition Rules',
        description: 'Rule of thirds, leading lines, and other composition techniques',
        duration: 40,
        order: 1
      },
      {
        title: 'Understanding Light',
        description: 'Natural and artificial lighting techniques',
        duration: 55,
        order: 2
      },
      {
        title: 'Photo Editing',
        description: 'Basic post-processing and editing techniques',
        duration: 65,
        order: 3
      }
    ]
  },
  {
    title: 'Business Strategy and Planning',
    description: 'Learn how to create effective business strategies, conduct market analysis, and develop comprehensive business plans.',
    category: 'Business',
    level: 'Intermediate',
    price: 89,
    isPublished: true,
    tags: ['Business Strategy', 'Market Analysis', 'Business Planning', 'Entrepreneurship'],
    lessons: [
      {
        title: 'Strategic Thinking',
        description: 'Developing strategic mindset and analytical skills',
        duration: 45,
        order: 0
      },
      {
        title: 'Market Research',
        description: 'Conducting effective market research and competitor analysis',
        duration: 60,
        order: 1
      },
      {
        title: 'Business Model Design',
        description: 'Creating and validating business models',
        duration: 70,
        order: 2
      },
      {
        title: 'Financial Planning',
        description: 'Budgeting, forecasting, and financial projections',
        duration: 80,
        order: 3
      }
    ]
  },
  {
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB. Learn API development and database design.',
    category: 'Programming',
    level: 'Advanced',
    price: 129,
    isPublished: true,
    tags: ['Node.js', 'Express', 'MongoDB', 'API Development'],
    lessons: [
      {
        title: 'Node.js Fundamentals',
        description: 'Introduction to Node.js and server-side JavaScript',
        duration: 60,
        order: 0
      },
      {
        title: 'Express.js Framework',
        description: 'Building web servers and APIs with Express.js',
        duration: 75,
        order: 1
      },
      {
        title: 'Database Integration',
        description: 'Working with MongoDB and Mongoose ODM',
        duration: 90,
        order: 2
      },
      {
        title: 'Authentication and Security',
        description: 'Implementing JWT authentication and security best practices',
        duration: 85,
        order: 3
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Progress.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [];
    for (let userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.name} (${user.role})`);
    }

    // Get instructor users for assigning courses
    const instructors = users.filter(user => user.role === 'instructor' || user.role === 'admin');

    // Create courses
    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i];
      const instructor = instructors[i % instructors.length]; // Rotate through instructors
      
      // Calculate total duration
      const totalDuration = courseData.lessons.reduce((acc, lesson) => acc + lesson.duration, 0);
      
      const course = new Course({
        ...courseData,
        instructor: instructor._id,
        totalDuration,
        enrolledStudents: [],
        rating: Math.floor(Math.random() * 2) + 4 // Random rating between 4-5
      });
      
      await course.save();
      console.log(`Created course: ${course.title} by ${instructor.name}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users created: ${users.length}`);
    console.log(`📚 Courses created: ${sampleCourses.length}`);
    
    console.log('\n🔑 Demo Login Credentials:');
    console.log('Student: student@demo.com / password123');
    console.log('Instructor: instructor@demo.com / password123');
    console.log('Admin: admin@demo.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seeding function
seedDatabase();
