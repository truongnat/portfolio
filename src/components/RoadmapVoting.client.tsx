'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Target,
  CheckCircle,
  Clock,
  Zap,
  ArrowRight,
  Plus,
  MessageSquare,
  Share2,
  Filter,
  Search,
  X,
  Heart,
  Star,
  Trophy,
  GitPullRequest,
} from 'lucide-react';
import {
  roadmapFeatures,
  roadmapStats,
  roadmapCategories,
  topBackers,
  milestones,
  votingTiers,
} from '@/lib/roadmap-voting-data';

export function RoadmapVotingClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const filteredFeatures = roadmapFeatures.filter((feature) => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || feature.status === selectedStatus;
    const matchesSearch =
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      proposed: 'bg-gray-900/30 text-gray-400 border-gray-700',
      voting: 'bg-blue-900/30 text-blue-400 border-blue-700',
      funded: 'bg-purple-900/30 text-purple-400 border-purple-700',
      'in-progress': 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
      review: 'bg-orange-900/30 text-orange-400 border-orange-700',
      completed: 'bg-green-900/30 text-green-400 border-green-700',
      rejected: 'bg-red-900/30 text-red-400 border-red-700',
    };
    return colors[status] || colors.proposed;
  };

  const getComplexityColor = (complexity: string) => {
    const colors: Record<string, string> = {
      trivial: 'text-green-400',
      small: 'text-blue-400',
      medium: 'text-yellow-400',
      large: 'text-orange-400',
      xl: 'text-red-400',
    };
    return colors[complexity] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -top-1/2 -left-1/4" />
          <div className="absolute w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl -bottom-1/2 -right-1/4" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              Community-Driven Development
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Roadmap Voting
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Vote on features you want to see. Your donations directly fund development. 
              Every vote shapes the future of this portfolio.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              <StatCard
                icon={Target}
                label="Total Features"
                value={roadmapStats.totalFeatures.toString()}
                color="blue"
              />
              <StatCard
                icon={CheckCircle}
                label="Completed"
                value={roadmapStats.completedFeatures.toString()}
                color="green"
              />
              <StatCard
                icon={DollarSign}
                label="Total Funded"
                value={`$${roadmapStats.totalFunded.toLocaleString()}`}
                color="purple"
              />
              <StatCard
                icon={Users}
                label="Active Voters"
                value={roadmapStats.activeVoters.toString()}
                color="pink"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voting Tiers */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Voting Tiers</h2>
        <p className="text-gray-400 text-center mb-12">
          Your donation amount determines voting power. Higher tiers get more votes and perks.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {votingTiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              className={`bg-gray-900/50 backdrop-blur border rounded-xl p-6 text-center ${
                tier.name === 'Gold' ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-gray-800'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">
                {tier.name === 'Supporter' && '🌱'}
                {tier.name === 'Bronze' && '🥉'}
                {tier.name === 'Silver' && '🥈'}
                {tier.name === 'Gold' && '🥇'}
                {tier.name === 'Platinum' && '💎'}
                {tier.name === 'Legendary' && '👑'}
              </div>
              <h3 className="font-semibold text-white mb-1">{tier.name}</h3>
              <p className="text-2xl font-bold text-blue-400 mb-2">${tier.amount}</p>
              <p className="text-sm text-gray-400 mb-3">{tier.votes} votes</p>
              <p className="text-xs text-gray-500">{tier.perk}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 items-center justify-between max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {roadmapCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="proposed">Proposed</option>
              <option value="voting">Voting</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredFeatures.map((feature, idx) => {
            const progress = (feature.currentAmount / feature.targetAmount) * 100;
            
            return (
              <motion.div
                key={feature.id}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(feature.status)}`}>
                    {feature.status.replace('-', ' ')}
                  </span>
                  <span className={`text-xs font-medium ${getComplexityColor(feature.complexity)}`}>
                    {feature.complexity}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{feature.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {feature.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="text-white font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        feature.status === 'completed'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">${feature.currentAmount} raised</span>
                    <span className="text-gray-500">${feature.targetAmount} goal</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Vote className="w-4 h-4" />
                    <span>{feature.votes} votes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{feature.estimatedHours}h</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>{feature.comments.length}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedFeature(feature.id);
                      setShowVoteModal(true);
                    }}
                    disabled={feature.status === 'completed' || feature.status === 'rejected'}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 disabled:from-gray-700 disabled:to-gray-600 text-white rounded-lg font-medium transition-all text-sm"
                  >
                    {feature.status === 'completed' ? 'Completed' : 'Vote'}
                  </button>
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Milestones */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Milestones</h2>
        <p className="text-gray-400 text-center mb-12">Key releases and their target dates.</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={milestone.id}
              className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{milestone.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  milestone.isCompleted
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-blue-900/30 text-blue-400'
                }`}>
                  {milestone.isCompleted ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{milestone.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Clock className="w-4 h-4" />
                <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{milestone.progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Backers */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Top Backers
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Amazing people and companies funding the future of this project.
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Backer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total Backed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Features</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {topBackers.map((backer) => (
                    <tr key={backer.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {backer.rank === 'legendary' ? (
                          <span className="text-2xl">👑</span>
                        ) : backer.rank === 'platinum' ? (
                          <span className="text-2xl">💎</span>
                        ) : backer.rank === 'gold' ? (
                          <span className="text-2xl">🥇</span>
                        ) : backer.rank === 'silver' ? (
                          <span className="text-2xl">🥈</span>
                        ) : (
                          <span className="text-2xl">🥉</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {backer.avatarUrl ? (
                            <img
                              src={backer.avatarUrl}
                              alt={backer.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-white">{backer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-purple-400">
                          ${backer.totalBacked.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-300">{backer.featuresBacked.length}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {backer.badges.slice(0, 3).map((badge, idx) => (
                            <span key={idx} className="text-sm" title={badge}>{badge}</span>
                          ))}
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="relative bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-2xl p-12 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Shape the Future</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Your vote matters! Support features you care about and watch them become reality.
            </p>
            <button
              onClick={() => setShowVoteModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105"
            >
              <Vote className="w-5 h-5" />
              Start Voting
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Vote Modal */}
      <AnimatePresence>
        {showVoteModal && (
          <VoteModal
            featureId={selectedFeature}
            onClose={() => {
              setShowVoteModal(false);
              setSelectedFeature(null);
            }}
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
    blue: 'from-blue-600 to-blue-400',
    green: 'from-green-600 to-green-400',
    purple: 'from-purple-600 to-purple-400',
    pink: 'from-pink-600 to-pink-400',
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

function VoteModal({ featureId, onClose }: { featureId: string | null; onClose: () => void }) {
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Vote for Feature</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Payment integration coming soon. For now, this is a demo of the roadmap voting system.
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">Selected Feature</p>
            <p className="text-white font-medium">{featureId || 'Any feature'}</p>
          </div>
          <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <p className="text-sm text-blue-300 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Your vote helps prioritize development
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg font-medium"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
