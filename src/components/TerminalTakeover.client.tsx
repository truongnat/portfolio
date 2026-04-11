'use client';

import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  DollarSign,
  Award,
  Users,
  Zap,
  Lock,
  Unlock,
  Palette,
  Maximize2,
  Minimize2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  terminalCommands,
  terminalThemes,
  easterEggs,
  terminalStats,
  commandCategories,
  ranks,
} from '@/lib/terminal-takeover-data';

export function TerminalTakeoverClient() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([]);
  const [currentTheme, setCurrentTheme] = useState(terminalThemes[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [unlockedCommands] = useState<string[]>(['help', 'echo', 'clear', 'whoami', 'date', 'donate']);
  const [totalDonated] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    const parts = trimmedCmd.split(' ');
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = terminalCommands.find(c => c.command.toLowerCase() === commandName);

    if (!command) {
      setHistory(prev => [...prev, {
        command: trimmedCmd,
        output: `Command not found: ${commandName}. Type 'help' for available commands.`,
      }]);
      return;
    }

    if (!unlockedCommands.includes(command.id)) {
      setHistory(prev => [...prev, {
        command: trimmedCmd,
        output: `🔒 Locked! This command requires $${command.cost} donation. Type 'donate' to unlock.`,
      }]);
      return;
    }

    const output = typeof command.output === 'function' 
      ? command.output(args)
      : command.output;

    setHistory(prev => [...prev, {
      command: trimmedCmd,
      output: output || '',
    }]);

    // Check for easter eggs
    const easterEgg = easterEggs.find(ee => 
      trimmedCmd.toLowerCase().includes(ee.trigger.toLowerCase())
    );
    if (easterEgg) {
      setHistory(prev => [...prev, {
        command: '',
        output: `🎉 EASTER EGG: ${easterEgg.message}`,
      }]);
    }

    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  const getRank = () => {
    return ranks.slice().reverse().find(r => totalDonated >= r.minDonation) || ranks[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-950">
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
              <Terminal className="w-4 h-4" />
              Interactive Terminal
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
              Terminal Takeover
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Take control of my terminal! Unlock commands through donations and 
              discover hidden easter eggs.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
              <StatCard
                icon={Users}
                label="Total Users"
                value={terminalStats.totalUsers.toLocaleString()}
                color="green"
              />
              <StatCard
                icon={Zap}
                label="Commands Executed"
                value={terminalStats.totalExecutions.toLocaleString()}
                color="yellow"
              />
              <StatCard
                icon={DollarSign}
                label="Total Donations"
                value={`$${terminalStats.totalDonations.toLocaleString()}`}
                color="emerald"
              />
              <StatCard
                icon={Award}
                label="Your Rank"
                value={getRank().name}
                color="cyan"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terminal Section */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Mobile tip */}
          <div className="sm:hidden mb-4 px-4 py-2 bg-green-900/20 border border-green-800/30 rounded-lg text-xs text-green-400/70 font-mono text-center">
            💡 Tip: Rotate to landscape for better terminal experience
          </div>

          {/* Terminal Window */}
          <div className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-400 text-sm ml-4">guest@portfolio:~</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTheme(terminalThemes[(terminalThemes.indexOf(currentTheme) + 1) % terminalThemes.length])}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Change Theme"
                >
                  <Palette className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div
              ref={terminalRef}
              className="h-72 sm:h-96 overflow-y-auto p-4 font-mono text-sm"
              style={{
                backgroundColor: currentTheme.background,
                color: currentTheme.foreground,
              }}
              onClick={() => inputRef.current?.focus()}
            >
              {/* Welcome Message */}
              <div className="mb-4">
                <p className="text-green-400">Welcome to Portfolio Terminal v1.0</p>
                <p className="text-gray-400">Type <span className="text-yellow-400">'help'</span> for available commands.</p>
                <p className="text-gray-400">Type <span className="text-yellow-400">'donate'</span> to unlock premium commands.</p>
              </div>

              {/* Command History */}
              {history.map((entry, idx) => (
                <div key={idx} className="mb-2">
                  {entry.command && (
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-green-400" />
                      <span>{entry.command}</span>
                    </div>
                  )}
                  {entry.output && (
                    <pre className="whitespace-pre-wrap text-gray-300 mt-1 ml-6">{entry.output}</pre>
                  )}
                </div>
              ))}

              {/* Input Line */}
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-green-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none"
                  style={{
                    color: currentTheme.foreground,
                    caretColor: currentTheme.cursor,
                  }}
                  placeholder="Type a command..."
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Quick Commands */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {['help', 'neofetch', 'cowsay Hello!', 'fortune', 'donate'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Command Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Command Categories</h2>
        <p className="text-gray-400 text-center mb-12">Unlock more commands by donating.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {commandCategories.map((category, idx) => {
            const categoryCommands = terminalCommands.filter(c => c.category === category.id);
            const unlockedCount = categoryCommands.filter(c => unlockedCommands.includes(c.id)).length;
            
            return (
              <motion.div
                key={category.id}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      <p className="text-xs text-gray-500">${category.minCost}+ to unlock</p>
                    </div>
                  </div>
                  <span className={`text-sm ${unlockedCount === categoryCommands.length ? 'text-green-400' : 'text-gray-500'}`}>
                    {unlockedCount}/{categoryCommands.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {categoryCommands.slice(0, 3).map((cmd) => (
                    <div key={cmd.id} className="flex items-center justify-between text-sm">
                      <code className="text-gray-300">{cmd.command}</code>
                      {unlockedCommands.includes(cmd.id) ? (
                        <Unlock className="w-4 h-4 text-green-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Ranks Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Donation Ranks</h2>
        <p className="text-gray-400 text-center mb-12">Unlock higher ranks with more donations.</p>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {ranks.map((rank, idx) => (
            <motion.div
              key={rank.id}
              className={`bg-gray-900/50 backdrop-blur border rounded-xl p-6 text-center ${
                getRank().id === rank.id ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-gray-800'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="text-4xl mb-2">{rank.icon}</div>
              <h3 className="font-semibold text-white mb-1">{rank.name}</h3>
              <p className="text-xs text-gray-500">${rank.minDonation}+</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Easter Eggs Teaser */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-3xl mx-auto bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Hidden Easter Eggs</h2>
          <p className="text-gray-300 mb-8">
            Discover secret commands and hidden messages. Some commands trigger special effects!
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-4 py-2 bg-purple-900/30 text-purple-300 rounded-full text-sm">
              Try typing random things
            </span>
            <span className="px-4 py-2 bg-pink-900/30 text-pink-300 rounded-full text-sm">
              Remember classic games?
            </span>
            <span className="px-4 py-2 bg-blue-900/30 text-blue-300 rounded-full text-sm">
              Follow the white rabbit
            </span>
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
    green: 'from-green-600 to-green-400',
    yellow: 'from-yellow-600 to-yellow-400',
    emerald: 'from-emerald-600 to-emerald-400',
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
