# Eternalgy System Report API Handbook

## Overview

This API allows you to track user interactions from your ERP system and analyze usage patterns through a dashboard interface.

**Base URL:** `http://your-domain.com/api`

## Authentication

All API endpoints require an API token. Set your token in the request body:

```json
{
  "api_token": "your-secret-token"
}
```

## API Endpoints

### 1. Track User Interactions

**Endpoint:** `POST /api/track`

**Description:** Records user interactions with your ERP system.

**Required Fields:**
- `api_token`: Your API authentication token
- `user_uid`: Unique identifier for the user (50 characters max)
- `user_department`: Department name (e.g., "sales", "finance")
- `system_section`: System section identifier (e.g., "sales_system", "finance_system")
- `system_function`: Specific function/button clicked (e.g., "generate_proposal", "search_customer")

**Optional Fields:**
- `session_id`: Session identifier for tracking user sessions

**Request Example:**
```bash
curl -X POST http://your-domain.com/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "api_token": "your-secret-token",
    "user_uid": "john_doe_001",
    "user_department": "sales",
    "system_section": "sales_system",
    "system_function": "generate_proposal",
    "session_id": "session_123"
  }'
```

**Response Example:**
```json
{
  "success": true,
  "message": "Interaction tracked successfully",
  "interaction_id": 12345,
  "timestamp": "2025-07-15T05:21:42Z"
}
```

**Error Responses:**
- `401`: Invalid API token
- `400`: Missing required fields
- `500`: Internal server error

---

### 2. Sync Users from ERP

**Endpoint:** `POST /api/sync-users`

**Description:** Synchronizes user data from your ERP system.

**Required Fields:**
- `api_token`: Your API authentication token
- `users`: Array of user objects

**User Object Format:**
- `uid`: Unique identifier (required)
- `name`: User's full name (required)
- `department`: User's department (required)

**Request Example:**
```bash
curl -X POST http://your-domain.com/api/sync-users \
  -H "Content-Type: application/json" \
  -d '{
    "api_token": "your-secret-token",
    "users": [
      {
        "uid": "john_doe_001",
        "name": "John Doe",
        "department": "sales"
      },
      {
        "uid": "jane_smith_002",
        "name": "Jane Smith",
        "department": "finance"
      }
    ]
  }'
```

**Response Example:**
```json
{
  "success": true,
  "message": "User sync completed: 2 successful, 0 errors",
  "stats": {
    "total_users": 2,
    "successful": 2,
    "errors": 0
  }
}
```

---

### 3. Get Dashboard Data

**Endpoint:** `GET /api/dashboard`

**Description:** Retrieves analytics data for the dashboard.

**Query Parameters:**
- `date`: Date in YYYY-MM-DD format (optional, defaults to today)

**Request Example:**
```bash
curl -X GET "http://your-domain.com/api/dashboard?date=2025-07-15"
```

**Response Example:**
```json
{
  "success": true,
  "date": "2025-07-15",
  "summary": {
    "total_interactions": 150,
    "active_users": 25,
    "departments": 3,
    "system_sections": 5
  },
  "department_stats": [...],
  "system_section_stats": [...],
  "function_stats": [...],
  "user_productivity": [...],
  "hourly_activity": [...]
}
```

**POST Version for Date Range:**
```bash
curl -X POST http://your-domain.com/api/dashboard \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2025-07-01",
    "end_date": "2025-07-15"
  }'
```

---

## Integration with Bubble.io

### Setting up API Connector in Bubble.io

1. Go to your Bubble.io app
2. Navigate to Plugins → Add plugins → API Connector
3. Add a new API call:
   - **Name:** Track User Interaction
   - **Use as:** Action
   - **Data type:** JSON
   - **Method:** POST
   - **URL:** `http://your-domain.com/api/track`
   - **Headers:** `Content-Type: application/json`

### Workflow Integration

In your Bubble.io workflows, add the API call whenever a user interacts with your system:

**Example workflow for "Generate Proposal" button:**
1. User clicks "Generate Proposal"
2. Add Action → Plugins → Track User Interaction
3. Set parameters:
   - `api_token`: "your-secret-token"
   - `user_uid`: Current User's UID
   - `user_department`: Current User's Department
   - `system_section`: "sales_system"
   - `system_function`: "generate_proposal"

## Common System Sections

- `sales_system`: Sales-related functions
- `finance_system`: Finance and accounting functions
- `project_system`: Project management functions
- `crm_system`: Customer relationship management
- `hr_system`: Human resources functions

## Common System Functions

**Sales System:**
- `generate_proposal`
- `create_quotation`
- `search_customer`
- `view_customer_profile`
- `update_lead_status`

**Finance System:**
- `verify_payment`
- `generate_invoice`
- `view_financial_report`
- `process_refund`
- `update_pricing`

**Project System:**
- `create_project`
- `update_project_status`
- `assign_task`
- `write_report`
- `view_project_timeline`

## Dashboard Analytics

The dashboard provides insights into:

1. **User Productivity**: Track how many quotations/reports each user generates
2. **Feature Adoption**: See which new features are being used
3. **Department Activity**: Compare activity levels across departments
4. **System Usage Patterns**: Understand peak usage times and popular features

## Error Handling

Always check the response status and handle errors appropriately:

```javascript
fetch('/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_token: 'your-secret-token',
    user_uid: 'user_123',
    user_department: 'sales',
    system_section: 'sales_system',
    system_function: 'generate_proposal'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Interaction tracked successfully');
  } else {
    console.error('Error:', data.message);
  }
})
.catch(error => {
  console.error('Network error:', error);
});
```

## Environment Variables

For production deployment, set these environment variables:

- `API_TOKEN`: Your secret API token
- `DATABASE_URL`: Database connection string (if using external database)

## Support

For technical support or questions about the API, please contact your system administrator.

---

**Last Updated:** July 15, 2025
**API Version:** 1.0
