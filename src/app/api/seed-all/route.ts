import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Seed partners
    const partnerCount = await db.partner.count();
    if (partnerCount === 0) {
      await db.partner.createMany({
        data: [
          { nameEn: 'European API Suppliers', nameAr: 'موردي المواد الفعالة الأوروبيين', description: 'Strategic Partner', sortOrder: 1 },
          { nameEn: 'Iraqi Ministry of Health', nameAr: 'وزارة الصحة العراقية', description: 'Strategic Partner', sortOrder: 2 },
          { nameEn: 'University of Baghdad', nameAr: 'جامعة بغداد', description: 'Strategic Partner', sortOrder: 3 },
          { nameEn: 'International Pharma Partners', nameAr: 'شركاء الصيدلة الدوليين', description: 'Strategic Partner', sortOrder: 4 },
          { nameEn: 'Healthcare Distributors Network', nameAr: 'شبكة موزعي الرعاية الصحية', description: 'Strategic Partner', sortOrder: 5 },
          { nameEn: 'Regional Medical Institutions', nameAr: 'المؤسسات الطبية الإقليمية', description: 'Strategic Partner', sortOrder: 6 },
        ],
      });
    }

    // Seed jobs
    const jobCount = await db.jobPosition.count();
    if (jobCount === 0) {
      await db.jobPosition.createMany({
        data: [
          {
            titleEn: 'Quality Assurance Manager',
            titleAr: 'مدير ضمان الجودة',
            departmentEn: 'Quality',
            departmentAr: 'الجودة',
            location: 'Baghdad',
            type: 'Full-time',
            descriptionEn: 'Lead our QA team to ensure GMP compliance across all manufacturing operations.',
            descriptionAr: 'قيادة فريق ضمان الجودة لضمان الامتثال لمتطلبات GMP في جميع عمليات التصنيع.',
            applicationEmail: 'hr@nippurpharma.iq',
            sortOrder: 1,
          },
          {
            titleEn: 'Pharmaceutical Research Scientist',
            titleAr: 'عالم أبحاث صيدلانية',
            departmentEn: 'R&D',
            departmentAr: 'البحث والتطوير',
            location: 'Baghdad',
            type: 'Full-time',
            descriptionEn: 'Conduct research and development of new pharmaceutical formulations and products.',
            descriptionAr: 'إجراء البحث والتطوير لتركيبات ومنتجات صيدلانية جديدة.',
            applicationEmail: 'hr@nippurpharma.iq',
            sortOrder: 2,
          },
          {
            titleEn: 'Production Supervisor',
            titleAr: 'مشرف الإنتاج',
            departmentEn: 'Manufacturing',
            departmentAr: 'التصنيع',
            location: 'Baghdad',
            type: 'Full-time',
            descriptionEn: 'Oversee daily production operations and ensure adherence to quality standards.',
            descriptionAr: 'الإشراف على العمليات الإنتاجية اليومية وضمان الالتزام بمعايير الجودة.',
            applicationEmail: 'hr@nippurpharma.iq',
            sortOrder: 3,
          },
          {
            titleEn: 'Regulatory Affairs Specialist',
            titleAr: 'أخصائي الشؤون التنظيمية',
            departmentEn: 'Regulatory',
            departmentAr: 'الشؤون التنظيمية',
            location: 'Baghdad',
            type: 'Full-time',
            descriptionEn: 'Manage product registration and regulatory compliance with Iraqi and international authorities.',
            descriptionAr: 'إدارة تسجيل المنتجات والامتثال التنظيمي مع السلطات العراقية والدولية.',
            applicationEmail: 'hr@nippurpharma.iq',
            sortOrder: 4,
          },
        ],
      });
    }

    // Seed site settings
    const settingsCount = await db.siteSettings.count();
    if (settingsCount === 0) {
      await db.siteSettings.create({
        data: {
          id: 1,
          companyNameEn: 'NIPPUR Pharma',
          companyNameAr: 'نيبور فارما',
          logoUrl: '/images/logo-nippur.png',
          email: 'info@nippurpharma.iq',
          phone: '+964 XXX XXX XXXX',
          address: 'Baghdad, Iraq',
          workingHours: 'Sunday - Thursday: 8:00 AM - 5:00 PM',
          emergencyPhone: '+964 XXX XXX XXXX',
          descriptionEn: 'NIPPUR Pharma — Iraq\'s next-generation pharmaceutical manufacturer, combining ancient Mesopotamian heritage with cutting-edge European GMP technology.',
          descriptionAr: 'نيبور فارما — صانع الأدوية العراقي من الجيل التالي، يجمع بين تراث بلاد ما بين النهرين القديم وتكنولوجيا GMP الأوروبية المتطورة.',
        },
      });
    }

    return NextResponse.json({ message: 'All data seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}