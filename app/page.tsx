
import { HeroSection } from '../components/home/HeroSection';
import { ServiceSplit } from '../components/home/ServiceSplit';
import { MarketplaceFeatured } from '../components/home/MarketplaceFeatured';
import { TrustSection } from '../components/home/TrustSection';
import { FleetSearchSection } from '../components/home/FleetSearchSection';
import { HomeClient } from '@/components/home/HomeClient';
import { getHomeData } from '../lib/api/home';
export default async function HomePage() {
  const response = await getHomeData();
  if (response.status !== 'success') {
    throw new Error('Failed to load home data');
  }
  const { data } = response;

  return (
    <main className="min-h-screen bg-dark">
      <HeroSection hero={data.hero} />
      <ServiceSplit services={data.services}/>
      <MarketplaceFeatured vehicles={data.featured_vehicles} />
      {/* <FleetSearchSection /> */}
      <TrustSection features={data.why_choose_us.features} />
      <HomeClient />
    </main>
  );
}