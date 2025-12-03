import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { full_name, phone, job_title, department, avatar_url } = body

    // Validate required fields
    if (!full_name || full_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    // Build update object with only provided fields
    const updateData: Record<string, string | null> = {
      full_name: full_name.trim(),
      updated_at: new Date().toISOString(),
    }

    // Optional fields
    if (phone !== undefined) {
      updateData.phone = phone?.trim() || null
    }
    if (job_title !== undefined) {
      updateData.job_title = job_title?.trim() || null
    }
    if (department !== undefined) {
      updateData.department = department?.trim() || null
    }
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url || null
    }

    const { data: profile, error: updateError } = await supabase
      .from('admin_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Create audit log for profile update
    try {
      await supabase.rpc('create_audit_log', {
        p_action: 'update',
        p_resource_type: 'admin_profile',
        p_resource_id: profile.id,
        p_resource_name: profile.full_name,
        p_new_data: updateData,
        p_is_sensitive: false,
        p_metadata: { source: 'profile_settings' }
      })
    } catch (auditErr) {
      console.warn('Audit log creation failed:', auditErr)
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
