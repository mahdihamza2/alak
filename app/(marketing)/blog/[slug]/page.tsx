/**
 * Public Blog Post Detail Page
 * 
 * Displays a single blog post with full content, structured data,
 * related posts, and social sharing.
 * 
 * @route /blog/[slug]
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'
import type { BlogPost, BlogCategory } from '@/lib/supabase/database.types'

// ============================================================================
// Metadata
// ============================================================================

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  
  return generatePageMetadata({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    path: `/blog/${slug}`,
    ogImage: post.featured_image || undefined,
  })
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getPostBySlug(slug: string): Promise<(BlogPost & { blog_categories?: BlogCategory | null }) | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  
  if (error || !data) {
    return null
  }
  
  // Increment view count
  await supabase
    .from('blog_posts')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id)
  
  return data as BlogPost & { blog_categories?: BlogCategory | null }
}

async function getRelatedPosts(
  categoryId: string,
  currentPostId: string
): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .neq('id', currentPostId)
    .order('published_at', { ascending: false })
    .limit(3)
  
  return data || []
}

// ============================================================================
// Static Params Generation
// ============================================================================

// Dynamic route - static params not needed since content is from Supabase
// This prevents cookies() errors during build
export const dynamic = 'force-dynamic'

// ============================================================================
// Components
// ============================================================================

function TableOfContents({ content }: { content: string }) {
  // Extract headings from markdown content
  const headingRegex = /^##\s+(.+)$/gm
  const headings: { text: string; id: string }[] = []
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1]
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    headings.push({ text, id })
  }
  
  if (headings.length === 0) {
    return null
  }
  
  return (
    <nav className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
        In this article
      </h3>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li key={index}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-gray-600 hover:text-amber-600 transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
        aria-label="Share on Twitter"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-colors"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url)
        }}
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-700 hover:text-white transition-colors"
        aria-label="Copy link"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  )
}

function RelatedPostCard({ post }: { post: BlogPost }) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null
  
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="flex gap-4">
        {post.featured_image && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-1">
            {post.title}
          </h4>
          {publishedDate && (
            <time className="text-sm text-gray-500">{publishedDate}</time>
          )}
        </div>
      </Link>
    </article>
  )
}

// ============================================================================
// Markdown Rendering
// ============================================================================

function renderMarkdown(content: string): string {
  // Simple markdown to HTML conversion
  let html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 id="$1" class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, (_, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
      return `<h2 id="${id}" class="text-2xl font-bold text-gray-900 mt-10 mb-4">${text}</h2>`
    })
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-amber-600 hover:text-amber-700 underline">$1</a>')
    // Tables
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(Boolean).map(c => c.trim())
      if (cells.every(c => c.match(/^-+$/))) {
        return '' // Skip separator rows
      }
      const isHeader = cells.every(c => c.length > 0)
      const cellType = isHeader ? 'th' : 'td'
      const cellClass = isHeader 
        ? 'px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50'
        : 'px-4 py-3 text-sm text-gray-600 border-t border-gray-100'
      return `<tr>${cells.map(c => `<${cellType} class="${cellClass}">${c}</${cellType}>`).join('')}</tr>`
    })
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6"><code>$2</code></pre>')
    // Inline code
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-amber-600 px-1.5 py-0.5 rounded text-sm">$1</code>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
  
  // Wrap in paragraph
  html = `<p class="text-gray-700 leading-relaxed mb-4">${html}</p>`
  
  // Wrap table rows
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)+/g, '<table class="w-full border border-gray-200 rounded-lg overflow-hidden my-6">$&</table>')
  
  // Wrap list items
  html = html.replace(/(<li[^>]*>[\s\S]*?<\/li>)+/g, '<ul class="list-disc pl-4 space-y-2 my-4">$&</ul>')
  
  return html
}

// ============================================================================
// Page Component
// ============================================================================

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  const relatedPosts = post.category_id
    ? await getRelatedPosts(post.category_id, post.id)
    : []
  
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null
  
  const postUrl = `https://alakoilandgas.com/blog/${slug}`

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative bg-gray-900 text-white">
        {post.featured_image && (
          <>
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/60" />
          </>
        )}
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              {post.blog_categories && (
                <>
                  <span>/</span>
                  <Link
                    href={`/blog?category=${post.blog_categories.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {post.blog_categories.name}
                  </Link>
                </>
              )}
            </nav>
            
            {/* Category Badge */}
            {post.blog_categories && (
              <Link
                href={`/blog?category=${post.blog_categories.slug}`}
                className="inline-block bg-amber-500/90 text-white text-sm font-medium px-3 py-1 rounded-full mb-4 hover:bg-amber-500 transition-colors"
              >
                {post.blog_categories.name}
              </Link>
            )}
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {post.author_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white">{post.author_name || 'Alak Team'}</p>
                  {post.author_role && (
                    <p className="text-sm">{post.author_role}</p>
                  )}
                </div>
              </div>
              
              {publishedDate && (
                <time dateTime={post.published_at || ''} className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {publishedDate}
                </time>
              )}
              
              {post.view_count !== null && post.view_count !== undefined && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.view_count.toLocaleString()} views
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-200">
                {post.excerpt}
              </p>
            )}
            
            {/* Post Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content || '') }}
            />
            
            {/* Analysis Summary (for auto-generated posts) */}
            {post.analysis_summary && (
              <div className="mt-10 p-6 bg-amber-50 rounded-xl border border-amber-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Market Analysis Summary
                </h3>
                <p className="text-gray-700">{post.analysis_summary}</p>
              </div>
            )}
            
            {/* Market Outlook (for auto-generated posts) */}
            {post.market_outlook && (
              <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Market Outlook
                </h3>
                <p className="text-gray-700">{post.market_outlook}</p>
              </div>
            )}
            
            {/* Key Factors (for auto-generated posts) */}
            {post.key_factors && post.key_factors.length > 0 && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Factors to Watch
                </h3>
                <ul className="space-y-2">
                  {post.key_factors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Share & Navigation */}
            <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <ShareButtons title={post.title} url={postUrl} />
              
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Posts
              </Link>
            </div>
          </div>
          
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Table of Contents */}
            {post.content && (
              <TableOfContents content={post.content} />
            )}
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </div>
            )}
            
            {/* CTA */}
            <div className="bg-amber-50 rounded-xl p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">
                Need Market Insights?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Connect with our team for personalized market analysis.
              </p>
              <Link
                href="/contact"
                className="inline-block w-full bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </aside>
        </div>
      </div>
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: post.featured_image,
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
            author: {
              '@type': 'Person',
              name: post.author_name || 'Alak Team',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Alak Oil & Gas Company Limited',
              logo: {
                '@type': 'ImageObject',
                url: 'https://alakoilandgas.com/images/logo/alak-logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': postUrl,
            },
          }),
        }}
      />
    </article>
  )
}
