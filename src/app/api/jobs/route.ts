import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession, requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { parseListQuery } from '@/lib/pagination';

const jobSchema = z.object({
  titleEn: z.string().min(1).max(200),
  titleAr: z.string().min(1).max(200),
  departmentEn: z.string().max(200).optional(),
  departmentAr: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  type: z.string().max(100).optional(),
  descriptionEn: z.string().max(10000).optional(),
  descriptionAr: z.string().max(10000).optional(),
  applicationEmail: z.string().max(200).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    const { take, skip } = parseListQuery(request);
    const jobs = await db.jobPosition.findMany({
      where: session ? undefined : { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take,
      skip,
    });
    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const data = parsed.data;
    const job = await db.jobPosition.create({
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        departmentEn: data.departmentEn || '',
        departmentAr: data.departmentAr || '',
        location: data.location || 'Baghdad',
        type: data.type || 'Full-time',
        descriptionEn: data.descriptionEn || '',
        descriptionAr: data.descriptionAr || '',
        applicationEmail: data.applicationEmail || '',
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const parsed = jobSchema.partial().safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid job data' }, { status: 400 });
    }

    const job = await db.jobPosition.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.jobPosition.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
