import { HomePage } from '@/components/layout/HomePage';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { getHomePageData } from '@/lib/home-data';

export const revalidate = 120;

export default async function Home() {
  const data = await getHomePageData();

  return (
    <>
      <OrganizationJsonLd settings={data.settings} />
      <HomePage data={data} />
    </>
  );
}
