import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const jobs = await db.jobPosition.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titleEn, titleAr, departmentEn, departmentAr, location, type, descriptionEn, descriptionAr, applicationEmail, sortOrder, isActive } = body;

    if (!titleEn || !titleAr) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const job = await db.jobPosition.create({
      data: {
        titleEn: titleEn || '',
        titleAr: titleAr || '',
        departmentEn: departmentEn || '',
        departmentAr: departmentAr || '',
        location: location || 'Baghdad',
        type: type || 'Full-time',
        descriptionEn: descriptionEn || '',
        descriptionAr: descriptionAr || '',
        applicationEmail: applicationEmail || '',
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const job = await db.jobPosition.update({
      where: { id },
      data,
    });

    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.jobPosition.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}