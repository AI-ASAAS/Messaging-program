import { NextRequest, NextResponse } from 'next/server';
import { addMember, deleteMember, getMembers, updateMember } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.toLowerCase();
    const department = searchParams.get('department');

    let members = getMembers();

    if (department && department !== 'ALL') {
      members = members.filter((m) => m.department === department);
    }

    if (q) {
      members = members.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.nameEn.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q) ||
          m.titleAr.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, nameEn, email, role = 'member', department, phone, titleAr, titleEn } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    // Check duplicate email
    const existing = getMembers().find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'A member with this email already exists' }, { status: 400 });
    }

    const member = addMember({
      name,
      nameEn: nameEn || name,
      email: email.toLowerCase().trim(),
      role,
      department: department || 'General',
      phone: phone || '',
      titleAr: titleAr || 'عضو فريق',
      titleEn: titleEn || 'Team Member',
      initials: '',
      status: 'active',
    });

    return NextResponse.json({ member });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const updated = updateMember(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ member: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const success = deleteMember(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
