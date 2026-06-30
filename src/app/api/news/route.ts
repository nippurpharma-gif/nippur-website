import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const articles = await db.newsArticle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titleEn, titleAr, excerptEn, excerptAr, contentEn, contentAr, category, date, imageUrl, isPublished } = body;

    const article = await db.newsArticle.create({
      data: {
        titleEn: titleEn || '',
        titleAr: titleAr || '',
        excerptEn: excerptEn || '',
        excerptAr: excerptAr || '',
        contentEn: contentEn || '',
        contentAr: contentAr || '',
        category: category || 'General',
        date: date || new Date().toISOString().split('T')[0],
        imageUrl: imageUrl || '',
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const article = await db.newsArticle.update({
      where: { id },
      data,
    });

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.newsArticle.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}