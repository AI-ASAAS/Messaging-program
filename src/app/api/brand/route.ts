import { NextRequest, NextResponse } from 'next/server';
import { getBrand, updateBrand } from '@/lib/db';

export async function GET() {
  try {
    const brand = getBrand();
    return NextResponse.json({ brand });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateBrand(body);
    return NextResponse.json({ brand: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
