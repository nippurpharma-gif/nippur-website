import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession, requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { mediaUrlSchema } from '@/lib/validation';
import { parseListQuery } from '@/lib/pagination';

const productSchema = z.object({
  nameEn: z.string().trim().min(1).max(200),
  nameAr: z.string().trim().min(1).max(200),
  categoryEn: z.string().trim().min(1).max(120),
  categoryAr: z.string().trim().min(1).max(120),
  formEn: z.string().trim().max(120).optional(),
  formAr: z.string().trim().max(120).optional(),
  strengthEn: z.string().trim().max(120).optional(),
  strengthAr: z.string().trim().max(120).optional(),
  packagingEn: z.string().trim().max(200).optional(),
  packagingAr: z.string().trim().max(200).optional(),
  descEn: z.string().trim().max(4000).optional(),
  descAr: z.string().trim().max(4000).optional(),
  leafletUrl: mediaUrlSchema.optional().or(z.literal('')),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    const { take, skip } = parseListQuery(request);
    const products = await db.product.findMany({
      where: session ? undefined : { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take,
      skip,
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }

    const data = parsed.data;
    const product = await db.product.create({
      data: {
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        categoryEn: data.categoryEn,
        categoryAr: data.categoryAr,
        formEn: data.formEn || '',
        formAr: data.formAr || '',
        strengthEn: data.strengthEn || '',
        strengthAr: data.strengthAr || '',
        packagingEn: data.packagingEn || '',
        packagingAr: data.packagingAr || '',
        descEn: data.descEn || '',
        descAr: data.descAr || '',
        leafletUrl: data.leafletUrl || '',
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
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

    const parsed = productSchema.partial().safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
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

    await db.product.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
