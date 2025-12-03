/**
 * Public Blog Listing Page
 * 
 * Displays all published blog posts with filtering by category.
 * Features SEO-optimized markup with structured data.
 * 
 * @route /blog
 */

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'
import type { BlogPost, BlogCategory } from '@/lib/supabase/database.types'

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Insights & Market Analysis',
    description: 'Expert insights on oil markets, industry trends, and energy sector analysis from Alak Oil & Gas Company Limited.',
    path: '/blog',
  })
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  return data || []
}

async function getBlogPosts(categorySlug?: string): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('blog_posts')
    .select('*, blog_categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  if (categorySlug) {
    // Get category ID first
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    
    if (category) {
      query = query.eq('category_id', category.id)
    }
  }
  
  const { data } = await query.limit(20)
  
  return data || []
}

// ============================================================================
// Components
// ============================================================================

function BlogPostCard({ post }: { post: BlogPost & { blog_categories?: BlogCategory } }) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Featured Image */}
      {post.featured_image && (
        <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
          <Image
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {post.is_auto_generated && (
            <span className="absolute top-4 left-4 bg-amber-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Market Update
            </span>
          )}
        </Link>
      )}
      
      {/* Content */}
      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-3">
          {post.blog_categories && (
            <Link
              href={`/blog?category=${post.blog_categories.slug}`}
              className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              {post.blog_categories.name}
            </Link>
          )}
          {publishedDate && (
            <>
              <span className="text-gray-300">•</span>
              <time className="text-sm text-gray-500" dateTime={post.published_at || ''}>
                {publishedDate}
              </time>
            </>
          )}
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        
        {/* Excerpt */}
        <p className="text-gray-600 line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        
        {/* Author & Read Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {post.author_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author_name || 'Alak Team'}</p>
              {post.author_role && (
                <p className="text-xs text-gray-500">{post.author_role}</p>
              )}
            </div>
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
          >
            Read More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

function FeaturedPostCard({ post }: { post: BlogPost & { blog_categories?: BlogCategory } }) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="group relative bg-gray-900 rounded-2xl overflow-hidden">
      {/* Background Image */}
      {post.featured_image && (
        <Image
          src={post.featured_image}
          alt={post.featured_image_alt || post.title}
          fill
          className="object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500"
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
      
      {/* Content */}
      <div className="relative p-8 md:p-12 min-h-[400px] flex flex-col justify-end">
        <div className="flex items-center gap-3 mb-4">
          {post.blog_categories && (
            <span className="text-sm font-medium text-amber-400">
              {post.blog_categories.name}
            </span>
          )}
          {publishedDate && (
            <>
              <span className="text-gray-500">•</span>
              <time className="text-sm text-gray-400" dateTime={post.published_at || ''}>
                {publishedDate}
              </time>
            </>
          )}
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        
        <p className="text-gray-300 line-clamp-2 mb-6 max-w-2xl">
          {post.excerpt}
        </p>
        
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-amber-400 font-medium hover:text-amber-300 transition-colors"
        >
          Read Full Article
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

function CategoryFilter({
  categories,
  activeCategory,
}: {
  categories: BlogCategory[]
  activeCategory?: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/blog"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeCategory
            ? 'bg-amber-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Posts
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/blog?category=${category.slug}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category.slug
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}

function BlogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-xl mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full" />
    </div>
  )
}

// ============================================================================
// Page Component
// ============================================================================

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const categorySlug = params.category
  
  const [categories, posts] = await Promise.all([
    getBlogCategories(),
    getBlogPosts(categorySlug),
  ])
  
  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Insights & Market Analysis
            </h1>
            <p className="text-xl text-gray-300">
              Stay informed with expert analysis on oil markets, industry trends, and energy sector developments from the Alak Oil & Gas team.
            </p>
          </div>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-10">
            <CategoryFilter categories={categories} activeCategory={categorySlug} />
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">
                {categorySlug
                  ? 'There are no posts in this category yet. Check back soon!'
                  : 'We\'re working on new content. Check back soon!'}
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-12">
                  <FeaturedPostCard post={featuredPost as BlogPost & { blog_categories?: BlogCategory }} />
                </div>
              )}
              
              {/* Post Grid */}
              {remainingPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingPosts.map((post) => (
                    <BlogPostCard
                      key={post.id}
                      post={post as BlogPost & { blog_categories?: BlogCategory }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Newsletter CTA */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Stay Ahead of the Market
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to receive our latest market analysis, price updates, and industry insights directly in your inbox.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Get in Touch
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Alak Oil & Gas Insights',
            description: 'Expert insights on oil markets, industry trends, and energy sector analysis.',
            url: 'https://alakoilandgas.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Alak Oil & Gas Company Limited',
              logo: {
                '@type': 'ImageObject',
                url: 'https://alakoilandgas.com/images/logo/alak-logo.png',
              },
            },
          }),
        }}
      />
    </div>
  )
}
