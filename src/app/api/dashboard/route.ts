import { NextRequest, NextResponse } from 'next/server';
import { dbUtils } from '@/lib/database';
import { UserStats, DepartmentStats, SystemSectionStats, FunctionStats, UserProductivity, HourlyActivity, UserInteraction } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Get various statistics for the dashboard
    const [
      userStats,
      departmentStats,
      systemSectionStats,
      functionStats,
      recentInteractions,
      userProductivity,
      hourlyActivity
    ] = await Promise.all([
      dbUtils.getUserStats.all(date),
      dbUtils.getDepartmentStats.all(date),
      dbUtils.getSystemSectionStats.all(date),
      dbUtils.getFunctionStats.all(date),
      dbUtils.getRecentInteractions.all(50),
      dbUtils.getUserProductivity.all(date),
      dbUtils.getHourlyActivity.all(date)
    ]) as [
      UserStats[],
      DepartmentStats[],
      SystemSectionStats[],
      FunctionStats[],
Array<UserInteraction & { user_name?: string }>,
      UserProductivity[],
      HourlyActivity[]
    ];

    // Calculate summary statistics
    const totalInteractions = userStats.reduce((sum, user) => sum + user.total_interactions, 0);
    const totalActiveUsers = userStats.length;
    const totalDepartments = departmentStats.length;
    const totalSystemSections = systemSectionStats.length;

    // Top performing users
    const topUsers = userProductivity.slice(0, 10);

    // Most used functions
    const topFunctions = functionStats.slice(0, 10);

    return NextResponse.json({
      success: true,
      date,
      summary: {
        total_interactions: totalInteractions,
        active_users: totalActiveUsers,
        departments: totalDepartments,
        system_sections: totalSystemSections
      },
      user_stats: userStats,
      department_stats: departmentStats,
      system_section_stats: systemSectionStats,
      function_stats: functionStats,
      recent_interactions: recentInteractions,
      user_productivity: userProductivity,
      hourly_activity: hourlyActivity,
      top_users: topUsers,
      top_functions: topFunctions
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface DailyStatsAccumulator {
  [date: string]: {
    date: string;
    total_interactions: number;
    unique_users: Set<string>;
    departments: Set<string>;
    system_sections: Set<string>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { start_date, end_date } = body;

    if (!start_date || !end_date) {
      return NextResponse.json(
        { success: false, message: 'start_date and end_date are required' },
        { status: 400 }
      );
    }

    // Get interactions for date range
    const interactions = dbUtils.getInteractionsByDateRange.all(start_date, end_date) as UserInteraction[];

    // Group by date for time series
    const dailyStats: DailyStatsAccumulator = interactions.reduce((acc: DailyStatsAccumulator, interaction) => {
      const date = interaction.record_date.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          total_interactions: 0,
          unique_users: new Set(),
          departments: new Set(),
          system_sections: new Set()
        };
      }
      acc[date].total_interactions++;
      acc[date].unique_users.add(interaction.user_uid);
      acc[date].departments.add(interaction.user_department);
      acc[date].system_sections.add(interaction.system_section);
      return acc;
    }, {});

    // Convert sets to counts and arrays
    const timeSeriesData = Object.values(dailyStats).map((day) => ({
      date: day.date,
      total_interactions: day.total_interactions,
      unique_users: day.unique_users.size,
      departments: day.departments.size,
      system_sections: day.system_sections.size
    }));

    return NextResponse.json({
      success: true,
      date_range: { start_date, end_date },
      total_interactions: interactions.length,
      time_series: timeSeriesData,
      raw_interactions: interactions
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
