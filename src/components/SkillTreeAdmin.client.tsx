'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  RefreshCw,
  Shield,
  Zap,
  Search,
  Filter,
} from 'lucide-react';

interface Donation {
  id: string;
  donatorName: string;
  donatorEmail: string;
  amount: number;
  skillName: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  isAnonymous: boolean;
}

interface Stats {
  totalDonated: number;
  totalDonations: number;
  totalDonators: number;
  pendingAmount: number;
}

export function SkillTreeAdmin() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalDonated: 0,
    totalDonations: 0,
    totalDonators: 0,
    pendingAmount: 0,
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoints
      // const [statsRes, donationsRes] = await Promise.all([
      //   fetch('/api/admin/stats'),
      //   fetch('/api/admin/donations'),
      // ]);
      
      // Mock data
      setStats({
        totalDonated: 950,
        totalDonations: 12,
        totalDonators: 5,
        pendingAmount: 200,
      });

      setDonations([
        {
          id: 'don_1',
          donatorName: 'John Doe',
          donatorEmail: 'john@example.com',
          amount: 100,
          skillName: 'Advanced AI Agents',
          status: 'completed',
          paymentMethod: 'stripe',
          createdAt: new Date().toISOString(),
          isAnonymous: false,
        },
        {
          id: 'don_2',
          donatorName: 'Anonymous',
          donatorEmail: '',
          amount: 50,
          skillName: 'LanceDB + MCP Integration',
          status: 'pending',
          paymentMethod: 'crypto',
          createdAt: new Date().toISOString(),
          isAnonymous: true,
        },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveDonation = async (donationId: string) => {
    // TODO: API call to approve donation
    console.log('Approving donation:', donationId);
    setDonations(prev =>
      prev.map(d =>
        d.id === donationId ? { ...d, status: 'completed' as const } : d
      )
    );
  };

  const handleRejectDonation = async (donationId: string) => {
    // TODO: API call to reject donation
    console.log('Rejecting donation:', donationId);
    setDonations(prev =>
      prev.map(d =>
        d.id === donationId ? { ...d, status: 'failed' as const } : d
      )
    );
  };

  const handleGenerateCertificate = async (donation: Donation) => {
    const params = new URLSearchParams({
      donatorName: donation.donatorName,
      skillName: donation.skillName,
      amount: donation.amount.toString(),
      date: new Date(donation.createdAt).toLocaleDateString(),
      certificateId: donation.id,
    });

    window.open(`/api/certificate?${params}`, '_blank');
  };

  const filteredDonations = donations.filter(d => {
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchesSearch =
      d.donatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.skillName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColors = {
    pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
    completed: 'bg-green-900/30 text-green-400 border-green-700',
    failed: 'bg-red-900/30 text-red-400 border-red-700',
    refunded: 'bg-gray-900/30 text-gray-400 border-gray-700',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Skill Tree Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage donations and track progress</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={DollarSign}
            label="Total Donated"
            value={`$${stats.totalDonated}`}
            color="violet"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Donations"
            value={stats.totalDonations.toString()}
            color="blue"
          />
          <StatCard
            icon={Users}
            label="Total Donators"
            value={stats.totalDonators.toString()}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Pending Amount"
            value={`$${stats.pendingAmount}`}
            color="yellow"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by donator or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Donations table */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Donation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Skill
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-white">
                          {donation.isAnonymous ? 'Anonymous' : donation.donatorName}
                        </p>
                        {donation.donatorEmail && (
                          <p className="text-sm text-gray-500">{donation.donatorEmail}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-300">{donation.skillName}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-green-400">${donation.amount}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {donation.paymentMethod === 'stripe' && <DollarSign className="w-4 h-4 text-blue-400" />}
                        {donation.paymentMethod === 'crypto' && <Zap className="w-4 h-4 text-yellow-400" />}
                        <span className="text-gray-400 capitalize">{donation.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[donation.status]}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-400 text-sm">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {donation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveDonation(donation.id)}
                              className="p-2 hover:bg-green-900/30 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </button>
                            <button
                              onClick={() => handleRejectDonation(donation.id)}
                              className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                        {donation.status === 'completed' && (
                          <button
                            onClick={() => handleGenerateCertificate(donation)}
                            className="p-2 hover:bg-violet-900/30 rounded-lg transition-colors"
                            title="Generate Certificate"
                          >
                            <Download className="w-4 h-4 text-violet-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            icon={Award}
            title="Manage Badges"
            description="Configure badge requirements and awards"
            color="yellow"
          />
          <QuickActionCard
            icon={Shield}
            title="Skill Settings"
            description="Update skill costs and prerequisites"
            color="blue"
          />
          <QuickActionCard
            icon={TrendingUp}
            title="Analytics"
            description="View detailed donation analytics"
            color="green"
          />
        </div>
      </div>
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
    violet: 'from-violet-600 to-violet-400',
    blue: 'from-blue-600 to-blue-400',
    green: 'from-green-600 to-green-400',
    yellow: 'from-yellow-600 to-yellow-400',
  };

  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ icon: Icon, title, description, color }: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    yellow: 'hover:border-yellow-600',
    blue: 'hover:border-blue-600',
    green: 'hover:border-green-600',
  };

  return (
    <motion.div
      className={`bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 cursor-pointer transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}
      whileHover={{ scale: 1.02 }}
    >
      <Icon className="w-8 h-8 text-gray-400 mb-3" />
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </motion.div>
  );
}
