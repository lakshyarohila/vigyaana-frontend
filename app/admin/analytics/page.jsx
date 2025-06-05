'use client';

import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import ProtectedRoute from '@/compoenets/ProtectedRoute';
import { getRequest } from '@/lib/api';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, revenueRes, usersRes, popularRes] = await Promise.all([
          getRequest('/admin/stats'),
          getRequest('/admin/stats/revenue'),
          getRequest('/admin/stats/users'),
          getRequest('/admin/stats/popular-courses'),
        ]);
        setStats(statsRes);
        setRevenueData(revenueRes);
        setUserData(usersRes);
        setPopularCourses(popularRes);
      } catch (err) {
        toast.error('Failed to fetch analytics data');
      }
    };
    fetchAll();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-white px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1c4645] mb-8">📊 Admin Analytics Dashboard</h1>

        {/* 🟦 Summary Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Users', value: stats.users },
              { label: 'Total Courses', value: stats.courses },
              { label: 'Total Enrollments', value: stats.enrollments },
              { label: 'Total Reviews', value: stats.reviews },
              { label: 'Total Revenue', value: `₹${stats.revenue}` },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-[#f1f5f9] border-l-4 border-[#1c4645] rounded-lg shadow">
                <h2 className="text-sm text-gray-500 font-medium mb-2">{item.label}</h2>
                <p className="text-2xl font-bold text-[#1c4645]">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 📈 Revenue Chart */}
          <div className="bg-white border border-gray-100 rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4 text-[#1c4645]">Monthly Revenue</h2>
            <Line
              data={{
                labels: revenueData.map((d) => d.label),
                datasets: [
                  {
                    label: 'Revenue (₹)',
                    data: revenueData.map((d) => d.totalRevenue),
                    backgroundColor: '#e17100',
                    borderColor: '#e17100',
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
            />
          </div>

          {/* 👤 New Users Chart */}
          <div className="bg-white border border-gray-100 rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4 text-[#1c4645]">Monthly New Users</h2>
            <Bar
              data={{
                labels: userData.map((d) => d.label),
                datasets: [
                  {
                    label: 'Users',
                    data: userData.map((d) => d.totalUsers),
                    backgroundColor: '#1c4645',
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* 🏆 Top Enrolled Courses */}
        <div className="bg-white border border-gray-100 rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-[#1c4645]">Top 5 Popular Courses</h2>
          <Bar
            data={{
              labels: popularCourses.map((c) => c.title),
              datasets: [
                {
                  label: 'Enrollments',
                  data: popularCourses.map((c) => c.enrollments),
                  backgroundColor: '#22c55e',
                },
              ],
            }}
            options={{
              indexAxis: 'y',
            }}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
