export type HeroData = {
  heading: string;
  subheading: string;
  background_image: string;
};

export type Metric = {
  figure: string;
  heading: string;
};

export type StorySection = {
  heading: string;
  description: string;
  background_image: string;
  award_winning: {
    title: string;
    description: string;
  }[];
};

export type Value = {
  title: string;
  description: string;
};

export type TeamMember = {
  name: string;
  position: string;
  profile_image_url: string;
};

export type CtaSection = {
  title: string;
  description: string;
};

export type AboutData = {
  hero: HeroData;
  metrics_section: Metric[];
  our_story_section: StorySection[];
  our_values_section: {
    heading: string;
    description: string;
    our_values: Value[];
  };
  meet_our_team_section: {
    title: string;
    description: string;
    team_members: TeamMember[];
  };
  cta_section: CtaSection;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAboutData(): Promise<AboutData> {
  const res = await fetch(`${API_BASE_URL}/get-aboutus-data`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch about data');
  const json = await res.json();
  return json.data;
}