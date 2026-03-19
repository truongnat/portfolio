'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  Check, 
  Heart, 
  TrendingUp, 
  Zap,
  Sparkles,
  X,
  Users,
  Award
} from 'lucide-react';
import { skillTreeData, badges } from '@/lib/skill-tree-data';
import type { SkillNode } from '@/types/skill-tree';
import confetti from 'canvas-confetti';

interface SkillNodeProps {
  skill: SkillNode;
  onClick: (skill: SkillNode) => void;
}

const statusColors = {
  locked: 'bg-gray-800 border-gray-700 text-gray-500',
  funding: 'bg-blue-900/50 border-blue-500 text-blue-400',
  unlocked: 'bg-violet-900/50 border-violet-500 text-violet-400',
  completed: 'bg-green-900/50 border-green-500 text-green-400',
  mastered: 'bg-amber-900/50 border-amber-500 text-amber-400',
};

const categoryIcons = {
  'ai-ml': Zap,
  'database': TrendingUp,
  'security': Lock,
  'devops': Zap,
  'architecture': TrendingUp,
  'frontend': Sparkles,
  'mobile': Zap,
  'backend': TrendingUp,
};

function SkillNodeComponent({ skill, onClick }: SkillNodeProps) {
  const IconComponent = categoryIcons[skill.category] || Zap;
  const isClickable = skill.status !== 'locked' || skill.progress > 0;

  return (
    <motion.div
      className={`absolute cursor-pointer transition-all duration-300 ${
        isClickable ? 'hover:scale-110' : ''
      }`}
      style={{
        left: `${skill.position.x}%`,
        top: `${skill.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      whileHover={isClickable ? { scale: 1.15, zIndex: 50 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      onClick={() => isClickable && onClick(skill)}
    >
      {/* Connection lines will be rendered behind */}
      
      {/* Node circle */}
      <motion.div
        className={`relative w-20 h-20 rounded-full border-3 flex items-center justify-center ${
          statusColors[skill.status]
        } ${isClickable ? 'hover:shadow-lg hover:shadow-current/20' : ''}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        {/* Status indicator */}
        <div className="absolute -top-1 -right-1">
          {skill.status === 'locked' && (
            <Lock className="w-4 h-4 text-gray-600" />
          )}
          {skill.status === 'funding' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
            </motion.div>
          )}
          {skill.status === 'unlocked' && (
            <Unlock className="w-4 h-4 text-violet-400" />
          )}
          {skill.status === 'completed' && (
            <Check className="w-4 h-4 text-green-400" />
          )}
          {skill.status === 'mastered' && (
            <Award className="w-4 h-4 text-amber-400" />
          )}
        </div>

        {/* Skill icon */}
        <IconComponent className="w-8 h-8" />

        {/* Progress ring for funding status */}
        {skill.status === 'funding' && (
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-800"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${(skill.progress / 100) * 289} 289`}
              className="text-blue-500"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 289' }}
              animate={{ strokeDasharray: `${(skill.progress / 100) * 289} 289` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        )}
      </motion.div>

      {/* Skill name label */}
      <motion.div
        className="absolute top-24 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-semibold text-gray-300 drop-shadow-lg">
          {skill.name}
        </p>
        {skill.progress > 0 && skill.progress < 100 && (
          <p className="text-xs text-gray-500 mt-1">
            ${skill.totalDonated} / ${skill.cost}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

interface SkillDetailModalProps {
  skill: SkillNode;
  onClose: () => void;
  onDonate: (amount: number) => void;
}

function SkillDetailModal({ skill, onClose, onDonate }: SkillDetailModalProps) {
  const [customAmount, setCustomAmount] = useState('');

  const presetAmounts = [10, 25, 50, 100];

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${statusColors[skill.status]}`}>
              {skill.status === 'completed' ? (
                <Check className="w-8 h-8" />
              ) : skill.status === 'locked' ? (
                <Lock className="w-8 h-8" />
              ) : (
                <Unlock className="w-8 h-8" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{skill.name}</h2>
              <p className="text-gray-400 capitalize">{skill.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-gray-300">{skill.description}</p>

          {/* Progress */}
          {skill.status !== 'locked' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-semibold">{skill.progress}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    skill.status === 'completed' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-blue-500 to-violet-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>${skill.totalDonated} donated</span>
                <span>${skill.cost} goal</span>
              </div>
            </div>
          )}

          {/* Milestones */}
          {skill.metadata?.milestones && (
            <div className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Check className="w-4 h-4" />
                Milestones
              </h3>
              <div className="space-y-2">
                {skill.metadata.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      milestone.completed ? 'bg-green-900/20' : 'bg-gray-800/50'
                    }`}
                  >
                    <div className={`mt-0.5 ${
                      milestone.completed ? 'text-green-400' : 'text-gray-600'
                    }`}>
                      {milestone.completed ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        milestone.completed ? 'text-green-300' : 'text-gray-300'
                      }`}>
                        {milestone.title}
                      </p>
                      <p className="text-xs text-gray-500">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unlocked by */}
          {skill.unlockedBy && skill.unlockedBy.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4" />
                Unlocked by
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.unlockedBy.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-violet-900/30 text-violet-300 rounded-full text-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Donate section */}
          {skill.status !== 'completed' && (
            <div className="space-y-4 pt-4 border-t border-gray-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Support this skill
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => onDonate(amount)}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all hover:scale-105"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Custom amount"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  onClick={() => customAmount && onDonate(Number(customAmount))}
                  className="px-6 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all hover:scale-105"
                >
                  Donate
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Your donation will help unlock this learning path. You'll receive a certificate and badge!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SkillTreeClient() {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredSkills = useMemo(() => {
    if (filterCategory === 'all') return skillTreeData.skills;
    return skillTreeData.skills.filter((s) => s.category === filterCategory);
  }, [filterCategory]);

  const handleDonate = (amount: number) => {
    // Fire confetti!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    console.log(`Donating $${amount} to skill: ${selectedSkill?.name}`);
    
    // Simulate successful donation
    setTimeout(() => {
        setSelectedSkill(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl -top-1/2 -left-1/4" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -bottom-1/2 -right-1/4" />
      </div>

      {/* Header */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Skill Tree
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Support my learning journey. Unlock skills, earn badges, and get exclusive certificates.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
            {[
              { label: 'Total Skills', value: skillTreeData.stats.totalSkills, icon: Zap },
              { label: 'Unlocked', value: skillTreeData.stats.unlockedSkills, icon: Unlock },
              { label: 'Total Donated', value: `$${skillTreeData.stats.totalDonated}`, icon: Heart },
              { label: 'Completion', value: `${skillTreeData.stats.completionPercentage}%`, icon: TrendingUp },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <stat.icon className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          {skillTreeData.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                filterCategory === cat.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Skill tree visualization */}
        <div className="relative aspect-[4/3] max-h-[600px] bg-gray-900/30 backdrop-blur rounded-2xl border border-gray-800 overflow-hidden">
          {/* Connection lines (simplified - in production use d3 or similar) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {skillTreeData.skills.map((skill) =>
              skill.prerequisites.map((prereqId) => {
                const prereq = skillTreeData.skills.find((s) => s.id === prereqId);
                if (!prereq) return null;
                return (
                  <motion.line
                    key={`${prereq.id}-${skill.id}`}
                    x1={`${prereq.position.x}%`}
                    y1={`${prereq.position.y}%`}
                    x2={`${skill.position.x}%`}
                    y2={`${skill.position.y}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                );
              })
            )}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Skill nodes */}
          {filteredSkills.map((skill) => (
            <SkillNodeComponent
              key={skill.id}
              skill={skill}
              onClick={setSelectedSkill}
            />
          ))}
        </div>

        {/* Badges section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Earn Badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {badges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center bg-${badge.color}-900/30`}>
                  <Award className={`w-6 h-6 text-${badge.color}-400`} />
                </div>
                <p className="font-semibold text-white text-sm">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
          {[
            { status: 'locked', label: 'Locked', color: 'text-gray-500' },
            { status: 'funding', label: 'Funding', color: 'text-blue-400' },
            { status: 'unlocked', label: 'Unlocked', color: 'text-violet-400' },
            { status: 'completed', label: 'Completed', color: 'text-green-400' },
          ].map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-current ${item.color}`} />
              <span className="text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDetailModal
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
            onDonate={handleDonate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
