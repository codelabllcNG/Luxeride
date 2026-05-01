import { getCityToursData } from '@/lib/api/tours';
import CityToursView from '@/components/tours/CityTourView';

export default async function CityToursPage() {
 
  const data = await getCityToursData();

  if (!data) {
    return (
      <div className="min-h-screen bg-dark pt-36 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-grey-pastel mb-2">Unavailable</h1>
          <p className="text-grey-medium">Unable to load tour data at this time.</p>
        </div>
      </div>
    );
  }

  return <CityToursView data={data} />;
}