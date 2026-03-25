'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug,
  Shield,
  Trophy,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  ThumbsUp,
  Lock,
  X,
  Target,
  BookOpen,
} from 'lucide-react';
import {
  bugBountyProgram,
  bountyRewards,
  hallOfFameData,
  bugBountyStats,
  knownQuirks,
  submissionGuidelines,
} from '@/lib/bug-bounty-data';

export function BugBountyClient() {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl -top-1/2 -left-1/4" />
          <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl -bottom-1/2 -right-1/4" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700/50 rounded-full text-green-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Active Bounty Program
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
              Bug Bounty Program
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Help me find bugs and security vulnerabilities. Earn bounties up to $1000 
              and get recognized in the Hall of Fame.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
              <StatCard
                icon={Bug}
                label="Reports"
                value={bugBountyStats.totalReports.toString()}
                color="green"
              />
              <StatCard
                icon={CheckCircle}
                label="Resolved"
                value={bugBountyStats.resolvedReports.toString()}
                color="emerald"
              />
              <StatCard
                icon={DollarSign}
                label="Bounty Paid"
                value={`$${bugBountyStats.totalBountyPaid}`}
                color="teal"
              />
              <StatCard
                icon={Users}
                label="Researchers"
                value={bugBountyStats.activeResearchers.toString()}
                color="cyan"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105"
              >
                <Bug className="w-5 h-5" />
                Report a Bug
              </button>
              <a
                href="#hall-of-fame"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-all"
              >
                <Trophy className="w-5 h-5" />
                Hall of Fame
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bounty Rewards */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Bounty Rewards</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Rewards are based on severity and impact. Critical security issues receive the highest bounties.
        </p>

        <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {bountyRewards.map((reward, idx) => (
            <motion.div
              key={reward.severity}
              className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border rounded-xl p-6 ${
                reward.severity === 'critical' ? 'border-red-500 shadow-lg shadow-red-500/20' :
                reward.severity === 'high' ? 'border-orange-500' :
                reward.severity === 'medium' ? 'border-yellow-500' :
                reward.severity === 'low' ? 'border-blue-500' :
                'border-gray-700'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`text-sm font-semibold mb-2 capitalize ${
                reward.severity === 'critical' ? 'text-red-400' :
                reward.severity === 'high' ? 'text-orange-400' :
                reward.severity === 'medium' ? 'text-yellow-400' :
                reward.severity === 'low' ? 'text-blue-400' :
                'text-gray-400'
              }`}>
                {reward.severity}
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                ${reward.minAmount} - ${reward.maxAmount}
              </div>
              <p className="text-gray-400 text-sm">{reward.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Program Info */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Rules */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-green-400" />
              Program Rules
            </h3>
            <ul className="space-y-3">
              {bugBountyProgram.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Out of Scope */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-red-400" />
              Out of Scope
            </h3>
            <ul className="space-y-3">
              {bugBountyProgram.outOfScope.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Known Quirks */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Known Quirks</h2>
        <p className="text-gray-400 text-center mb-8">
          Issues we're already aware of. No need to report these, but you can upvote to prioritize!
        </p>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {knownQuirks.map((quirk) => (
            <motion.div
              key={quirk.id}
              className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{quirk.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  quirk.severity === 'known' ? 'bg-blue-900/30 text-blue-400' :
                  quirk.severity === 'wontfix' ? 'bg-gray-800 text-gray-400' :
                  'bg-green-900/30 text-green-400'
                }`}>
                  {quirk.severity}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{quirk.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{quirk.component}</span>
                <button className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors text-sm">
                  <ThumbsUp className="w-4 h-4" />
                  {quirk.upvotes}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Submission Guidelines</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {submissionGuidelines.map((guideline, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold mb-4">
                {idx + 1}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{guideline.title}</h3>
              <p className="text-gray-400 text-sm">{guideline.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hall of Fame */}
      <section id="hall-of-fame" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Hall of Fame
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Recognizing our amazing security researchers and bug hunters.
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Researcher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Bugs Found</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Bounty Earned</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {hallOfFameData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.rank <= 3 ? (
                          <span className="text-2xl">
                            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-medium">
                            {entry.rank}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {entry.reporterAvatar ? (
                            <img
                              src={entry.reporterAvatar}
                              alt={entry.reporterName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-white">{entry.reporterName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-300">{entry.totalBugs}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-green-400">${entry.totalBounty}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.badge && (
                          <span className="text-sm text-gray-400">{entry.badge}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="relative bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-700/50 rounded-2xl p-12 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Hunt Some Bugs?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Your reports help make this portfolio better and more secure for everyone. 
              Start exploring and earn rewards!
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105"
            >
              <Bug className="w-5 h-5" />
              Submit a Bug Report
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <SubmitBugModal onClose={() => setShowSubmitModal(false)} />
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
    green: 'from-green-600 to-green-400',
    emerald: 'from-emerald-600 to-emerald-400',
    teal: 'from-teal-600 to-teal-400',
    cyan: 'from-cyan-600 to-cyan-400',
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

function SubmitBugModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Submit Bug Report</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
            <p className="text-green-300 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Your report will be kept private until resolved.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bug Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Brief description of the issue"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="info">Info</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="security">Security</option>
                  <option value="functionality">Functionality</option>
                  <option value="performance">Performance</option>
                  <option value="ui-ux">UI/UX</option>
                  <option value="content">Content</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Steps to Reproduce</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="1. Go to...&#10;2. Click on...&#10;3. Notice that..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expected Behavior</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="What should happen?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Actual Behavior</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="What actually happened?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proof of Concept (optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Code snippets, URLs, or description of attached files"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-green-500 focus:ring-green-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-300">
                I agree to have my name displayed in the Hall of Fame (optional)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-lg font-medium transition-all"
            >
              Submit Report
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            By submitting, you agree to the program rules and responsible disclosure policy.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

