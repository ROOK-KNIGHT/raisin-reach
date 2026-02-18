import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const outcome = searchParams.get('outcome');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {
      userId: user.id,
    };

    if (outcome && outcome !== 'all') {
      where.callOutcome = outcome;
    }

    if (search) {
      where.OR = [
        { prospectName: { contains: search, mode: 'insensitive' } },
        { prospectCompany: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch call logs with related lead info
    const calls = await prisma.callLog.findMany({
      where,
      include: {
        lead: {
          select: {
            id: true,
            companyName: true,
            status: true,
          },
        },
      },
      orderBy: { callDate: 'desc' },
    });

    return NextResponse.json(calls);
  } catch (error) {
    console.error('Error fetching calls:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
