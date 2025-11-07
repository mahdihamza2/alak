import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/client';
import { z } from 'zod';

// Validation schema
const inquirySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  category: z.enum(['verified-buyer', 'verified-seller', 'strategic-partner']),
  productType: z.enum(['crude-oil', 'pms', 'ago', 'jet-fuel', 'multiple']),
  estimatedVolume: z.string().min(1, 'Volume is required'),
  volumeUnit: z.enum(['BBLs', 'MT', 'Liters']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = inquirySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Prepare inquiry data for database
    const inquiryData = {
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      company_name: data.companyName,
      category: data.category,
      product_type: data.productType,
      estimated_volume: data.estimatedVolume,
      volume_unit: data.volumeUnit,
      message: data.message,
    };

    // Insert into database
    const inquiry = await db.inquiries.create(inquiryData);

    // TODO: Send email notifications to admin team
    // await sendAdminNotification(inquiry);

    // TODO: Send confirmation email to user
    // await sendUserConfirmation(inquiry);

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        inquiryId: inquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting inquiry:', error);

    return NextResponse.json(
      {
        error: 'Failed to submit inquiry',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint should be protected with authentication in production
    const inquiries = await db.inquiries.getAll();

    return NextResponse.json({
      success: true,
      data: inquiries,
      count: inquiries.length,
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch inquiries',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
