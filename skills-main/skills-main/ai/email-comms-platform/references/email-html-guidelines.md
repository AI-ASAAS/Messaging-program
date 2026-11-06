# Email HTML Rendering & Client Compatibility

This reference establishes the engineering rules for rendering HTML emails compatible with Microsoft Outlook (Desktop & Web), Gmail (Web, iOS, Android), Apple Mail, and standard email clients.

## Critical Invariants

1. **Table-Based Architecture**:
   - Modern flexbox and CSS grid are not supported in Microsoft Outlook (Word rendering engine).
   - All email structures must use `table role="presentation"` with `cellpadding="0"` and `cellspacing="0"`.
   - Maximum width of container: `640px` centered via `<center>` tag.

2. **Inline CSS Styles**:
   - Webmail clients strip external `<link rel="stylesheet">` tags.
   - All typography, colors, padding, and alignments are inlined directly into `style=""` attributes.

3. **Microsoft Outlook (MSO) Conditional Wrappers**:
   - Wrapped with conditional HTML comments so Outlook renders tables with fixed width `640px`:
   ```html
   <!--[if (gte mso 9)|(IE)]>
   <table role="presentation" width="640" align="center" style="width: 640px; margin: 0 auto;">
   <tr>
   <td>
   <![endif]-->
   ... email content ...
   <!--[if (gte mso 9)|(IE)]>
   </td>
   </tr>
   </table>
   <![endif]-->
   ```

4. **Right-to-Left (RTL) Localization**:
   - HTML documents set `<html lang="ar" dir="rtl">`.
   - CSS text alignments mirror dynamically: `align="right"` in Arabic, `align="left"` in English.
   - Punctuation and brackets are normalized to prevent glyph reversal.

5. **Safe Bulletproof Buttons**:
   - Call-to-action buttons use padding on `<a>` tags with inline block display and background color.
   - Color contrast ratio between text and background exceeds WCAG AAA (4.5:1).
