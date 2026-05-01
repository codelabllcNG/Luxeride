import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { CarIcon, MessageSquareIcon, DollarSignIcon, TrendingUpIcon, EditIcon, EyeIcon, SettingsIcon } from 'lucide-react';
const mockStats = [{
  icon: CarIcon,
  label: 'Active Listings',
  value: '3'
}, {
  icon: MessageSquareIcon,
  label: 'New Enquiries',
  value: '12'
}, {
  icon: DollarSignIcon,
  label: 'This Month',
  value: '$2,450'
}, {
  icon: TrendingUpIcon,
  label: 'Profile Views',
  value: '156'
}];
const mockListings = [{
  name: 'Lincoln Continental Stretch',
  status: 'Active',
  enquiries: 5,
  views: 48
}, {
  name: 'Cadillac Escalade ESV',
  status: 'Active',
  enquiries: 4,
  views: 32
}, {
  name: 'Mercedes Sprinter',
  status: 'Pending',
  enquiries: 3,
  views: 28
}];
export function DashboardPreview() {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.6
  }} className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-grey-pastel mb-2">
          Your Owner <span className="text-primary">Dashboard</span>
        </h2>
        <p className="text-grey-medium">
          Manage your listings, track enquiries, and grow your business
        </p>
      </div>

      {/* Dashboard Preview */}
      <div className="bg-dark-charcoal rounded-2xl p-6 border border-dark-lighter">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {mockStats.map((stat, index) => <Card key={index} className="bg-dark-lighter">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold text-grey-pastel">
                    {stat.value}
                  </div>
                  <div className="text-xs text-grey-medium">{stat.label}</div>
                </div>
              </div>
            </Card>)}
        </div>

        {/* Listings Table */}
        <div className="bg-dark rounded-xl overflow-hidden">
          <div className="p-4 border-b border-dark-lighter flex items-center justify-between">
            <h3 className="font-semibold text-grey-pastel">Your Listings</h3>
            <button className="text-sm text-primary hover:underline">
              + Add New
            </button>
          </div>
          <div className="divide-y divide-dark-lighter">
            {mockListings.map((listing, index) => <div key={index} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-grey-pastel">
                    {listing.name}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`
                      text-xs px-2 py-0.5 rounded
                      ${listing.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                    `}>
                      {listing.status}
                    </span>
                    <span className="text-xs text-grey-medium">
                      {listing.enquiries} enquiries
                    </span>
                    <span className="text-xs text-grey-medium">
                      {listing.views} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg text-grey-medium hover:text-primary hover:bg-dark-lighter transition-colors">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-grey-medium hover:text-primary hover:bg-dark-lighter transition-colors">
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-grey-medium hover:text-primary hover:bg-dark-lighter transition-colors">
                    <SettingsIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>)}
          </div>
        </div>

        {/* Overlay */}
        <div className="mt-4 text-center text-sm text-grey-medium">
          <span className="text-primary">Preview only</span> — Register to
          access your full dashboard
        </div>
      </div>
    </motion.div>;
}