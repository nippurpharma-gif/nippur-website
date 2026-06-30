import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const existing = await db.newsArticle.count();
    if (existing > 0) {
      return NextResponse.json({ message: 'Already seeded' });
    }

    const articles = [
      {
        titleEn: 'NIPPUR Pharma Receives GMP Certification',
        titleAr: 'نيبور فارما تحصل على شهادة GMP',
        excerptEn: 'We are proud to announce that our manufacturing facility has received full GMP certification from the Iraqi FDA, marking a significant milestone in our commitment to quality and patient safety.',
        excerptAr: 'نفخر بالإعلان عن حصول منشأة التصنيع لدينا على شهادة GMP كاملة من هيئة الدواء العراقية، وهو إنجاز مهم في التزامنا بالجودة وسلامة المرضى.',
        contentEn: 'NIPPUR Pharma is proud to announce that our state-of-the-art manufacturing facility in Baghdad has successfully achieved full Good Manufacturing Practice (GMP) certification from the Iraqi Food and Drug Administration (FDA).\n\nThis certification represents years of dedicated effort in building a world-class pharmaceutical manufacturing infrastructure that meets the highest international standards. The certification covers all four of our manufacturing facilities.\n\n"This achievement is a testament to our team\'s unwavering commitment to quality and excellence," said the NIPPUR Pharma Management. "It positions us to deliver the highest quality pharmaceutical products to the Iraqi market and opens doors for international partnerships."',
        contentAr: 'تفخر شركة نيبور فارما بالإعلان عن حصول منشأة التصنيع المتطورة في بغداد على شهادة تصنيع دوائي جيد (GMP) كاملة من هيئة الدواء العراقية والغذائية.\n\nتمثل هذه الشهادة سنوات من الجهد المخصص لبناء بنية تحتية تصنيع دوائية عالمية المستوى.',
        category: 'Achievement',
        date: '2024-12-15',
        imageUrl: '/images/quality-control.png',
        isPublished: true,
      },
      {
        titleEn: 'New Cephalosporin Production Line Inaugurated',
        titleAr: 'افتتاح خط إنتاج سيفالوسبورين الجديد',
        excerptEn: 'Our new state-of-the-art cephalosporin production line is now operational, significantly increasing our manufacturing capacity for essential antibiotics.',
        excerptAr: 'خط إنتاج السيفالوسبورين الجديد المتطور أصبح الآن تشغيلياً، مما يزيد بشكل كبير من قدرتنا التصنيعية للمضادات الحيوية الأساسية.',
        contentEn: 'NIPPUR Pharma has officially inaugurated its new cephalosporin production line, representing a major expansion of our manufacturing capabilities. The new line features the latest European automation technology and is capable of producing over 50 million tablets annually.',
        contentAr: 'أعلنت شركة نيبور فارما رسمياً عن افتتاح خط إنتاج السيفالوسبورين الجديد، الذي يمثل توسعاً كبيراً في قدراتنا التصنيعية.',
        category: 'Manufacturing',
        date: '2024-11-20',
        imageUrl: '/images/manufacturing-line.png',
        isPublished: true,
      },
      {
        titleEn: 'NIPPUR Pharma at Arab Health Exhibition',
        titleAr: 'نيبور فارما في معرض الصحة العربية',
        excerptEn: 'NIPPUR Pharma showcased its products and manufacturing capabilities at the Arab Health Exhibition, connecting with international healthcare partners.',
        excerptAr: 'عرضت نيبور فارما منتجاتها وقدراتها التصنيعية في معرض الصحة العربية، وربطت علاقات مع شركاء رعاية صحية دوليين.',
        contentEn: 'NIPPUR Pharma participated in the prestigious Arab Health Exhibition, one of the largest healthcare events in the Middle East. Our booth featured our complete product portfolio and manufacturing capabilities.\n\nThe exhibition provided an excellent platform to connect with international pharmaceutical companies, distributors, and healthcare professionals.',
        contentAr: 'شاركت شركة نيبور فارما في معرض الصحة العربية المرموق، أحد أكبر فعاليات الرعاية الصحية في الشرق الأوسط.',
        category: 'Events',
        date: '2024-10-10',
        imageUrl: '/images/team.png',
        isPublished: true,
      },
      {
        titleEn: 'NIPPUR Pharma Signs European Technology Partnership',
        titleAr: 'نيبور فارما توقع شراكة تقنية مع شركة أوروبية',
        excerptEn: 'A new strategic partnership will bring advanced pharmaceutical manufacturing technology and expertise to Iraq\'s growing pharmaceutical sector.',
        excerptAr: 'شراكة استراتيجية جديدة ستجلب تقنيات وخبرات تصنيع دوائية متقدمة لقطاع الأدوية العراقي المتنامي.',
        contentEn: 'NIPPUR Pharma has signed a strategic technology partnership agreement with a leading European pharmaceutical equipment manufacturer to enhance manufacturing capabilities through advanced production technologies.',
        contentAr: 'وقعت شركة نيبور فارما اتفاقية شراكة تقنية استراتيجية مع شركة رائدة في تصنيع المعدات الدوائية الأوروبية.',
        category: 'Partnership',
        date: '2024-09-05',
        imageUrl: '/images/research-lab.png',
        isPublished: true,
      },
    ];

    for (const article of articles) {
      await db.newsArticle.create({ data: article });
    }

    return NextResponse.json({ message: `Seeded ${articles.length} articles` });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}