import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const partners = await db.partner.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(partners);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameEn, nameAr, description, logoUrl, sortOrder, isActive } = body;

    if (!nameEn || !nameAr) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const partner = await db.partner.create({
      data: {
        nameEn: nameEn || '',
        nameAr: nameAr || '',
        description: description || '',
        logoUrl: logoUrl || '',
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const partner = await db.partner.update({
      where: { id },
      data,
    });

    return NextResponse.json(partner);
  } catch {
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.partner.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}