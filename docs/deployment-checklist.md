# Deployment Checklist - Alak Oil and Gas Website

**Project:** Corporate Website & CMS Platform  
**Target Date:** Ready for Production  
**Status:** ✅ Development Complete

---

## Pre-Deployment Checklist

### 1. Content & Assets

- [ ] **Replace Placeholder PDFs** in `/public/docs/`

  - [ ] certificate-of-incorporation.pdf (CAC RC: 8867061)
  - [ ] tin-certificate.pdf (FIRS TIN: 33567270-0001)
  - [ ] anti-corruption-policy.pdf
  - [ ] kyc-aml-statement.pdf

- [ ] **Update Contact Information** in `/app/(marketing)/contact/page.tsx`

  - [ ] Replace `+234 803 XXX XXXX` with actual Abuja phone
  - [ ] Replace `+234 805 XXX XXXX` with actual Lagos phone
  - [ ] Update `abuja@alakoilandgas.com` (if different)
  - [ ] Update `lagos@alakoilandgas.com` (if different)
  - [ ] Update `info@alakoilandgas.com` (if different)

- [ ] **Add Actual Google Maps Coordinates**

  - [ ] Abuja office: Gwarimpa Estate - get embed code
  - [ ] Lagos office: Lekki Phase 1 - get embed code
  - [ ] Replace placeholder embed URLs in Contact page

- [ ] **Add Executive Profile Photos** (Optional)

  - [ ] Kabiru Jibril headshot
  - [ ] Aliyu Ahmad Sunusi headshot
  - [ ] Update About page with actual images

- [ ] **Verify All Company Details**
  - [x] RC: 8867061 (correct)
  - [x] TIN: 33567270-0001 (correct)
  - [x] Established: 2018 (correct)
  - [ ] Confirm office addresses
  - [ ] Verify executive names and titles

---

### 2. Environment Setup

- [x] **Supabase Configuration**

  - [x] Project created: mliyqrihgddylezuxtqe
  - [x] Database schema applied
  - [x] RLS policies enabled
  - [x] Environment variables set

- [ ] **Domain Configuration**

  - [ ] Purchase domain (if not already owned)
  - [ ] Configure DNS settings
  - [ ] Set up SSL certificate (automatic with Vercel)

- [ ] **Email Setup** (Future)

  - [ ] Configure SMTP for notifications
  - [ ] Set up admin notification email
  - [ ] Create email templates

- [ ] **Analytics Setup**
  - [ ] Create Google Analytics 4 property
  - [ ] Add GA_MEASUREMENT_ID to environment variables
  - [ ] Verify tracking code installation

---

### 3. Code Quality

- [x] **TypeScript Compilation**

  ```bash
  npm run build
  ```

  - [x] No type errors
  - [x] No build warnings

- [x] **Component Testing**

  - [x] All pages render without errors
  - [x] Forms validate correctly
  - [x] Navigation works across all pages
  - [x] Mobile responsive on all viewports

- [ ] **Browser Testing**

  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)
  - [ ] Mobile Safari (iOS)
  - [ ] Mobile Chrome (Android)

- [ ] **Accessibility Audit**
  - [ ] Run Lighthouse accessibility check
  - [ ] Test with screen reader
  - [ ] Verify keyboard navigation
  - [ ] Check color contrast ratios
  - [ ] Ensure WCAG 2.2 AA compliance

---

### 4. Security Review

- [x] **Environment Variables**

  - [x] `.env.local` not committed to Git
  - [x] Production variables configured in Vercel
  - [x] No sensitive data in client-side code

- [x] **Database Security**

  - [x] RLS policies enabled on all tables
  - [x] Proper role assignments (anon, authenticated)
  - [x] No SQL injection vulnerabilities

- [ ] **API Security** (Future Enhancements)

  - [ ] Rate limiting on API routes
  - [ ] CORS configuration
  - [ ] reCAPTCHA v3 on contact form
  - [ ] Input sanitization review

- [ ] **Content Security**
  - [ ] CSP headers configured
  - [ ] XSS protection verified
  - [ ] HTTPS enforced
  - [ ] Secure cookie settings

---

### 5. Performance Optimization

- [ ] **Run Lighthouse Audit**

  - [ ] Performance score ≥ 90
  - [ ] Accessibility score ≥ 90
  - [ ] Best Practices score ≥ 90
  - [ ] SEO score ≥ 90

- [ ] **Core Web Vitals**

  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1

- [ ] **Image Optimization**

  - [ ] All images compressed
  - [ ] WebP/AVIF formats used
  - [ ] Proper alt text on all images
  - [ ] Lazy loading implemented

- [ ] **Bundle Size**
  - [ ] Analyze bundle with `npm run build`
  - [ ] Remove unused dependencies
  - [ ] Tree-shaking verified

---

### 6. SEO Setup

- [ ] **Meta Tags**

  - [x] Title tags on all pages
  - [x] Meta descriptions
  - [x] Open Graph tags
  - [x] Twitter Card tags
  - [ ] Canonical URLs

- [ ] **Structured Data**

  - [ ] Organization schema
  - [ ] LocalBusiness schema (both offices)
  - [ ] BreadcrumbList schema
  - [ ] Validate with Google Rich Results Test

- [ ] **Sitemap & Robots**

  - [ ] Generate sitemap.xml
  - [ ] Create robots.txt
  - [ ] Submit to Google Search Console
  - [ ] Submit to Bing Webmaster Tools

- [ ] **Content SEO**
  - [ ] Keyword research complete
  - [ ] H1 tags properly structured
  - [ ] Internal linking strategy
  - [ ] Image alt text descriptive

---

### 7. Functionality Testing

- [ ] **Homepage**

  - [ ] Hero section displays correctly
  - [ ] Trust badges show RC/TIN
  - [ ] CTA buttons link correctly
  - [ ] Value props render
  - [ ] Smooth scroll to sections

- [ ] **About Page**

  - [ ] Company story section loads
  - [ ] Core values display
  - [ ] Executive profiles render
  - [ ] LinkedIn links work (when added)

- [ ] **Compliance Page**

  - [ ] RC copy-to-clipboard works
  - [ ] TIN copy-to-clipboard works
  - [ ] PDF download links work (after adding files)
  - [ ] Compliance areas display

- [ ] **Services Page**

  - [ ] All 4 products display
  - [ ] Availability badges show correct colors
  - [ ] Grade pills render
  - [ ] Request quote buttons link to contact

- [ ] **Contact Page**

  - [ ] Step 1 validation works
  - [ ] Step 2 category selection works
  - [ ] Step 3 message and terms work
  - [ ] Form submits successfully
  - [ ] Success message displays
  - [ ] Error handling works
  - [ ] Google Maps load

- [ ] **Dashboard**
  - [ ] KPI cards show correct numbers
  - [ ] Inquiries display in list
  - [ ] Status badges show correct colors
  - [ ] Email/phone links work
  - [ ] Loading state displays

---

### 8. Database Verification

- [x] **Schema Applied**

  - [x] inquiries table exists
  - [x] inquiry_logs table exists
  - [x] Indexes created
  - [x] Triggers active

- [x] **RLS Policies**

  - [x] Anonymous can INSERT inquiries
  - [x] Authenticated can SELECT inquiries
  - [x] Authenticated can UPDATE inquiries
  - [x] Logs are properly protected

- [ ] **Test Data**
  - [ ] Submit test inquiry via form
  - [ ] Verify appears in dashboard
  - [ ] Check Supabase table directly
  - [ ] Delete test data before launch

---

### 9. Monitoring Setup

- [ ] **Error Tracking**

  - [ ] Sentry account created
  - [ ] Sentry DSN added to environment
  - [ ] Error boundaries implemented
  - [ ] Test error reporting

- [ ] **Uptime Monitoring**

  - [ ] UptimeRobot or Pingdom configured
  - [ ] Alert notifications set up
  - [ ] Status page created (optional)

- [ ] **Analytics**

  - [ ] Google Analytics installed
  - [ ] Conversion goals configured
  - [ ] Event tracking verified
  - [ ] Real-time reports working

- [ ] **Database Monitoring**
  - [ ] Supabase dashboard alerts configured
  - [ ] Query performance reviewed
  - [ ] Backup schedule verified

---

### 10. Documentation

- [x] **README.md**

  - [x] Project overview
  - [x] Tech stack documented
  - [x] Setup instructions
  - [x] Deployment guide

- [x] **Technical Documentation**

  - [x] Architecture documented
  - [x] Database schema documented
  - [x] Component library documented
  - [x] API routes documented

- [x] **Deployment Guide**

  - [x] Environment variables listed
  - [x] Build process documented
  - [x] Post-deployment checklist
  - [x] Troubleshooting guide

- [ ] **User Guide** (Future)
  - [ ] Admin dashboard usage
  - [ ] Inquiry management workflow
  - [ ] Content update procedures

---

## Deployment Steps

### Step 1: Final Build Test

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build for production
npm run build

# Test production build locally
npm start
```

### Step 2: Vercel Deployment

```bash
# Install Vercel CLI (if not already)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**Alternative: GitHub Integration**

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Auto-deploy on push to main

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://mliyqrihgddylezuxtqe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GA_MEASUREMENT_ID = G-XXXXXXXXXX (when ready)
```

### Step 4: Domain Configuration

1. **Add Domain in Vercel:**

   - Go to Project Settings → Domains
   - Add custom domain (e.g., alakoilandgas.com)

2. **Update DNS Records:**

   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 3600

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Wait for SSL Certificate:**
   - Vercel auto-provisions SSL
   - Usually takes 5-15 minutes

### Step 5: Post-Deployment Verification

- [ ] Visit production URL
- [ ] Test all pages load
- [ ] Submit test inquiry
- [ ] Check dashboard shows inquiry
- [ ] Verify SSL certificate (🔒 in browser)
- [ ] Test on mobile device
- [ ] Check Google Analytics tracking

---

## Post-Launch Tasks

### Week 1

- [ ] Monitor error logs daily
- [ ] Check inquiry submissions
- [ ] Review analytics data
- [ ] Test all forms multiple times
- [ ] Gather initial user feedback

### Week 2-4

- [ ] Optimize based on analytics
- [ ] Fix any reported issues
- [ ] Update content as needed
- [ ] Submit sitemap to search engines
- [ ] Begin SEO optimization

### Month 2-3

- [ ] Add blog/insights section
- [ ] Implement email notifications
- [ ] Add reCAPTCHA v3
- [ ] Enhance admin dashboard
- [ ] Create inquiry detail page

---

## Rollback Plan

If critical issues occur post-deployment:

### Option 1: Rollback via Vercel

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Option 2: Revert Git Commit

```bash
git revert HEAD
git push origin main
# Vercel auto-deploys reverted version
```

### Option 3: Emergency Maintenance

1. Deploy maintenance page
2. Fix issues locally
3. Test thoroughly
4. Redeploy

---

## Support Contacts

### Technical Issues

- **Vercel Support:** support@vercel.com
- **Supabase Support:** support@supabase.com
- **Domain Registrar:** [Your registrar support]

### Project Team

- **Developer:** [Your contact info]
- **Project Manager:** [If applicable]
- **Client Contact:** Alak Oil and Gas

---

## Success Criteria

Launch is considered successful when:

✅ All pages load without errors  
✅ Contact form submits successfully  
✅ Dashboard displays inquiries  
✅ SSL certificate is active  
✅ Mobile experience is smooth  
✅ PageSpeed score ≥ 85  
✅ No critical accessibility issues  
✅ Analytics tracking confirmed

---

## Notes

- Keep `.env.local` secure and never commit to Git
- Test PDF downloads after uploading actual certificates
- Update Google Maps coordinates before launch
- Consider adding WhatsApp business link in footer
- Plan content calendar for blog section (Phase 2)

---

**Deployment Status:** 🟡 Ready for Pre-Launch Review  
**Blocker Items:** PDF certificates, actual phone numbers, Google Maps coordinates  
**Target Launch:** Upon completion of content items

_Last Updated: November 7, 2025_
