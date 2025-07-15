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

    // Validate required fields
    const { user_uid, user_department, system_section, system_function } = body;
    
    if (!user_uid || !user_department || !system_section || !system_function) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: user_uid, user_department, system_section, system_function' 
        },
        { status: 400 }
      );
    }

    // Extract additional optional fields
    const session_id = body.session_id || null;
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
    const user_agent = request.headers.get('user-agent') || null;

    // Insert interaction into database
    const result = dbUtils.insertInteraction.run(
      user_uid,
      user_department,
      system_section,
      system_function,
      session_id,
      ip_address,
      user_agent
    );

    return NextResponse.json({
      success: true,
      message: 'Interaction tracked successfully',
      interaction_id: result.lastInsertRowid,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error tracking interaction:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Eternalgy System Report API - Track Endpoint',
    usage: 'POST /api/track',
    required_fields: ['api_token', 'user_uid', 'user_department', 'system_section', 'system_function'],
    optional_fields: ['session_id']
  });
}
