"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { 
  AwardIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  HeartIcon, 
  TargetIcon, 
  StarIcon,
  LucideIcon
} from 'lucide-react';
import { AboutData } from '@/lib/api/about';


const getIconForValue = (title: string): LucideIcon => {
  const normalized = title.toLowerCase();
  if (normalized.includes('safety')) return ShieldCheckIcon;
  if (normalized.includes('customer')) return HeartIcon;
  if (normalized.includes('excellence')) return TargetIcon;
  if (normalized.includes('reliability')) return ClockIcon;
  return StarIcon; 
};

interface AboutClientProps {
  data: AboutData;
}

export default function AboutClient({ data }: AboutClientProps) {
  const { 
    hero, 
    metrics_section, 
    our_story_section, 
    our_values_section, 
    meet_our_team_section, 
    cta_section 
  } = data;

  const mainStory = our_story_section[0];

  return (
    <main className="min-h-screen bg-dark pt-20">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {hero.background_image ? (
           <div className="absolute inset-0">
             <Image 
               src={hero.background_image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=800&fit=crop"} 
               alt="Background" 
               fill 
               className="object-cover opacity-20"
             />
             <div className="absolute inset-0 bg-linear-to-b from-dark/80 to-dark" />
           </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-grey-pastel mb-6">
              {hero.heading}
            </h1>
            <p className="text-xl text-grey-medium">
              {hero.subheading}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats / Metrics */}
      <section className="py-16 bg-dark-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics_section.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: index * 0.1 }} 
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.figure}
                </div>
                <div className="text-grey-medium">{stat.heading}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-grey-pastel mb-6">
                {mainStory.heading}
              </h2>
              <div className="space-y-4 text-grey-medium">
                {/* Handle newline characters from API data safely */}
                {mainStory.description.split(/\r\n|\n/).map((paragraph, i) => (
                   paragraph.trim() && <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }} 
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image 
                  src={mainStory.background_image} 
                  alt="Our Story Image" 
                  fill
                  className="object-cover" 
                />
              </div>
              
              {/* award badge  */}
              {mainStory.award_winning && mainStory.award_winning.length > 0 && (
                <div className="absolute -bottom-6 -left-6 bg-dark-charcoal rounded-xl p-6 border border-dark-lighter shadow-card">
                  <div className="flex items-center space-x-3">
                    <AwardIcon className="w-10 h-10 text-primary" />
                    <div>
                      <div className="font-semibold text-grey-pastel">
                        {mainStory.award_winning[0].title}
                      </div>
                      <div className="text-sm text-grey-medium">
                        {mainStory.award_winning[0].description}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-dark-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-grey-pastel mb-4">
                {our_values_section.heading}
             </h2>
             <p className="text-grey-medium max-w-2xl mx-auto">
                {our_values_section.description}
             </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {our_values_section.our_values.map((value, index) => {
              const Icon = getIconForValue(value.title);
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center p-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-grey-pastel mb-2">{value.title}</h3>
                    <p className="text-grey-medium text-sm">{value.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section (New) */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-grey-pastel mb-4">{meet_our_team_section.title}</h2>
            <p className="text-grey-medium">{meet_our_team_section.description}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {meet_our_team_section.team_members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-dark-charcoal rounded-2xl overflow-hidden border border-dark-lighter hover:border-primary/50 transition-colors">
                  <div className="aspect-4/5 relative">
                    <Image 
                      src={member.profile_image_url} 
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-grey-pastel">{member.name}</h3>
                    <p className="text-primary text-sm mt-1">{member.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-dark-charcoal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-grey-pastel mb-4">
            {cta_section.title}
          </h2>
          <p className="text-grey-medium mb-8 text-lg">
            {cta_section.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/limo-booking">
              <Button variant="primary" size="lg">Book a Limo</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}