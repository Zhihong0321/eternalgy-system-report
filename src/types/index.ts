// Database types
export interface User {
  uid: string;
  name: string;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface UserInteraction {
  id: number;
  user_uid: string;
  user_department: string;
  system_section: string;
  system_function: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  record_date: string;
}

export interface UserStats {
  user_uid: string;
  user_department: string;
  total_interactions: number;
  unique_functions_used: number;
  date: string;
}

export interface DepartmentStats {
  user_department: string;
  total_interactions: number;
  active_users: number;
  date: string;
}

export interface SystemSectionStats {
  system_section: string;
  total_interactions: number;
  unique_users: number;
  date: string;
}

export interface FunctionStats {
  system_function: string;
  system_section: string;
  usage_count: number;
  unique_users: number;
  date: string;
}

export interface UserProductivity {
  user_uid: string;
  user_name?: string;
  user_department: string;
  quotations_generated: number;
  reports_written: number;
  total_interactions: number;
  date: string;
}

export interface HourlyActivity {
  hour: string;
  interaction_count: number;
}

export interface DashboardData {
  success: boolean;
  date: string;
  summary: {
    total_interactions: number;
    active_users: number;
    departments: number;
    system_sections: number;
  };
  user_stats: UserStats[];
  department_stats: DepartmentStats[];
  system_section_stats: SystemSectionStats[];
  function_stats: FunctionStats[];
  recent_interactions: (UserInteraction & { user_name?: string })[];
  user_productivity: UserProductivity[];
  hourly_activity: HourlyActivity[];
  top_users: UserProductivity[];
  top_functions: FunctionStats[];
}

// API request types
export interface TrackInteractionRequest {
  api_token: string;
  user_uid: string;
  user_department: string;
  system_section: string;
  system_function: string;
  session_id?: string;
}

export interface SyncUsersRequest {
  api_token: string;
  users: Array<{
    uid: string;
    name: string;
    department: string;
  }>;
}

// API response types
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface TrackInteractionResponse extends ApiResponse {
  interaction_id: number;
  timestamp: string;
}

export interface SyncUsersResponse extends ApiResponse {
  stats: {
    total_users: number;
    successful: number;
    errors: number;
  };
  errors?: string[];
}
