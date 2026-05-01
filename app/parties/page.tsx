import React from 'react';
import { getPartiesPageData } from '@/lib/api/parties';
import PartyView from '@/components/parties/PartyView';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let data = null;
  let error = false;

  try {
    const response = await getPartiesPageData();
    if (response.status === 'success') {
      data = response.data;
    } else {
      error = true;
    }
  } catch (e) {
    console.error(`Error fetching party data:`, e);
    error = true;
  }

  if (error || !data) {
    return <div className="text-center py-12 bg-dark-charcoal rounded-xl border border-dark-lighter">
      <p className="text-grey-medium">
        Failed to load party data.
      </p>
    </div>;
  }
  return <PartyView initialData={data} />;
}