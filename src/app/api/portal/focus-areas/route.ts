import { NextRequest, NextResponse } from 'next/server';
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

    // Fetch focus areas
    const focusAreas = await prisma.focusArea.findMany({
      where: { userId: user.id },
      orderBy: [
        { isActive: 'desc' }, // Active first
        { priority: 'desc' }, // Then by priority
        { createdAt: 'desc' }, // Then by creation date
      ],
    });

    return NextResponse.json(focusAreas);
  } catch (error) {
    console.error('Error fetching focus areas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, description, targetIndustry, targetCompanySize, targetLocation, priority } = body;

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create focus area
    const focusArea = await prisma.focusArea.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        targetIndustry: targetIndustry?.trim() || null,
        targetCompanySize: targetCompanySize?.trim() || null,
        targetLocation: targetLocation?.trim() || null,
        priority: priority || 'MEDIUM',
        isActive: true,
        targetJobTitles: [], // Empty array for now, can be extended later
      },
    });

    return NextResponse.json({
      success: true,
      focusArea,
    });
  } catch (error) {
    console.error('Error creating focus area:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
