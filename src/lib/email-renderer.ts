import { BrandIdentity, EmailContent, EmailTemplateDef } from '@/types';
import { EMAIL_TEMPLATES } from './templates-data';

export function renderEmailHtml(
  content: EmailContent,
  brand: BrandIdentity,
  templates: EmailTemplateDef[] = EMAIL_TEMPLATES
): string {
  const isRtl = content.language !== 'en';
  const dir = isRtl ? 'rtl' : 'ltr';
  const align = isRtl ? 'right' : 'left';
  const oppositeAlign = isRtl ? 'left' : 'right';

  const primaryColor = brand.primaryColor || '#ba9555';
  const secondaryColor = brand.secondaryColor || '#221f1f';
  const accentColor = brand.accentColor || '#d3c6b4';
  const bgColor = brand.backgroundColor || '#fcf9f5';
  const fontBody = isRtl
    ? "'Thmanyah Sans', 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif"
    : "'Thmanyah Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const fontDisplay = isRtl
    ? "'Thmanyah Serif Display', 'Thmanyah Sans', 'Amiri', serif"
    : "'Thmanyah Serif Display', 'Georgia', 'Times New Roman', serif";

  const templateDef = templates.find((t) => t.id === content.templateId) || EMAIL_TEMPLATES[0];

  // Urgency badge styling
  let urgencyBadge = '';
  if (content.urgency === 'urgent') {
    urgencyBadge = `
      <span style="display: inline-block; background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
        ${isRtl ? '⚠️ عاجل وهام للغاية' : '⚠️ URGENT & CRITICAL'}
      </span>
    `;
  } else if (content.urgency === 'high') {
    urgencyBadge = `
      <span style="display: inline-block; background-color: #fffbeb; color: #b45309; border: 1px solid #fde68a; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
        ${isRtl ? '⭐ أولوية مرتفعة' : '⭐ HIGH PRIORITY'}
      </span>
    `;
  }

  // Template specific layout blocks
  let templateSpecificHeaderHtml = '';

  if (templateDef && templateDef.isCustom) {
    const tmplAccent = templateDef.accentColor || primaryColor;
    templateSpecificHeaderHtml = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background: linear-gradient(135deg, ${tmplAccent}18 0%, rgba(34,31,31,0.02) 100%); border-${align}: 4px solid ${tmplAccent}; border-radius: 10px; padding: 16px 20px;">
        <tr>
          <td align="${align}">
            <div style="font-size: 11px; font-weight: 800; color: ${tmplAccent}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
              ✨ ${isRtl ? templateDef.nameAr : templateDef.nameEn}
            </div>
            <div style="font-size: 13px; color: ${secondaryColor}; font-weight: 500;">
              ${isRtl ? templateDef.descriptionAr : templateDef.descriptionEn}
            </div>
          </td>
        </tr>
      </table>
    `;
  } else if (content.templateId === 'announcement') {
    templateSpecificHeaderHtml = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(186,149,85,0.08) 0%, rgba(34,31,31,0.02) 100%); border: 1px solid ${accentColor}; border-radius: 12px; padding: 18px 24px;">
        <tr>
          <td align="${align}">
            <div style="font-size: 11px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
              ${isRtl ? 'تعميم إداري رسمي معتمد' : 'OFFICIAL EXECUTIVE DIRECTIVE'}
            </div>
            <div style="font-size: 14px; color: ${secondaryColor}; font-weight: 600;">
              ${brand.companyNameAr} | ${isRtl ? 'الإدارة العامة' : 'Corporate Governance'}
            </div>
          </td>
        </tr>
      </table>
    `;
  } else if (content.templateId === 'meeting_invitation') {
    templateSpecificHeaderHtml = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-right: ${isRtl ? '4px solid #3b82f6' : 'none'}; border-radius: 8px; padding: 16px 20px;">
        <tr>
          <td align="${align}">
            <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; margin-bottom: 4px;">
              📅 ${isRtl ? 'دعوة اجتماع رسمي' : 'CALENDAR INVITATION'}
            </div>
            <div style="font-size: 13px; color: #475569;">
              ${isRtl ? 'يرجى تأكيد الحضور وإضافة الموعد إلى جدول أعمالكم' : 'Please RSVP and save this appointment to your calendar'}
            </div>
          </td>
        </tr>
      </table>
    `;
  } else if (content.templateId === 'employee_appreciation') {
    templateSpecificHeaderHtml = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background: radial-gradient(circle at center, #fffbeb 0%, #fef3c7 100%); border: 1px solid #fde68a; border-radius: 14px; padding: 22px; text-align: center;">
        <tr>
          <td align="center">
            <div style="font-size: 32px; line-height: 1; margin-bottom: 8px;">🏆</div>
            <div style="font-size: 13px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1px;">
              ${isRtl ? 'لوحة الشرف وشهادة التقدير المؤسسي' : 'CORPORATE RECOGNITION & COMMENDATION'}
            </div>
            <div style="font-size: 12px; color: #92400e; margin-top: 4px;">
              ${isRtl ? 'احتفاءً بالتميز والإتقان والمساهمات الاستثنائية' : 'Celebrating excellence, impact, and dedicated craftsmanship'}
            </div>
          </td>
        </tr>
      </table>
    `;
  } else if (content.templateId === 'important_reminder') {
    templateSpecificHeaderHtml = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 10px; padding: 16px 20px;">
        <tr>
          <td align="${align}">
            <div style="font-size: 12px; font-weight: 800; color: #b91c1c; margin-bottom: 4px;">
              ⏰ ${isRtl ? 'تنبيه بموعد حاسم ومهمة واجبة الإنجاز' : 'CRITICAL ACTION REQUIRED — DEADLINE ALERT'}
            </div>
            <div style="font-size: 13px; color: #7f1d1d;">
              ${isRtl ? 'يرجى اتخاذ الإجراء اللازم قبل إغلاق الفترة المحددة' : 'Please take necessary action prior to the expiration deadline'}
            </div>
          </td>
        </tr>
      </table>
    `;
  }

  // Sections builder
  let sectionsHtml = '';
  if (content.sections && content.sections.length > 0) {
    sectionsHtml = content.sections
      .map((sec) => {
        let secContentHtml = '';

        if (sec.type === 'bullet_list' && Array.isArray(sec.data)) {
          const items = sec.data
            .map(
              (item) => `
              <li style="margin-bottom: 8px; color: #374151; font-size: 14.5px; line-height: 1.6;">
                ${item}
              </li>`
            )
            .join('');
          secContentHtml = `
            ${sec.content ? `<p style="margin: 0 0 10px 0; color: #374151; font-size: 14.5px; line-height: 1.6;">${sec.content}</p>` : ''}
            <ul style="margin: 0 0 16px 0; padding-inline-start: 22px; list-style-type: square; color: ${primaryColor};">
              ${items}
            </ul>
          `;
        } else if (sec.type === 'key_value' && sec.data && typeof sec.data === 'object') {
          const rows = Object.entries(sec.data as Record<string, string>)
            .map(
              ([k, v]) => `
              <tr>
                <td style="padding: 10px 14px; background-color: #f9fafb; font-weight: 700; font-size: 13.5px; color: #1f2937; border-bottom: 1px solid #e5e7eb; width: 34%;" align="${align}">
                  ${k}
                </td>
                <td style="padding: 10px 14px; background-color: #ffffff; font-size: 14px; color: #374151; border-bottom: 1px solid #e5e7eb;" align="${align}">
                  ${v}
                </td>
              </tr>
            `
            )
            .join('');

          secContentHtml = `
            ${sec.content ? `<p style="margin: 0 0 12px 0; color: #374151; font-size: 14.5px; line-height: 1.6;">${sec.content}</p>` : ''}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 16px; border-collapse: collapse;">
              ${rows}
            </table>
          `;
        } else if (sec.type === 'callout') {
          secContentHtml = `
            <div style="background-color: #f8fafc; border-${align}: 4px solid ${primaryColor}; border-radius: 6px; padding: 14px 18px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #1e293b;">
              ${sec.content}
            </div>
          `;
        } else {
          // Normal paragraph
          secContentHtml = `
            <p style="margin: 0 0 16px 0; color: #374151; font-size: 15px; line-height: 1.7; text-align: justify;">
              ${sec.content}
            </p>
          `;
        }

        return `
          <div style="margin-bottom: 22px;">
            ${
              sec.title
                ? `<h3 style="font-family: ${fontDisplay}; font-size: 16.5px; font-weight: 700; color: ${secondaryColor}; margin: 0 0 10px 0; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9; text-align: ${align};">
                    ${sec.title}
                  </h3>`
                : ''
            }
            ${secContentHtml}
          </div>
        `;
      })
      .join('');
  }

  // Call to action button
  let ctaHtml = '';
  if (content.callToAction && content.callToAction.text) {
    ctaHtml = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0 20px 0;">
        <tr>
          <td align="${align}">
            <a href="${content.callToAction.url || '#'}" target="_blank" style="display: inline-block; background-color: ${primaryColor}; color: #ffffff; font-family: ${fontBody}; font-size: 14.5px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px; box-shadow: 0 2px 4px rgba(186,149,85,0.25); text-align: center;">
              ${content.callToAction.text}
            </a>
          </td>
        </tr>
      </table>
    `;
  }

  // Signature Block
  const sig = brand.officialSignature;
  const signatureHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 36px; padding-top: 24px; border-top: 2px solid #f1f5f9;">
      <tr>
        <td align="${align}">
          <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">
            ${isRtl ? 'مع أطيب التحيات والتقدير،' : 'Warm regards & best wishes,'}
          </div>
          <div style="font-family: ${fontDisplay}; font-size: 16px; font-weight: 700; color: ${secondaryColor}; margin-bottom: 2px;">
            ${isRtl ? sig.signerNameAr : sig.signerNameEn}
          </div>
          <div style="font-size: 13px; font-weight: 600; color: ${primaryColor}; margin-bottom: 2px;">
            ${isRtl ? sig.signerTitleAr : sig.signerTitleEn}
          </div>
          <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
            ${isRtl ? sig.departmentAr : sig.departmentEn} • ${isRtl ? brand.companyNameAr : brand.companyNameEn}
          </div>
          <div style="font-size: 11.5px; color: #94a3b8;">
            📞 ${brand.phone} &nbsp;|&nbsp; 🌐 <a href="${brand.website}" style="color: ${primaryColor}; text-decoration: none;">${brand.website.replace('https://', '')}</a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 18px;">
          <div style="font-size: 10.5px; line-height: 1.5; color: #94a3b8; background-color: #f8fafc; padding: 10px 14px; border-radius: 6px; border: 1px dashed #e2e8f0; text-align: justify;">
            ${isRtl ? sig.disclaimerAr : sig.disclaimerEn}
          </div>
        </td>
      </tr>
    </table>
  `;

  // Full HTML Email Document
  return `<!DOCTYPE html>
<html lang="${content.language}" dir="${dir}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${content.subject}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${bgColor}; }
    @media screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .email-content { padding: 20px 16px !important; }
      .header-logo { height: 28px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: ${bgColor}; font-family: ${fontBody}; direction: ${dir}; text-align: ${align}; color: #374151;">
  <!-- Outlook / MSO Wrapper -->
  <center style="width: 100%; background-color: ${bgColor};">
    <!--[if (gte mso 9)|(IE)]>
    <table role="presentation" width="640" align="center" style="width: 640px; margin: 0 auto;">
    <tr>
    <td>
    <![endif]-->
    <div style="max-width: 640px; margin: 0 auto;" class="email-container">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid rgba(34,31,31,0.08); box-shadow: 0 4px 18px rgba(34,31,31,0.04); overflow: hidden; margin: 0 auto;">
        
        <!-- Top Branded Header -->
        <tr>
          <td style="background-color: ${secondaryColor}; padding: 18px 28px; border-bottom: 3px solid ${primaryColor};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="${align}" style="vertical-align: middle;">
                  <img src="${brand.logoUrl}" alt="${brand.companyNameAr}" height="32" class="header-logo" style="display: block; max-height: 34px; width: auto; object-fit: contain; filter: brightness(0) invert(1);" />
                </td>
                <td align="${oppositeAlign}" style="vertical-align: middle;">
                  <span style="font-family: ${fontBody}; font-size: 11.5px; font-weight: 600; color: ${accentColor}; letter-spacing: 0.5px; text-transform: uppercase;">
                    ${isRtl ? brand.companyNameAr : brand.companyNameEn}
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Main Body -->
        <tr>
          <td style="padding: 32px 32px 24px 32px;" class="email-content">
            
            ${urgencyBadge}

            <!-- Headline -->
            <h1 style="font-family: ${fontDisplay}; font-size: 21px; font-weight: 700; color: ${secondaryColor}; margin: 0 0 14px 0; line-height: 1.35; text-align: ${align};">
              ${content.headline || content.subject}
            </h1>

            <!-- Summary / Opening -->
            ${
              content.summary
                ? `
              <div style="font-size: 15px; line-height: 1.65; color: #4b5563; margin-bottom: 22px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6; text-align: justify;">
                ${content.summary}
              </div>
            `
                : ''
            }

            <!-- Template-specific visual header (e.g. Directive Seal, Calendar Card, Award laurel, or Custom Banner) -->
            ${templateSpecificHeaderHtml}

            <!-- Structured Sections -->
            ${sectionsHtml}

            <!-- Call to Action -->
            ${ctaHtml}

            <!-- Signature -->
            ${signatureHtml}

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 20px 28px; border-top: 1px solid #edf2f7; text-align: center;">
            <p style="margin: 0 0 6px 0; font-size: 11.5px; color: #64748b;">
              ${brand.emailFooterNote}
            </p>
            <p style="margin: 0; font-size: 11px; color: #94a3b8;">
              ${isRtl ? brand.addressAr : brand.addressEn} • <a href="mailto:${brand.supportEmail}" style="color: ${primaryColor}; text-decoration: none;">${brand.supportEmail}</a>
            </p>
          </td>
        </tr>

      </table>
    </div>
    <!--[if (gte mso 9)|(IE)]>
    </td>
    </tr>
    </table>
    <![endif]-->
  </center>
</body>
</html>`;
}
