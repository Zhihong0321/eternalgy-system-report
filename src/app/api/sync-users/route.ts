import { NextRequest, NextResponse } from 'next/server';
import { dbUtils } from '@/lib/database';

// API Token (in production, use environment variables)
const API_TOKEN = process.env.API_TOKEN || 'your-secret-token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate API token
    if (body.api_token !== API_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Invalid API token' },
        { status: 401 }
      );
    }

    // Validate users array
    if (!body.users || !Array.isArray(body.users)) {
      return NextResponse.json(
        { success: false, message: 'Users array is required' },
        { status: 400 }
      );
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process each user
    for (const user of body.users) {
      try {
        // Validate required fields for each user
        if (!user.uid || !user.name || !user.department) {
          errors.push(`Missing required fields for user: ${JSON.stringify(user)}`);
          errorCount++;
          continue;
        }

        // Insert or update user
        dbUtils.upsertUser.run(user.uid, user.name, user.department);
        successCount++;

      } catch (error) {
        errors.push(`Error processing user ${user.uid}: ${error}`);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `User sync completed: ${successCount} successful, ${errorCount} errors`,
      stats: {
        total_users: body.users.length,
        successful: successCount,
        errors: errorCount
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error syncing users:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Eternalgy System Report API - Sync Users Endpoint',
    usage: 'POST /api/sync-users',
    required_fields: ['api_token', 'users'],
    user_format: {
      uid: 'string (required)',
      name: 'string (required)',
      department: 'string (required)'
    },
    example: {
      api_token: 'your-secret-token',
      users: [
        {
          uid: 'john_doe_001',
          name: 'John Doe',
          department: 'sales'
        },
        {
          uid: 'jane_smith_002',
          name: 'Jane Smith',
          department: 'finance'
        }
      ]
    }
  });
}
