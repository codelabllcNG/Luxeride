
import { getMovingPageData } from "@/lib/api/moving";
import MovingServicesView from "@/components/moving/MovingServiceView";

export default async function MovingServicesPage() {
  const data = await getMovingPageData();
  if (!data) {
    return (
      <div className="min-h-screen bg-dark pt-20 flex items-center justify-center text-grey-medium">
        <p>Unable to load moving services information.</p>
      </div>
    );
  }


  return <MovingServicesView data={data} />;
}