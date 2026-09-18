import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { mediaUrlSchema } from '@/lib/validation';
import { parseProductionStats } from '@/lib/production-stats';
import { MANAGED_SECTION_KEYS, parseHomepageSections } from '@/lib/homepage-sections';

const productionStatSchema = z.object({
  value: z.string().trim().min(1).max(24),
  unitEn: z.string().trim().max(80),
  unitAr: z.string().trim().max(80),
  labelEn: z.string().trim().min(1).max(120),
  labelAr: z.string().trim().min(1).max(120),
});

const homepageSectionSchema = z.object({
  key: z.enum(MANAGED_SECTION_KEYS),
  visible: z.boolean(),
  sortOrder: z.number().int().min(0).max(100),
});

const settingsSchema = z.object({
  companyNameEn: z.string().max(200).optional(),
  companyNameAr: z.string().max(200).optional(),
  logoUrl: mediaUrlSchema.optional().or(z.literal('')),
  email: z.string().email().max(200).optional().or(z.literal('')),
  phone: z.string().max(40).optional(),
  address: z.string().max(500).optional(),
  workingHours: z.string().max(200).optional(),
  emergencyPhone: z.string().max(40).optional(),
  descriptionEn: z.string().max(2000).optional(),
  descriptionAr: z.string().max(2000).optional(),
  productionStats: z.array(productionStatSchema).max(8).optional(),
  homepageSections: z.array(homepageSectionSchema).max(16).optional(),
});

function serializeSettings(row: {
  id: number;
  companyNameEn: string;
  companyNameAr: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  emergencyPhone: string;
  descriptionEn: string;
  descriptionAr: string;
  productionStats: unknown;
  homepageSections: unknown;
  updatedAt: Date;
}) {
  return {
    ...row,
    productionStats: parseProductionStats(row.productionStats),
    homepageSections: parseHomepageSections(row.homepageSections),
  };
}

export async function GET() {
  try {
    let settings = await db.siteSettings.findUnique({ where: { id: 1 } });

    if (!settings) {
      settings = await db.siteSettings.create({
        data: { id: 1 },
      });
    }

    return NextResponse.json(serializeSettings(settings));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
    }

    const { productionStats, homepageSections, ...rest } = parsed.data;
    const settings = await db.siteSettings.upsert({
      where: { id: 1 },
      update: {
        ...rest,
        ...(productionStats ? { productionStats } : {}),
        ...(homepageSections ? { homepageSections } : {}),
      },
      create: {
        id: 1,
        ...rest,
        ...(productionStats ? { productionStats } : {}),
        ...(homepageSections ? { homepageSections } : {}),
      },
    });

    revalidatePath('/');
    revalidatePath('/careers');
    revalidatePath('/news');
    return NextResponse.json(serializeSettings(settings));
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
