import { getContactPageData } from "@/lib/api/contact";
import ContactView from "@/components/contact/ContactView";

export default async function ContactPage() {

  const contactData = await getContactPageData();
  if (!contactData) {
    return <div className="text-grey-pastel text-center pt-20">Failed to load contact info.</div>;
  }

  return <ContactView data={contactData} />;
}
