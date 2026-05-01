import { getAboutData } from '@/lib/api/about';
import AboutClient from '@/components/about/AboutClient';

export default async function AboutPage() {
  const aboutData = await getAboutData();
  return <AboutClient data={aboutData} />;
}