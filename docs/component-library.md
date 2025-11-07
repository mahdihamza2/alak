# Component Library Reference - Alak Oil and Gas

**Quick Reference Guide for All Reusable Components**

---

## Button Component

**Location:** `/components/ui/Button.tsx`

### Import

```tsx
import Button from "@/components/ui/Button";
```

### Props

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
}
```

### Usage Examples

**Primary CTA Button:**

```tsx
<Button variant="primary" size="lg">
  Get Started
</Button>
```

**Secondary Action:**

```tsx
<Button variant="secondary" size="md">
  Learn More
</Button>
```

**Outlined Button:**

```tsx
<Button variant="outline" size="md">
  View Details
</Button>
```

**Ghost Button:**

```tsx
<Button variant="ghost" size="sm">
  Cancel
</Button>
```

**Danger Button:**

```tsx
<Button variant="danger" size="md">
  Delete
</Button>
```

**Full Width:**

```tsx
<Button variant="primary" size="lg" fullWidth>
  Submit Form
</Button>
```

### Styling Classes

**Primary (Gold):**

- Background: `bg-gold-500`
- Hover: `hover:bg-gold-600`
- Text: `text-navy-950`

**Secondary (Blue):**

- Background: `bg-blue-700`
- Hover: `hover:bg-blue-600`
- Text: `text-white`

**Outline:**

- Border: `border-2 border-blue-700`
- Text: `text-blue-700`
- Hover: `hover:bg-blue-700 hover:text-white`

---

## Card Component

**Location:** `/components/ui/Card.tsx`

### Import

```tsx
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
```

### Props

```typescript
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}
```

### Usage Examples

**Basic Card:**

```tsx
<Card>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
</Card>
```

**Full Card with All Subcomponents:**

```tsx
<Card hover padding="lg">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Action</Button>
  </CardFooter>
</Card>
```

**Compact Card:**

```tsx
<Card padding="sm">
  <CardTitle>Quick Info</CardTitle>
  <p className="text-sm">Brief content</p>
</Card>
```

**No Padding Card (for images):**

```tsx
<Card padding="none">
  <img src="/image.jpg" alt="..." className="w-full rounded-t-xl" />
  <div className="p-6">
    <CardTitle>Image Card</CardTitle>
  </div>
</Card>
```

---

## Input Component

**Location:** `/components/ui/Input.tsx`

### Import

```tsx
import Input from "@/components/ui/Input";
```

### Props

```typescript
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

### Usage Examples

**Basic Input:**

```tsx
<Input label="Full Name" placeholder="Enter your name" required />
```

**Input with Error:**

```tsx
<Input
  label="Email Address"
  type="email"
  error="Invalid email format"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Input with Helper Text:**

```tsx
<Input
  label="Phone Number"
  type="tel"
  helperText="Include country code"
  placeholder="+234 XXX XXX XXXX"
/>
```

**Disabled Input:**

```tsx
<Input label="Account Status" value="Active" disabled />
```

**With React Hook Form:**

```tsx
<Input
  label="Company Name"
  error={errors.companyName?.message}
  {...register("companyName")}
/>
```

---

## Textarea Component

**Location:** `/components/ui/Textarea.tsx`

### Import

```tsx
import Textarea from "@/components/ui/Textarea";
```

### Props

```typescript
interface TextareaProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
```

### Usage Examples

**Basic Textarea:**

```tsx
<Textarea
  label="Message"
  placeholder="Enter your message..."
  rows={6}
  required
/>
```

**With Character Count:**

```tsx
<Textarea
  label="Description"
  helperText={`${description.length}/500 characters`}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
/>
```

**With Error State:**

```tsx
<Textarea
  label="Comments"
  error="Message must be at least 10 characters"
  value={comments}
  onChange={(e) => setComments(e.target.value)}
/>
```

---

## Select Component

**Location:** `/components/ui/Select.tsx`

### Import

```tsx
import Select from "@/components/ui/Select";
```

### Props

```typescript
interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}
```

### Usage Examples

**Basic Select:**

```tsx
<Select label="Category" required>
  <option value="">Select category...</option>
  <option value="buyer">Verified Buyer</option>
  <option value="seller">Verified Seller</option>
  <option value="partner">Strategic Partner</option>
</Select>
```

**With Error:**

```tsx
<Select
  label="Product Type"
  error="Please select a product"
  value={productType}
  onChange={(e) => setProductType(e.target.value)}
>
  <option value="">Select product...</option>
  <option value="crude-oil">Crude Oil</option>
  <option value="pms">PMS (Gasoline)</option>
  <option value="ago">AGO (Diesel)</option>
</Select>
```

**Grouped Options:**

```tsx
<Select label="Region">
  <optgroup label="Africa">
    <option value="ng">Nigeria</option>
    <option value="gh">Ghana</option>
  </optgroup>
  <optgroup label="Middle East">
    <option value="ae">UAE</option>
    <option value="sa">Saudi Arabia</option>
  </optgroup>
</Select>
```

---

## Badge Component

**Location:** `/components/ui/Badge.tsx`

### Import

```tsx
import Badge from "@/components/ui/Badge";
```

### Props

```typescript
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}
```

### Usage Examples

**Status Badges:**

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Rejected</Badge>
<Badge variant="info">Reviewing</Badge>
<Badge variant="default">Closed</Badge>
```

**With Icons:**

```tsx
<Badge variant="success">
  <CheckCircle size={14} className="mr-1" />
  Verified
</Badge>
```

**Custom Styling:**

```tsx
<Badge variant="info" className="text-xs">
  New
</Badge>
```

### Color Reference

- **default:** Gray background, dark text
- **success:** Green background, green text
- **warning:** Yellow background, yellow text
- **error:** Red background, red text
- **info:** Blue background, blue text

---

## Layout Components

### Header Component

**Location:** `/components/layout/Header.tsx`

**Features:**

- Sticky navigation on scroll
- Mobile hamburger menu
- RC badge in logo
- Smooth transitions
- Active link highlighting

**Usage:**

```tsx
import Header from "@/components/layout/Header";

<Header />;
```

**Navigation Links:**

- Home (/)
- About (/about)
- Compliance (/compliance)
- Services (/services)
- Contact (/contact)

### Footer Component

**Location:** `/components/layout/Footer.tsx`

**Features:**

- 4-column layout
- Dual office information
- Compliance bar with RC/TIN
- Quick links navigation
- Social media placeholders

**Usage:**

```tsx
import Footer from "@/components/layout/Footer";

<Footer />;
```

**Sections:**

1. Company Info (logo + tagline)
2. Quick Links (navigation)
3. Head Office (Abuja)
4. Commercial Office (Lagos)
5. Compliance Bar (RC/TIN)
6. Copyright

---

## Helper Functions

**Location:** `/lib/utils/helpers.ts`

### formatDate

```tsx
import { formatDate } from "@/lib/utils/helpers";

formatDate("2025-11-07"); // "November 7, 2025"
```

### formatDateTime

```tsx
import { formatDateTime } from "@/lib/utils/helpers";

formatDateTime("2025-11-07T14:30:00Z"); // "November 7, 2025, 2:30 PM"
```

### getCategoryLabel

```tsx
import { getCategoryLabel } from "@/lib/utils/helpers";

getCategoryLabel("verified-buyer"); // "Verified Buyer"
getCategoryLabel("verified-seller"); // "Verified Seller"
getCategoryLabel("strategic-partner"); // "Strategic Partner"
```

### getProductLabel

```tsx
import { getProductLabel } from "@/lib/utils/helpers";

getProductLabel("crude-oil"); // "Crude Oil"
getProductLabel("pms"); // "PMS (Gasoline)"
getProductLabel("ago"); // "AGO (Diesel)"
getProductLabel("jet-fuel"); // "Jet Fuel (ATK)"
```

### getStatusLabel

```tsx
import { getStatusLabel } from "@/lib/utils/helpers";

getStatusLabel("pending"); // "Pending Review"
getStatusLabel("reviewing"); // "Under Review"
getStatusLabel("contacted"); // "Contacted"
```

### getStatusColor

```tsx
import { getStatusColor } from "@/lib/utils/helpers";

getStatusColor("pending"); // "bg-warning/10 text-warning"
getStatusColor("qualified"); // "bg-success/10 text-success"
```

### cn (Class Name Merger)

```tsx
import { cn } from "@/lib/utils/cn";

<div className={cn("base-class", isActive && "active-class", className)} />;
```

---

## Database Helpers

**Location:** `/lib/supabase/client.ts`

### Create Inquiry

```tsx
import { db } from "@/lib/supabase/client";

const inquiry = await db.inquiries.create({
  full_name: "John Doe",
  email: "john@example.com",
  phone: "+234 XXX XXX XXXX",
  company_name: "Example Corp",
  category: "verified-buyer",
  product_type: "crude-oil",
  estimated_volume: "500000",
  volume_unit: "BBLs",
  message: "Interested in purchasing...",
});
```

### Get All Inquiries

```tsx
const inquiries = await db.inquiries.getAll();
```

### Get By Status

```tsx
const pending = await db.inquiries.getByStatus("pending");
const qualified = await db.inquiries.getByStatus("qualified");
```

### Get By Category

```tsx
const buyers = await db.inquiries.getByCategory("verified-buyer");
const sellers = await db.inquiries.getByCategory("verified-seller");
```

### Update Status

```tsx
await db.inquiries.updateStatus(
  inquiryId,
  "contacted",
  "Called client on Nov 7th"
);
```

### Get Inquiry Logs

```tsx
const logs = await db.inquiryLogs.getByInquiryId(inquiryId);
```

---

## Common Patterns

### Form Validation Pattern

```tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name too short"),
});

type FormData = z.infer<typeof schema>;

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input label="Name" error={errors.name?.message} {...register("name")} />
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
}
```

### Loading State Pattern

```tsx
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";

export default function DataDisplay() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {data.map((item) => (
        <Card key={item.id}>{/* Card content */}</Card>
      ))}
    </div>
  );
}
```

### Modal/Dialog Pattern

```tsx
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
          <p className="mb-6">Modal content here</p>
          <div className="flex gap-4">
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
```

### Empty State Pattern

```tsx
import { Users } from "lucide-react";
import Card from "@/components/ui/Card";

export default function EmptyState() {
  return (
    <Card>
      <div className="text-center py-12">
        <Users size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No data yet
        </h3>
        <p className="text-slate-600 mb-6">
          Get started by creating your first item
        </p>
        <Button variant="primary">Create New</Button>
      </div>
    </Card>
  );
}
```

---

## Styling Guidelines

### Spacing Scale

```css
gap-2  /* 8px */
gap-4  /* 16px */
gap-6  /* 24px */
gap-8  /* 32px */

p-4    /* 16px padding */
p-6    /* 24px padding */
p-8    /* 32px padding */

py-20  /* 80px vertical (sections) */
```

### Color Classes

```css
/* Navy backgrounds */
bg-navy-950  /* Darkest */
bg-navy-900
bg-navy-800

/* Blue interactive */
bg-blue-700  /* Primary blue */
text-blue-700

/* Gold accents */
bg-gold-500  /* Primary CTA */
text-gold-500

/* Status colors */
text-success  /* Green */
text-warning  /* Yellow */
text-error    /* Red */
```

### Typography

```css
text-xs   /* 12px */
text-sm   /* 14px */
text-base /* 16px */
text-lg   /* 18px */
text-xl   /* 20px */
text-2xl  /* 24px */
text-4xl  /* 36px */
text-6xl  /* 60px */

font-normal
font-semibold
font-bold
```

### Responsive Breakpoints

```css
/* Mobile first */
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

/* Breakpoints */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## Icons Library

**All icons from Lucide React:**

```tsx
import {
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  Droplet,
  Fuel,
  Plane,
  Shield,
  FileCheck,
  Download,
  Copy,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  Calendar,
} from "lucide-react";
```

**Usage:**

```tsx
<CheckCircle size={20} className="text-success" />
<Mail size={16} className="text-slate-500" />
```

---

## Quick Copy Templates

### Page Template

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title | Alak Oil and Gas",
  description: "Page description",
};

export default function PageName() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-navy grid-pattern relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-text-light-primary mb-6">
            Page Title
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">{/* Content here */}</div>
      </section>
    </div>
  );
}
```

### API Route Template

```tsx
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  // Define schema
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = schema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error },
        { status: 400 }
      );
    }

    // Process data

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

**Last Updated:** November 7, 2025  
**Version:** 1.0.0
