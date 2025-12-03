'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Update last login timestamp
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase
      .from('admin_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('user_id', user.id)
  }

  revalidatePath('/cms/dashboard', 'layout')
  redirect('/cms/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/cms/login')
}

export async function resetPasswordRequest(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/cms/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Password reset email sent. Please check your inbox.' }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  
  const password = formData.get('password') as string
  
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/cms/dashboard', 'layout')
  redirect('/cms/dashboard')
}
