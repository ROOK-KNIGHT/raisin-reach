import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get total calls count
    const totalCalls = await prisma.callLog.count({
      where: { userId: user.id },
    });

    // Get calls this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const callsThisWeek = await prisma.callLog.count({
      where: {
        userId: user.id,
        callDate: {
          gte: oneWeekAgo,
        },
      },
    });

    // Get active leads (not WON or LOST)
    const activeLeads = await prisma.lead.count({
      where: {
        userId: user.id,
        status: {
          notIn: ['WON', 'LOST'],
        },
      },
    });

    // Get meetings scheduled
    const meetingsScheduled = await prisma.lead.count({
      where: {
        userId: user.id,
        status: 'MEETING_SCHEDULED',
      },
    });

    return NextResponse.json({
      totalCalls,
      callsThisWeek,
      activeLeads,
      meetingsScheduled,
    });
  } catch (error) {
    console.error('Error fetching portal stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
