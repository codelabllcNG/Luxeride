import React from 'react';
import { getMobilityPageData, getMobilityEquipment } from '@/lib/api/mobility';
import MobilityView from '@/components/equipment/MobilityView';

export const dynamic = 'force-dynamic';

export default async function Page() {

  const [pageData, equipmentList] = await Promise.all([
    getMobilityPageData(),
    getMobilityEquipment()
  ]);

  if (!pageData) {
    return (
      <div className="min-h-screen bg-dark pt-36 flex items-center justify-center text-grey-pastel">
        <h1 className="text-2xl">Unable to load page content</h1>
      </div>
    );
  }

  // Pass data to the client component
  return <MobilityView pageData={pageData} equipmentList={equipmentList} />;
}