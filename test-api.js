const API_BASE = 'http://localhost:3000/api';
const API_TOKEN = 'your-secret-token';

// Test data
const testUsers = [
  { uid: 'john_doe_001', name: 'John Doe', department: 'sales' },
  { uid: 'jane_smith_002', name: 'Jane Smith', department: 'finance' },
  { uid: 'bob_wilson_003', name: 'Bob Wilson', department: 'project_team' },
  { uid: 'alice_brown_004', name: 'Alice Brown', department: 'sales' }
];

const testInteractions = [
  { user_uid: 'john_doe_001', user_department: 'sales', system_section: 'sales_system', system_function: 'generate_proposal' },
  { user_uid: 'john_doe_001', user_department: 'sales', system_section: 'sales_system', system_function: 'search_customer' },
  { user_uid: 'jane_smith_002', user_department: 'finance', system_section: 'finance_system', system_function: 'verify_payment' },
  { user_uid: 'bob_wilson_003', user_department: 'project_team', system_section: 'project_system', system_function: 'write_report' },
  { user_uid: 'alice_brown_004', user_department: 'sales', system_section: 'sales_system', system_function: 'generate_proposal' }
];

async function testAPI() {
  console.log('🚀 Testing Eternalgy System Report API...\n');

  // Test 1: Sync Users
  console.log('1. Testing User Sync...');
  try {
    const syncResponse = await fetch(`${API_BASE}/sync-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_token: API_TOKEN,
        users: testUsers
      })
    });
    
    const syncResult = await syncResponse.json();
    console.log('   ✅ User sync result:', syncResult);
  } catch (error) {
    console.log('   ❌ User sync failed:', error.message);
  }

  // Test 2: Track Interactions
  console.log('\n2. Testing Interaction Tracking...');
  for (const interaction of testInteractions) {
    try {
      const trackResponse = await fetch(`${API_BASE}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_token: API_TOKEN,
          ...interaction
        })
      });
      
      const trackResult = await trackResponse.json();
      console.log(`   ✅ Tracked: ${interaction.system_function} by ${interaction.user_uid}`);
    } catch (error) {
      console.log(`   ❌ Failed to track interaction: ${error.message}`);
    }
  }

  // Test 3: Dashboard Data
  console.log('\n3. Testing Dashboard Data...');
  try {
    const dashboardResponse = await fetch(`${API_BASE}/dashboard`);
    const dashboardData = await dashboardResponse.json();
    
    console.log('   ✅ Dashboard data received:');
    console.log(`      - Total interactions: ${dashboardData.summary.total_interactions}`);
    console.log(`      - Active users: ${dashboardData.summary.active_users}`);
    console.log(`      - Departments: ${dashboardData.summary.departments}`);
    console.log(`      - System sections: ${dashboardData.summary.system_sections}`);
    
    if (dashboardData.user_productivity.length > 0) {
      console.log('   ✅ User productivity data available');
    }
    
    if (dashboardData.department_stats.length > 0) {
      console.log('   ✅ Department stats available');
    }
    
  } catch (error) {
    console.log('   ❌ Dashboard data failed:', error.message);
  }

  console.log('\n🎉 API testing completed!');
  console.log('\n📊 You can now visit http://localhost:3000 to see the dashboard!');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
