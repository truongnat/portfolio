'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gavel,
  Users,
  CheckCircle,
  ArrowRight,
  Code2,
  FileText,
  Calendar,
  DollarSign,
  Info,
} from 'lucide-react';
import { auctionSlots, reviewPackages, leaderboardData, faqData, auctionStats } from '@/lib/code-review-auction-data';

export function CodeReviewAuctionClient() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);

  const handleBidNow = (packageId: string, weekId?: string) => {
    setSelectedPackage(packageId);
    setSelectedWeek(weekId || null);
    setShowBidModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl -top-1/2 -left-1/4" />
          <div className="absolute w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl -bottom-1/2 -right-1/4" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/30 border border-amber-700/50 rounded-full text-amber-400 text-sm font-medium mb-6">
              <Gavel className="w-4 h-4" />
              Live Auction System
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-6">
              Code Review Auction
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Bid for exclusive code review slots. Get expert feedback on your code, 
              architecture, and best practices from a seasoned fullstack developer.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <StatCard
                icon={Calendar}
                label="Available Slots"
                value={auctionStats.availableSlots.toString()}
                color="amber"
              />
              <StatCard
                icon={Users}
                label="Happy Clients"
                value={auctionStats.totalBids.toString()}
                color="orange"
              />
              <StatCard
                icon={DollarSign}
                label="Avg Bid"
                value={`$${auctionStats.averageBid}`}
                color="red"
              />
              <StatCard
                icon={CheckCircle}
                label="Completed"
                value="100%"
                color="green"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: Gavel,
              title: 'Place Bid',
              description: 'Choose a package and bid on available slots',
              color: 'amber',
            },
            {
              icon: Calendar,
              title: 'Secure Slot',
              description: 'Complete payment to lock in your review week',
              color: 'orange',
            },
            {
              icon: Code2,
              title: 'Submit Code',
              description: 'Share your repository and specific concerns',
              color: 'red',
            },
            {
              icon: FileText,
              title: 'Get Feedback',
              description: 'Receive comprehensive review and recommendations',
              color: 'green',
            },
          ].map((step, idx) => (
            <motion.div
              key={step.title}
              className="relative bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {idx + 1}
              </div>
              <step.icon className={`w-10 h-10 text-${step.color}-400 mb-4`} />
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Review Packages */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Review Packages</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Choose the level of review that fits your needs. All packages include detailed written feedback.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviewPackages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border rounded-2xl p-8 ${
                pkg.popular ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-gray-800'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  ${pkg.price}
                </div>
                <p className="text-gray-500 text-sm mt-1">~{pkg.estimatedHours} hours</p>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBidNow(pkg.id)}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                Bid Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Available Slots */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4">Available Slots</h2>
        <p className="text-gray-400 mb-8">
          Select a week for your code review. Slots are limited to ensure quality.
        </p>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {auctionSlots.map((slot) => (
            <motion.div
              key={slot.id}
              className={`bg-gray-900/50 backdrop-blur border rounded-xl p-6 ${
                slot.status === 'active' ? 'border-green-500/50' : 'border-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-white">{slot.week}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    slot.status === 'active'
                      ? 'bg-green-900/30 text-green-400'
                      : slot.status === 'upcoming'
                      ? 'bg-blue-900/30 text-blue-400'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {slot.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available</span>
                  <span className="text-white font-medium">
                    {slot.availableSlots} / {slot.totalSlots}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      slot.availableSlots === 0
                        ? 'bg-gray-600'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${(slot.availableSlots / slot.totalSlots) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Starting at</span>
                  <span className="text-2xl font-bold text-amber-400">${slot.basePrice}</span>
                </div>
                <button
                  disabled={slot.availableSlots === 0}
                  onClick={() => handleBidNow('standard', slot.id)}
                  className={`w-full py-2 rounded-lg font-medium transition-all ${
                    slot.availableSlots > 0
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {slot.availableSlots > 0 ? 'Bid on This Slot' : 'Sold Out'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Top Bidders</h2>
        <p className="text-gray-400 text-center mb-8">
          Recognizing our most valued clients who invested in their code quality.
        </p>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Bidder</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total Bids</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {leaderboardData.map((entry) => (
                    <tr key={entry.bidderId} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {entry.rank <= 3 ? (
                            <span className="text-2xl">{entry.badge?.split(' ')[0]}</span>
                          ) : (
                            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-medium">
                              {entry.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-white">{entry.bidderName}</span>
                        {entry.badge && (
                          <span className="text-xs text-gray-500 ml-2">{entry.badge}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-300">{entry.totalBids}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-amber-400">${entry.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{entry.completedReviews}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" />
                {faq.question}
              </h3>
              <p className="text-gray-400">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="relative bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-700/50 rounded-2xl p-12 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Level Up Your Code?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join developers who've invested in their code quality and accelerated their growth.
            </p>
            <button
              onClick={() => handleBidNow('standard')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105"
            >
              <Gavel className="w-5 h-5" />
              Place Your Bid
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Bid Modal */}
      <AnimatePresence>
        {showBidModal && (
          <BidModal
            packageId={selectedPackage}
            weekId={selectedWeek}
            onClose={() => setShowBidModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    amber: 'from-amber-600 to-amber-400',
    orange: 'from-orange-600 to-orange-400',
    red: 'from-red-600 to-red-400',
    green: 'from-green-600 to-green-400',
  };

  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function BidModal({ packageId, weekId, onClose }: {
  packageId: string | null;
  weekId: string | null;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 max-w-lg w-full p-8"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-4">Place Your Bid</h3>
        <p className="text-gray-400 mb-6">
          Payment integration coming soon. For now, this is a demo of the auction system.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">Selected Package</p>
            <p className="text-white font-medium">{packageId || 'Standard'}</p>
          </div>
          {weekId && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">Selected Week</p>
              <p className="text-white font-medium">{weekId}</p>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-lg font-medium"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
