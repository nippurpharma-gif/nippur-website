import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const existing = await db.newsArticle.count();
    if (existing > 0) {
      return NextResponse.json({ message: 'Already seeded' });
    }

    const articles = [
      {
        titleEn: 'NIPPUR Pharma Receives GMP Certification',
        titleAr: 'نيبور فارما تحصل على شهادة GMP',
        excerptEn:
          'We are proud to announce that our manufacturing facility has received full GMP certification from the Iraqi FDA, marking a significant milestone in our commitment to quality and patient safety.',
        excerptAr:
          'نفخر بالإعلان عن حصول منشأة التصنيع لدينا على شهادة GMP كاملة من هيئة الدواء العراقية، وهو إنجاز مهم في التزامنا بالجودة وسلامة المرضى.',
        contentEn:
          'NIPPUR Pharma is proud to announce that our state-of-the-art manufacturing facility in Baghdad has successfully achieved full Good Manufacturing Practice (GMP) certification from the Iraqi Food and Drug Administration (FDA).',
        contentAr:
          'تفخر شركة نيبور فارما بالإعلان عن حصول منشأة التصنيع المتطورة في بغداد على شهادة تصنيع دوائي جيد (GMP) كاملة من هيئة الدواء العراقية والغذائية.',
        category: 'Achievement',
        date: '2024-12-15',
        imageUrl: '/images/quality-control.png',
        isPublished: true,
      },
      {
        titleEn: 'New Cephalosporin Production Line Inaugurated',
        titleAr: 'افتتاح خط إنتاج سيفالوسبورين الجديد',
        excerptEn:
          'Our new state-of-the-art cephalosporin production line is now operational, significantly increasing our manufacturing capacity for essential antibiotics.',
        excerptAr:
          'خط إنتاج السيفالوسبورين الجديد المتطور أصبح الآن تشغيلياً، مما يزيد بشكل كبير من قدرتنا التصنيعية للمضادات الحيوية الأساسية.',
        contentEn:
          'NIPPUR Pharma has officially inaugurated its new cephalosporin production line, representing a major expansion of our manufacturing capabilities.',
        contentAr:
          'أعلنت شركة نيبور فارما رسمياً عن افتتاح خط إنتاج السيفالوسبورين الجديد، الذي يمثل توسعاً كبيراً في قدراتنا التصنيعية.',
        category: 'Manufacturing',
        date: '2024-11-20',
        imageUrl: '/images/manufacturing-line.png',
        isPublished: true,
      },
    ];

    for (const article of articles) {
      await db.newsArticle.create({ data: article });
    }

    return NextResponse.json({ message: `Seeded ${articles.length} articles` });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
