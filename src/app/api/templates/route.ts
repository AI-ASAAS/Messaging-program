import { NextRequest, NextResponse } from 'next/server';
import { addCustomTemplate, deleteCustomTemplate, getTemplates } from '@/lib/db';

export async function GET() {
  try {
    const templates = getTemplates();
    return NextResponse.json({ templates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      category = 'custom',
      icon = 'LayoutTemplate',
      accentColor = '#ba9555',
      defaultSubjectAr,
      defaultSubjectEn,
      features = [],
    } = body;

    if (!nameAr || !defaultSubjectAr) {
      return NextResponse.json(
        { error: 'اسم القالب والعنوان الافتراضي بالعربية مطلوبان' },
        { status: 400 }
      );
    }

    const created = addCustomTemplate({
      slug: (nameEn || nameAr).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      nameAr,
      nameEn: nameEn || nameAr,
      descriptionAr: descriptionAr || nameAr,
      descriptionEn: descriptionEn || nameEn || nameAr,
      icon,
      accentColor,
      defaultSubjectAr,
      defaultSubjectEn: defaultSubjectEn || defaultSubjectAr,
      features: features.length > 0 ? features : ['قالب مؤسسي مخصص', 'هوية الشركة الرسمية'],
    });

    return NextResponse.json({ template: created, success: true });
  } catch (error: any) {
    console.error('API /api/templates POST error:', error);
    return NextResponse.json(
      { error: error.message || 'فشل إنشاء القالب المخصص' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const success = deleteCustomTemplate(id);
    if (!success) {
      return NextResponse.json({ error: 'Template not found or cannot be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
