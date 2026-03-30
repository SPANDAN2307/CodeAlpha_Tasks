const sequelize = require('./config/database');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced and cleared');

    const events = await Event.bulkCreate([
      {
        title: 'Global Tech Conference 2026',
        description: 'Join thousands of developers and industry leaders for three days of keynotes, deep dive sessions, and networking.\n\nLearn about the latest in AI, cloud native architectures, and web development.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        location: 'Moscone Center, San Francisco / Virtual',
        capacity: 500,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
      },
      {
        title: 'React & Next.js Masterclass',
        description: 'A full-day intensive workshop covering advanced React patterns, Server Components, and Next.js 14 features.\n\nLunch and networking drinks included.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: 'Tech Hub, New York',
        capacity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
      },
      {
        title: 'Design Systems Workshop',
        description: 'Learn how to build, scale, and maintain design systems that bridge the gap between design and engineering teams.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        location: 'Creative Labs, London',
        capacity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80'
      },
      {
        title: 'Startup Founders Mixer',
        description: 'An exclusive networking event for early-stage startup founders to meet investors, early employees, and fellow entrepreneurs.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        location: 'Rooftop Lounge, Austin',
        capacity: 200,
        imageUrl: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=800&q=80'
      }
    ]);

    console.log(`Created ${events.length} events successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
