import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@raisinrach.com' },
    update: {},
    create: {
      email: 'admin@raisinrach.com',
      name: 'Admin User',
      password: hashedPassword,
      company: 'RaisinRach',
      industry: 'Sales Consulting',
      membershipStatus: 'ACTIVE',
      membershipTier: 'admin',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create Client Users
  const client1 = await prisma.user.upsert({
    where: { email: 'john@acmecorp.com' },
    update: {},
    create: {
      email: 'john@acmecorp.com',
      name: 'John Smith',
      password: hashedPassword,
      company: 'Acme Corp',
      industry: 'Manufacturing',
      membershipStatus: 'ACTIVE',
      membershipTier: 'professional',
    },
  });
  console.log('✅ Created client 1:', client1.email);

  const client2 = await prisma.user.upsert({
    where: { email: 'sarah@techsolutions.com' },
    update: {},
    create: {
      email: 'sarah@techsolutions.com',
      name: 'Sarah Johnson',
      password: hashedPassword,
      company: 'Tech Solutions Inc',
      industry: 'Technology',
      membershipStatus: 'ACTIVE',
      membershipTier: 'enterprise',
    },
  });
  console.log('✅ Created client 2:', client2.email);

  const client3 = await prisma.user.upsert({
    where: { email: 'mike@globalmanuf.com' },
    update: {},
    create: {
      email: 'mike@globalmanuf.com',
      name: 'Mike Davis',
      password: hashedPassword,
      company: 'Global Manufacturing',
      industry: 'Manufacturing',
      membershipStatus: 'ACTIVE',
      membershipTier: 'professional',
    },
  });
  console.log('✅ Created client 3:', client3.email);

  // Create Focus Areas for Client 1
  const focusArea1 = await prisma.focusArea.create({
    data: {
      userId: client1.id,
      title: 'Enterprise Manufacturing',
      description: 'Target large manufacturing companies with 500+ employees',
      priority: 'HIGH',
      isActive: true,
      targetIndustry: 'Manufacturing',
      targetCompanySize: '500-1000',
      targetLocation: 'Northeast US',
      targetJobTitles: ['VP of Operations', 'Director of Manufacturing', 'Plant Manager'],
    },
  });
  console.log('✅ Created focus area 1');

  const focusArea2 = await prisma.focusArea.create({
    data: {
      userId: client1.id,
      title: 'Tech Startups',
      description: 'Target SaaS and software development companies',
      priority: 'MEDIUM',
      isActive: true,
      targetIndustry: 'Technology',
      targetCompanySize: '50-200',
      targetLocation: 'California',
      targetJobTitles: ['CTO', 'VP of Engineering', 'Head of Product'],
    },
  });
  console.log('✅ Created focus area 2');

  // Create Leads for Client 1
  const lead1 = await prisma.lead.create({
    data: {
      userId: client1.id,
      companyName: 'Global Manufacturing Co',
      contactName: 'Mike Davis',
      contactTitle: 'VP of Operations',
      contactEmail: 'mike.davis@globalmanuf.com',
      contactPhone: '(555) 345-6789',
      status: 'QUALIFIED',
      source: 'Cold Call',
      industry: 'Manufacturing',
      budget: '$50,000+',
      authority: 'Decision Maker',
      need: 'Need to scale sales team without hiring in-house',
      timeline: 'Q1 2026',
      notes: 'Very interested in our services. Budget confirmed. Ready to move forward.',
      nextAction: 'Send proposal',
      nextActionDate: new Date('2026-02-20'),
    },
  });
  console.log('✅ Created lead 1');

  const lead2 = await prisma.lead.create({
    data: {
      userId: client1.id,
      companyName: 'Tech Innovations Inc',
      contactName: 'James Wilson',
      contactTitle: 'Director of Sales',
      contactEmail: 'james.w@techinnovations.com',
      contactPhone: '(555) 789-0123',
      status: 'CONTACTED',
      source: 'LinkedIn',
      industry: 'Technology',
      budget: '$30,000+',
      authority: 'Influencer',
      need: 'Looking to expand into new markets',
      timeline: 'Q2 2026',
      notes: 'Initial contact made. Needs to discuss with VP.',
      nextAction: 'Follow-up call',
      nextActionDate: new Date('2026-02-25'),
    },
  });
  console.log('✅ Created lead 2');

  const lead3 = await prisma.lead.create({
    data: {
      userId: client2.id,
      companyName: 'Enterprise Solutions LLC',
      contactName: 'Lisa Chen',
      contactTitle: 'CTO',
      contactEmail: 'lisa@enterprisesol.com',
      contactPhone: '(555) 456-7890',
      status: 'MEETING_SCHEDULED',
      source: 'Referral',
      industry: 'Technology',
      budget: '$75,000+',
      authority: 'Decision Maker',
      need: 'Critical need for appointment setting services',
      timeline: 'Immediate',
      notes: 'Hot lead! Meeting scheduled for next week. Very high priority.',
      nextAction: 'Prepare demo',
      nextActionDate: new Date('2026-02-18'),
    },
  });
  console.log('✅ Created lead 3');

  // Create Call Logs for Client 1
  const call1 = await prisma.callLog.create({
    data: {
      userId: client1.id,
      leadId: lead1.id,
      prospectName: 'Mike Davis',
      prospectCompany: 'Global Manufacturing Co',
      prospectPhone: '(555) 345-6789',
      prospectEmail: 'mike.davis@globalmanuf.com',
      callDate: new Date('2026-02-15T10:30:00'),
      callDuration: 1102, // 18 minutes 22 seconds
      callOutcome: 'SCHEDULED_MEETING',
      notes: 'Excellent call! Mike is very interested. Discussed budget ($50K+) and timeline (Q1 2026). Scheduled follow-up meeting for proposal presentation.',
      followUpDate: new Date('2026-02-20'),
    },
  });
  console.log('✅ Created call log 1');

  const call2 = await prisma.callLog.create({
    data: {
      userId: client1.id,
      leadId: lead2.id,
      prospectName: 'James Wilson',
      prospectCompany: 'Tech Innovations Inc',
      prospectPhone: '(555) 789-0123',
      prospectEmail: 'james.w@techinnovations.com',
      callDate: new Date('2026-02-14T14:15:00'),
      callDuration: 525, // 8 minutes 45 seconds
      callOutcome: 'CONNECTED',
      notes: 'Good initial conversation. James is interested but needs to discuss with VP. Will follow up next week.',
      followUpDate: new Date('2026-02-25'),
    },
  });
  console.log('✅ Created call log 2');

  const call3 = await prisma.callLog.create({
    data: {
      userId: client1.id,
      prospectName: 'Robert Williams',
      prospectCompany: 'Startup Ventures',
      prospectPhone: '(555) 567-8901',
      callDate: new Date('2026-02-13T09:00:00'),
      callDuration: 0,
      callOutcome: 'NO_ANSWER',
      notes: 'No answer. Will try again tomorrow.',
      followUpDate: new Date('2026-02-14'),
    },
  });
  console.log('✅ Created call log 3');

  const call4 = await prisma.callLog.create({
    data: {
      userId: client2.id,
      leadId: lead3.id,
      prospectName: 'Lisa Chen',
      prospectCompany: 'Enterprise Solutions LLC',
      prospectPhone: '(555) 456-7890',
      prospectEmail: 'lisa@enterprisesol.com',
      callDate: new Date('2026-02-16T11:00:00'),
      callDuration: 910, // 15 minutes 10 seconds
      callOutcome: 'SCHEDULED_MEETING',
      notes: 'Hot lead! Budget $75K+, immediate timeline. Scheduling demo for next week.',
      followUpDate: new Date('2026-02-18'),
    },
  });
  console.log('✅ Created call log 4');

  const call5 = await prisma.callLog.create({
    data: {
      userId: client2.id,
      prospectName: 'Sarah Johnson',
      prospectCompany: 'Tech Solutions Inc',
      prospectPhone: '(555) 234-5678',
      callDate: new Date('2026-02-17T15:30:00'),
      callDuration: 45,
      callOutcome: 'VOICEMAIL',
      notes: 'Left message about our services and pricing.',
      followUpDate: new Date('2026-02-19'),
    },
  });
  console.log('✅ Created call log 5');

  // Create more leads for variety
  const lead4 = await prisma.lead.create({
    data: {
      userId: client3.id,
      companyName: 'Digital Marketing Co',
      contactName: 'Amanda Rodriguez',
      contactTitle: 'Marketing Manager',
      contactEmail: 'amanda@digitalmarketing.co',
      contactPhone: '(555) 890-1234',
      status: 'NURTURE',
      source: 'Cold Call',
      industry: 'Marketing',
      budget: '$20,000+',
      authority: 'Influencer',
      need: 'Exploring options for lead generation',
      timeline: 'Q3 2026',
      notes: 'Not ready yet, but interested. Follow up in a few months.',
      nextAction: 'Send resources',
      nextActionDate: new Date('2026-05-01'),
    },
  });
  console.log('✅ Created lead 4');

  const lead5 = await prisma.lead.create({
    data: {
      userId: client1.id,
      companyName: 'Industrial Solutions',
      contactName: 'Mary Johnson',
      contactTitle: 'Operations Director',
      contactEmail: 'mary@industrialsol.com',
      contactPhone: '(555) 321-6547',
      status: 'QUALIFIED',
      source: 'Referral',
      industry: 'Manufacturing',
      budget: '$40,000+',
      authority: 'Decision Maker',
      need: 'Need help with B2B appointment setting',
      timeline: 'Q1 2026',
      notes: 'Strong referral from existing client. Very qualified.',
      nextAction: 'Schedule meeting',
      nextActionDate: new Date('2026-02-19'),
    },
  });
  console.log('✅ Created lead 5');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('  - 4 Users created (1 admin, 3 clients)');
  console.log('  - 2 Focus Areas created');
  console.log('  - 5 Leads created');
  console.log('  - 5 Call Logs created');
  console.log('');
  console.log('🔐 Login credentials:');
  console.log('  Admin: admin@raisinrach.com / password123');
  console.log('  Client 1: john@acmecorp.com / password123');
  console.log('  Client 2: sarah@techsolutions.com / password123');
  console.log('  Client 3: mike@globalmanuf.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
