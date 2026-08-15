import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const db = new PrismaClient();

const products = [
  {
    nameEn: 'Cefalexin 500mg',
    nameAr: 'سيفالكسين 500 مجم',
    categoryEn: 'Cephalosporins',
    categoryAr: 'سيفالوسبورين',
    formEn: 'Capsules',
    formAr: 'كبسولات',
    strengthEn: '500mg',
    strengthAr: '500 مجم',
    packagingEn: '10 capsules / box',
    packagingAr: '10 كبسولات / علبة',
    descEn: 'First-generation cephalosporin antibiotic for treating bacterial infections.',
    descAr: 'مضاد حيوي من الجيل الأول للسيفالوسبورين لعلاج العدوى البكتيرية.',
    sortOrder: 1,
  },
  {
    nameEn: 'Ceftriaxone 1g',
    nameAr: 'سيفترياكسون 1 جم',
    categoryEn: 'Injectables',
    categoryAr: 'حقن',
    formEn: 'Injection',
    formAr: 'حقن',
    strengthEn: '1g',
    strengthAr: '1 جم',
    packagingEn: '1 vial / box',
    packagingAr: '1 قارورة / علبة',
    descEn: 'Third-generation cephalosporin for severe bacterial infections.',
    descAr: 'مضاد حيوي من الجيل الثالث للعدوى البكتيرية الشديدة.',
    sortOrder: 2,
  },
  {
    nameEn: 'Cefixime 400mg',
    nameAr: 'سيفيكسيم 400 مجم',
    categoryEn: 'Cephalosporins',
    categoryAr: 'سيفالوسبورين',
    formEn: 'Tablets',
    formAr: 'أقراص',
    strengthEn: '400mg',
    strengthAr: '400 مجم',
    packagingEn: '10 tablets / box',
    packagingAr: '10 أقراص / علبة',
    descEn: 'Oral cephalosporin for respiratory and urinary tract infections.',
    descAr: 'سيفالوسبورين فموي لعدوى الجهاز التنفسي والمسالك البولية.',
    sortOrder: 3,
  },
  {
    nameEn: 'Ceftazidime 1g',
    nameAr: 'سيفتازيديم 1 جم',
    categoryEn: 'Injectables',
    categoryAr: 'حقن',
    formEn: 'Injection',
    formAr: 'حقن',
    strengthEn: '1g',
    strengthAr: '1 جم',
    packagingEn: '1 vial / box',
    packagingAr: '1 قارورة / علبة',
    descEn: 'Third-generation cephalosporin effective against pseudomonas infections.',
    descAr: 'مضاد حيوي من الجيل الثالث فعال ضد عدوى السودوموناس.',
    sortOrder: 4,
  },
  {
    nameEn: 'Chloramphenicol Eye Drops',
    nameAr: 'قطرات كلورامفينيكول العينية',
    categoryEn: 'Eye Drops',
    categoryAr: 'قطرات عينية',
    formEn: 'Eye Drops',
    formAr: 'قطرات عينية',
    strengthEn: '0.5%',
    strengthAr: '0.5%',
    packagingEn: '10ml bottle',
    packagingAr: '10 مل زجاجة',
    descEn: 'Broad-spectrum antibiotic eye drops for treating ocular infections.',
    descAr: 'قطرات عينية مضادة حيوية واسعة الطيف لعلاج العدوى العينية.',
    sortOrder: 5,
  },
  {
    nameEn: 'Diclofenac Sodium Ampoules',
    nameAr: 'أمبولات ديكلوفيناك الصوديوم',
    categoryEn: 'Ampoules',
    categoryAr: 'أمبولات',
    formEn: 'Ampoule',
    formAr: 'أمبولة',
    strengthEn: '75mg/3ml',
    strengthAr: '75 مجم/3 مل',
    packagingEn: '5 ampoules / box',
    packagingAr: '5 أمبولات / علبة',
    descEn: 'Non-steroidal anti-inflammatory drug for pain management.',
    descAr: 'مضاد التهاب غير ستيرويدي لإدارة الألم.',
    sortOrder: 6,
  },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@nippurpharma.iq').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (password && password.length >= 10) {
    const existing = await db.adminUser.findUnique({ where: { email } });
    if (!existing) {
      await db.adminUser.create({
        data: {
          email,
          name: 'Administrator',
          passwordHash: hashPassword(password),
          role: 'admin',
          isActive: true,
        },
      });
      console.log(`Seeded admin user: ${email}`);
    }
  } else if (process.env.NODE_ENV !== 'production') {
    const existing = await db.adminUser.findUnique({ where: { email } });
    if (!existing) {
      await db.adminUser.create({
        data: {
          email,
          name: 'Administrator',
          passwordHash: hashPassword('ChangeMeNow1'),
          role: 'admin',
          isActive: true,
        },
      });
      console.warn('Seeded dev admin admin@nippurpharma.iq / ChangeMeNow1 — change immediately.');
    }
  }

  const count = await db.product.count();
  if (count === 0) {
    await db.product.createMany({ data: products });
    console.log(`Seeded ${products.length} products`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
