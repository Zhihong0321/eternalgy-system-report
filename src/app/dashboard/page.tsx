'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DepartmentStatsChart, SystemSectionChart, HourlyActivityChart, FunctionUsageChart, UserProductivityChart } from '@/components/charts/ChartComponents';
import { DashboardData } from '@/types';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Fetch dashboard data
    axios.get('/api/dashboard')
      .then(response => {
        setDashboardData(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
      });
  }, []);

  if (!dashboardData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Eternalgy System Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-4">Integration Summary</h2>
          <p>Total Interactions: {dashboardData.summary.total_interactions}</p>
          <p>Active Users: {dashboardData.summary.active_users}</p>
          <p>Departments: {dashboardData.summary.departments}</p>
          <p>System Sections: {dashboardData.summary.system_sections}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <DepartmentStatsChart data={dashboardData.department_stats} />
        </div>

        <div className="bg-white p-4 shadow rounded">
          <SystemSectionChart data={dashboardData.system_section_stats} />
        </div>

        <div className="bg-white p-4 shadow rounded col-span-1 lg:col-span-2">
          <HourlyActivityChart data={dashboardData.hourly_activity} />
        </div>

        <div className="bg-white p-4 shadow rounded">
          <FunctionUsageChart data={dashboardData.function_stats} />
        </div>

        <div className="bg-white p-4 shadow rounded">
          <UserProductivityChart data={dashboardData.user_productivity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

