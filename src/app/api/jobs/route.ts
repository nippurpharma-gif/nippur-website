import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getAdminSession, requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { parseListQuery } from '@/lib/pagination';
import { slugify, uniqueSlugCandidate } from '@/lib/slug';

const optionalText = z.string().max(10000).optional().or(z.literal(''));

const jobSchema = z.object({
  slug: z.string().max(100).optional().or(z.literal('')),
  titleEn: z.string().min(1).max(200),
  titleAr: z.string().min(1).max(200),
  departmentEn: z.string().max(200).optional(),
  departmentAr: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  type: z.string().max(100).optional(),
  experienceLevel: z.string().max(120).optional().or(z.literal('')),
  descriptionEn: optionalText,
  descriptionAr: optionalText,
  responsibilitiesEn: optionalText,
  responsibilitiesAr: optionalText,
  requirementsEn: optionalText,
  requirementsAr: optionalText,
  offerEn: optionalText,
  offerAr: optionalText,
  applicationEmail: z.string().max(200).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

async function resolveSlug(preferred: string | undefined, titleEn: string, excludeId?: number) {
  const rows = await db.jobPosition.findMany({ select: { id: true, slug: true } });
  const existing = new Set(
    rows.filter((r) => r.id !== excludeId && r.slug).map((r) => r.slug as string),
  );
  const base = slugify((preferred || titleEn || 'job').trim());
  return uniqueSlugCandidate(base, existing);
}

function jobCreateData(
  data: z.infer<typeof jobSchema>,
  slug: string,
) {
  return {
    slug,
    titleEn: data.titleEn,
    titleAr: data.titleAr,
    departmentEn: data.departmentEn || '',
    departmentAr: data.departmentAr || '',
    location: data.location || 'Baghdad',
    type: data.type || 'Full-time',
    experienceLevel: data.experienceLevel || '',
    descriptionEn: data.descriptionEn || '',
    descriptionAr: data.descriptionAr || '',
    responsibilitiesEn: data.responsibilitiesEn || '',
    responsibilitiesAr: data.responsibilitiesAr || '',
    requirementsEn: data.requirementsEn || '',
    requirementsAr: data.requirementsAr || '',
    offerEn: data.offerEn || '',
    offerAr: data.offerAr || '',
    applicationEmail: data.applicationEmail || '',
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
  };
}

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
    const slug = await resolveSlug(data.slug, data.titleEn);
    const job = await db.jobPosition.create({ data: jobCreateData(data, slug) });

    revalidatePath('/');
    revalidatePath('/careers');
    revalidatePath(`/careers/${slug}`);
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

    const data = parsed.data;
    const existing = await db.jobPosition.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const titleEn = data.titleEn ?? existing.titleEn;
    const slug = await resolveSlug(data.slug ?? existing.slug ?? undefined, titleEn, Number(id));

    const job = await db.jobPosition.update({
      where: { id: Number(id) },
      data: { ...data, slug },
    });

    revalidatePath('/');
    revalidatePath('/careers');
    revalidatePath(`/careers/${slug}`);
    if (existing.slug && existing.slug !== slug) {
      revalidatePath(`/careers/${existing.slug}`);
    }
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
    revalidatePath('/');
    revalidatePath('/careers');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
