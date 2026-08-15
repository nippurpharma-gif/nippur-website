import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession, requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { mediaUrlSchema } from '@/lib/validation';
import { parseListQuery } from '@/lib/pagination';

const partnerSchema = z.object({
  nameEn: z.string().min(1).max(200),
  nameAr: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  logoUrl: mediaUrlSchema.optional().or(z.literal('')),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    const { take, skip } = parseListQuery(request);
    const partners = await db.partner.findMany({
      where: session ? undefined : { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take,
      skip,
    });
    return NextResponse.json(partners);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = partnerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const data = parsed.data;
    const partner = await db.partner.create({
      data: {
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        description: data.description || '',
        logoUrl: data.logoUrl || '',
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
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

    const parsed = partnerSchema.partial().safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid partner data' }, { status: 400 });
    }

    const partner = await db.partner.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    return NextResponse.json(partner);
  } catch {
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
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

    await db.partner.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
