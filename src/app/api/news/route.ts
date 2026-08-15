import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession, requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { mediaUrlSchema } from '@/lib/validation';
import { parseListQuery } from '@/lib/pagination';

const articleCreateSchema = z.object({
  titleEn: z.string().max(300).optional(),
  titleAr: z.string().max(300).optional(),
  excerptEn: z.string().max(2000).optional(),
  excerptAr: z.string().max(2000).optional(),
  contentEn: z.string().max(50000).optional(),
  contentAr: z.string().max(50000).optional(),
  category: z.string().max(100).optional(),
  date: z.string().max(40).optional(),
  imageUrl: mediaUrlSchema.optional().or(z.literal('')),
  isPublished: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    const { take, skip } = parseListQuery(request);
    const articles = await db.newsArticle.findMany({
      where: session ? undefined : { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = articleCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid article data' }, { status: 400 });
    }

    const data = parsed.data;
    const article = await db.newsArticle.create({
      data: {
        titleEn: data.titleEn || '',
        titleAr: data.titleAr || '',
        excerptEn: data.excerptEn || '',
        excerptAr: data.excerptAr || '',
        contentEn: data.contentEn || '',
        contentAr: data.contentAr || '',
        category: data.category || 'General',
        date: data.date || new Date().toISOString().split('T')[0],
        imageUrl: data.imageUrl || '',
        isPublished: data.isPublished ?? true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
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

    const parsed = articleCreateSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid article data' }, { status: 400 });
    }

    const article = await db.newsArticle.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
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

    await db.newsArticle.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
