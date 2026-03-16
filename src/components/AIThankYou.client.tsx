'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Code2,
  FileText,
  Terminal,
  Palette,
  Scroll,
  Quote,
  Copy,
  RefreshCw,
  Download,
  Share2,
  Star,
  Zap,
  ArrowRight,
  X,
  Check,
  Eye,
  Clock,
  Award,
} from 'lucide-react';
import {
  fortuneCookies,
  sshMessages,
  generatedCodeExamples,
  asciiArtExamples,
  thankYouTemplates,
  aiStats,
  messageTypes,
} from '@/lib/ai-thank-you-data';

export function AIThankYouClient() {
  const [selectedType, setSelectedType] = useState<string>('fortune');
  const [generatedMessage, setGeneratedMessage] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [donatorName, setDonatorName] = useState('');
  const [donationAmount, setDonationAmount] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let result;
    switch (selectedType) {
      case 'fortune':
        result = fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)];
        break;
      case 'ssh-banner':
        result = sshMessages[Math.floor(Math.random() * sshMessages.length)];
        break;
      case 'code':
        result = generatedCodeExamples[Math.floor(Math.random() * generatedCodeExamples.length)];
        break;
      case 'ascii-art':
        result = asciiArtExamples[Math.floor(Math.random() * asciiArtExamples.length)];
        break;
      default:
        result = { message: 'Thank you for your support!' };
    }
    
    setGeneratedMessage(result);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-rose-950 to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl -top-1/2 -left-1/4" />
          <div className="absolute w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl -bottom-1/2 -right-1/4" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-900/30 border border-rose-700/50 rounded-full text-rose-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Appreciation
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Personalized Thank You
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Every donation receives a unique, AI-generated thank you message. 
              Choose your style: fortune cookies, code art, SSH banners, and more.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              <StatCard
                icon={FileText}
                label="Messages Generated"
                value={aiStats.totalMessages.toString()}
                color="rose"
              />
              <StatCard
                icon={Eye}
                label="Total Views"
                value={aiStats.totalViews.toLocaleString()}
                color="pink"
              />
              <StatCard
                icon={Clock}
                label="Avg Generation"
                value={`${aiStats.averageGenerationTime}s`}
                color="purple"
              />
              <StatCard
                icon={Award}
                label="Top Donator"
                value={aiStats.topDonator.messagesReceived.toString()}
                color="amber"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Try Generator
              </a>
              <a
                href="#gallery"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-all"
              >
                <Palette className="w-5 h-5" />
                View Gallery
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Message Type Selector */}
      <section id="generator" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Choose Your Style</h2>
        <p className="text-gray-400 text-center mb-12">
          Each donation gets a unique, personalized message in your preferred format.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-12">
          {messageTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 rounded-xl border transition-all ${
                selectedType === type.id
                  ? 'bg-rose-900/30 border-rose-500 shadow-lg shadow-rose-500/20'
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{type.name}</h3>
              <p className="text-xs text-gray-500">{type.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Generator Panel */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={donatorName}
                  onChange={(e) => setDonatorName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Donation Amount</label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:from-gray-700 disabled:to-gray-600 text-white rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Thank You
                </>
              )}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Generated Message Display */}
      <AnimatePresence>
        {generatedMessage && (
          <section className="container mx-auto px-4 py-16">
            <motion.div
              className="max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-900/50 to-pink-900/50 border-b border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-rose-400" />
                    <h3 className="text-xl font-bold text-white">Your Personalized Message</h3>
                  </div>
                  <div className="flex gap-2">
                    <ActionButton icon={Copy} label="Copy" />
                    <ActionButton icon={Download} label="Save" />
                    <ActionButton icon={Share2} label="Share" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {selectedType === 'fortune' && (
                  <FortuneDisplay fortune={generatedMessage} />
                )}
                {selectedType === 'ssh-banner' && (
                  <SSHDisplay message={generatedMessage} />
                )}
                {selectedType === 'code' && (
                  <CodeDisplay code={generatedMessage} />
                )}
                {selectedType === 'ascii-art' && (
                  <ASCIIDisplay art={generatedMessage} />
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-700 p-6 bg-gray-900/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    Generated by AI • Unique to your donation
                  </p>
                  <button
                    onClick={handleGenerate}
                    className="text-rose-400 hover:text-rose-300 text-sm font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      {/* Examples Gallery */}
      <section id="gallery" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Example Messages</h2>
        <p className="text-gray-400 text-center mb-12">
          See what kind of thank you messages you can receive.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Fortune Example */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🥠</span>
              <h3 className="font-semibold text-white">Fortune Cookie</h3>
            </div>
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mb-4">
              <p className="text-amber-200 text-sm italic">
                "A bug avoided today is a feature tomorrow. Your code will run smoothly."
              </p>
              <p className="text-amber-400 text-xs mt-3">
                Lucky Numbers: 7, 14, 23, 42, 69, 88
              </p>
            </div>
          </motion.div>

          {/* Code Example */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💻</span>
              <h3 className="font-semibold text-white">Code Art</h3>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
{`function thankYou(sponsor) {
  const gratitude = Infinity;
  for (let i = 0; i < gratitude; i++) {
    console.log(\`Thank you, \${sponsor}!\`);
  }
}`}
              </pre>
            </div>
          </motion.div>

          {/* SSH Banner Example */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💻</span>
              <h3 className="font-semibold text-white">SSH Banner</h3>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
{`╔═══════════════════════════╗
║  WELCOME BACK, SUPPORTER! ║
║  Thank you for believing  ║
║  in continuous learning!  ║
╚═══════════════════════════╝`}
              </pre>
            </div>
          </motion.div>

          {/* ASCII Art Example */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎨</span>
              <h3 className="font-semibold text-white">ASCII Art</h3>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <pre className="text-xs text-pink-400 font-mono whitespace-pre">
{`
       ****       ****
     **    **   **    **
    **      ** **      **
    **       ***       **
     **               **
       **           **
         **       **
`}
              </pre>
            </div>
          </motion.div>

          {/* Poem Example */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📜</span>
              <h3 className="font-semibold text-white">Poetry</h3>
            </div>
            <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
              <p className="text-purple-200 text-sm italic">
                Code by code and line by line,<br />
                Your support makes this journey shine.<br />
                Thank you for being here today,<br />
                Making every bug go away.
              </p>
            </div>
          </motion.div>

          {/* Quote Example */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💡</span>
              <h3 className="font-semibold text-white">Inspirational</h3>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4">
              <p className="text-cyan-200 text-sm italic">
                "In the garden of knowledge, generous souls plant seeds that bloom forever."
              </p>
              <p className="text-cyan-400 text-xs mt-3">— Today's Wisdom</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Message Templates</h2>
        <p className="text-gray-400 text-center mb-12">
          Choose from various templates or let AI create something unique.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {thankYouTemplates.map((template, idx) => (
            <motion.div
              key={template.id}
              className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-white">{template.name}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">{template.description}</p>
              <div className="bg-gray-950 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-mono">
                  {template.promptTemplate.substring(0, 80)}...
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="relative bg-gradient-to-r from-rose-900/50 to-pink-900/50 border border-rose-700/50 rounded-2xl p-12 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Receive Your Thank You?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Make a donation and get a unique, AI-generated message that's yours to keep. 
              Share it, save it, or display it with pride!
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105">
              <Heart className="w-5 h-5" />
              Make a Donation
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>
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
    rose: 'from-rose-600 to-rose-400',
    pink: 'from-pink-600 to-pink-400',
    purple: 'from-purple-600 to-purple-400',
    amber: 'from-amber-600 to-amber-400',
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

function ActionButton({ icon: Icon, label }: { icon: any; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors relative"
      title={label}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Icon className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
}

function FortuneDisplay({ fortune }: { fortune: FortuneCookie }) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-6">🥠</div>
      <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-8 mb-6">
        <p className="text-amber-200 text-lg italic leading-relaxed">
          "{fortune.fortune}"
        </p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase mb-2">Lucky Numbers</p>
          <div className="flex gap-2">
            {fortune.luckyNumbers.map((num, idx) => (
              <span key={idx} className="w-8 h-8 bg-amber-900/30 border border-amber-700 rounded-full flex items-center justify-center text-amber-400 text-sm font-medium">
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <span className="px-3 py-1 bg-gray-800 rounded-full capitalize">{fortune.category}</span>
        <span className="px-3 py-1 bg-gray-800 rounded-full uppercase">{fortune.language}</span>
      </div>
    </div>
  );
}

function SSHDisplay({ message }: { message: SSHMessage }) {
  return (
    <div className="bg-gray-950 rounded-xl p-6 overflow-x-auto">
      <pre className={`text-sm font-mono whitespace-pre ${
        message.colors.includes('#22c55e') ? 'text-green-400' :
        message.colors.includes('#60a5fa') ? 'text-blue-400' :
        'text-gray-400'
      }`}>
        {message.message}
      </pre>
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <Terminal className="w-4 h-4" />
        <span className="capitalize">{message.style} style</span>
        {message.animation && <span className="px-2 py-0.5 bg-rose-900/30 text-rose-400 rounded-full">Animated</span>}
      </div>
    </div>
  );
}

function CodeDisplay({ code }: { code: GeneratedCode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-white">{code.title}</h4>
          <p className="text-sm text-gray-400">{code.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          code.complexity === 'simple' ? 'bg-green-900/30 text-green-400' :
          code.complexity === 'intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
          'bg-red-900/30 text-red-400'
        }`}>
          {code.complexity}
        </span>
      </div>
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-green-400">
          {code.code}
        </pre>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {code.tags.map((tag, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
            #{tag}
          </span>
        ))}
        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs font-mono">
          {code.language}
        </span>
      </div>
    </div>
  );
}

function ASCIIDisplay({ art }: { art: ASCIIArt }) {
  return (
    <div className="text-center">
      <h4 className="font-semibold text-white mb-4">{art.title}</h4>
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 inline-block">
        <pre className="text-sm font-mono text-pink-400 whitespace-pre">
          {art.art}
        </pre>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
        <span>{art.width} x {art.height} chars</span>
        <span className="px-2 py-1 bg-gray-800 rounded capitalize">{art.style}</span>
      </div>
    </div>
  );
}
