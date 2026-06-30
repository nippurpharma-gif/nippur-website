import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let settings = await db.siteSettings.findUnique({ where: { id: 1 } });

    if (!settings) {
      settings = await db.siteSettings.create({
        data: { id: 1 },
      });
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const settings = await db.siteSettings.upsert({
      where: { id: 1 },
      update: body,
      create: { id: 1, ...body },
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}