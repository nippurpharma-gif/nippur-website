import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const applications = await db.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    const department = formData.get('department') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const cvFile = formData.get('cv') as File | null;

    if (!fullName || !email || !position) {
      return NextResponse.json({ error: 'Name, email, and position are required' }, { status: 400 });
    }

    let cvFileName = '';
    let cvFilePath = '';

    if (cvFile && cvFile.size > 0) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      cvFileName = `${Date.now()}-${cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      cvFilePath = path.join(uploadDir, cvFileName);
      await writeFile(cvFilePath, buffer);
    }

    const application = await db.application.create({
      data: {
        fullName,
        email,
        phone: phone || '',
        position,
        department: department || '',
        cvFileName,
        cvFilePath,
        coverLetter: coverLetter || '',
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const application = await db.application.update({
      where: { id },
      data,
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}