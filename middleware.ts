import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add code between createServerClient and supabase.auth.getUser()
  // A simple mistake could make your app very slow or unresponsive

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public CMS routes (login, forgot-password, reset-password)
  const publicCmsRoutes = ['/cms/login', '/cms/forgot-password', '/cms/reset-password']
  const isPublicCmsRoute = publicCmsRoutes.some(route => pathname.startsWith(route))

  // Protected CMS routes
  const isProtectedCmsRoute = pathname.startsWith('/cms/dashboard')

  // If user is not logged in and trying to access protected CMS route
  if (!user && isProtectedCmsRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/cms/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // If user is logged in and trying to access login page, redirect to dashboard
  if (user && (pathname === '/cms/login' || pathname === '/cms')) {
    const url = request.nextUrl.clone()
    url.pathname = '/cms/dashboard'
    return NextResponse.redirect(url)
  }

  // Redirect /cms to /cms/login or /cms/dashboard based on auth status
  if (pathname === '/cms') {
    const url = request.nextUrl.clone()
    url.pathname = user ? '/cms/dashboard' : '/cms/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
