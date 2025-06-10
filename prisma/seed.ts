import { PrismaClient } from '../node_modules/@prisma/client';
import bcrypt from 'bcryptjs';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create job categories
  const categories = [
    { category: 'technology', name: 'Technology' },
    { category: 'healthcare', name: 'Healthcare' },
    { category: 'finance', name: 'Finance' },
    { category: 'education', name: 'Education' },
    { category: 'marketing', name: 'Marketing' },
    { category: 'sales', name: 'Sales' },
    { category: 'customer-service', name: 'Customer Service' },
    { category: 'administration', name: 'Administration' },
    { category: 'retail', name: 'Retail' },
    { category: 'hospitality', name: 'Hospitality' },
  ];

  console.log('📂 Creating job categories...');
  for (const categoryData of categories) {
    await prisma.jobCategory.upsert({
      where: { category: categoryData.category },
      update: {},
      create: categoryData,
    });
  }

  // Create sample employer
  console.log('🏢 Creating sample employer...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const employer = await prisma.user.upsert({
    where: { email: 'employer@example.com' },
    update: {},
    create: {
      email: 'employer@example.com',
      password: hashedPassword,
      employer: {
        create: {
          name: 'Tech Solutions Inc.',
          address: '123 Business Street, San Francisco, CA 94105',
          category: 'Technology Company',
          websiteUrl: 'https://techsolutions.example.com',
        },
      },
    },
    include: {
      employer: true,
    },
  });

  // Create sample applicant
  console.log('👤 Creating sample applicant...');
  const applicant = await prisma.user.upsert({
    where: { email: 'applicant@example.com' },
    update: {},
    create: {
      email: 'applicant@example.com',
      password: hashedPassword,
      applicant: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+1-555-0123',
          introduction:
            'Experienced software developer with 5+ years in full-stack development.',
        },
      },
    },
    include: {
      applicant: true,
    },
  });

  // Create sample job postings
  if (employer.employer) {
    console.log('💼 Creating sample job postings...');

    const techCategory = await prisma.jobCategory.findUnique({
      where: { category: 'technology' },
    });

    const marketingCategory = await prisma.jobCategory.findUnique({
      where: { category: 'marketing' },
    });

    if (techCategory && marketingCategory) {
      await prisma.jobPosting.createMany({
        data: [
          {
            title: 'Senior Full Stack Developer',
            description:
              'We are looking for an experienced full-stack developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
            jobName: 'Full Stack Developer',
            hourlySalaryRange: '$50-80/hour',
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            employerId: employer.employer.id,
            jobCategoryId: techCategory.id,
          },
          {
            title: 'Frontend React Developer',
            description:
              'Join our team as a frontend developer specializing in React. You will work on creating beautiful and responsive user interfaces.',
            jobName: 'React Developer',
            hourlySalaryRange: '$40-65/hour',
            expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
            employerId: employer.employer.id,
            jobCategoryId: techCategory.id,
          },
          {
            title: 'Digital Marketing Specialist',
            description:
              'We need a creative digital marketing specialist to help grow our online presence and drive customer acquisition.',
            jobName: 'Marketing Specialist',
            hourlySalaryRange: '$30-45/hour',
            expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
            employerId: employer.employer.id,
            jobCategoryId: marketingCategory.id,
          },
        ],
      });
    }
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('📧 Sample accounts created:');
  console.log('   Employer: employer@example.com / password123');
  console.log('   Applicant: applicant@example.com / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
