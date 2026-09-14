/**
 * GROWVEST Official Certificate of Registration & Incorporation Generator
 * Renders high-resolution institutional certificates and handles instant PNG/PDF downloads.
 */

export interface CompanyCertificateData {
  companyName: string;
  tradingName: string;
  registrationNumber: string;
  crn: string;
  leiCode: string;
  incorporationDate: string;
  jurisdiction: string;
  registeredAddress: string;
  operationalHub: string;
  certifyingAuthority: string;
  status: string;
  digitalVerificationHash: string;
  qrVerificationUrl: string;
}

export const OFFICIAL_CERTIFICATE_DATA: CompanyCertificateData = {
  companyName: 'GROWVEST GLOBAL TECHNOLOGIES INC.',
  tradingName: 'GROWVEST ASSET MANAGEMENT & DIGITAL INFRASTRUCTURE',
  registrationNumber: 'GRZ-849201-UK',
  crn: '14892018',
  leiCode: '984500A492B890F1C812',
  incorporationDate: '14 March 2021',
  jurisdiction: 'Registrar of Companies for England and Wales & Swiss FINMA Standards',
  registeredAddress: '200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom',
  operationalHub: '200 Aldersgate St, Barbican, London EC14 4HD, United Kingdom',
  certifyingAuthority: 'Companies House & Global Financial Regulatory Register',
  status: 'ACTIVE • IN GOOD STANDING • TIER-1 REGISTRATION',
  digitalVerificationHash: 'SHA256: 7b84e5dbd4ff2401f84a4974faa65e6e8c4e07a3f890e12db01a938c4',
  qrVerificationUrl: 'https://growvest.com/verify/cert/GRZ-849201-UK'
};

/**
 * Robust word-wrapping utility for HTML5 Canvas that prevents words from joining or overflowing.
 */
function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: CanvasTextAlign = 'center'
): number {
  ctx.save();
  ctx.textAlign = align;
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + (line === '' ? '' : ' ') + words[n];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line !== '') {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  ctx.restore();
  return currentY;
}

/**
 * Draws a realistic cursive fountain pen signature with pressure and flow
 */
function drawFountainPenStroke(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  color = '#0c1b33',
  baseWidth = 2.8
) {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineWidth = baseWidth + (Math.sin(i * 0.7) * 0.9);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws realistic signatures for Registrar General and Chief Compliance Officer
 */
function drawAuthenticSignatures(
  ctx: CanvasRenderingContext2D,
  sig1X: number,
  sig2X: number,
  sigY: number
) {
  // --- SIGNATURE 1: Sir Alistair Montgomery, CBE (Registrar General) ---
  ctx.save();
  // Flowing 'A' capital flourish
  drawFountainPenStroke(ctx, [
    [sig1X - 130, sigY + 15],
    [sig1X - 120, sigY - 45],
    [sig1X - 110, sigY - 70],
    [sig1X - 95, sigY - 20],
    [sig1X - 85, sigY + 5],
    [sig1X - 115, sigY - 25],
    [sig1X - 70, sigY - 22]
  ], '#091e3a', 3.2);

  // 'listair' connected cursive loops
  drawFountainPenStroke(ctx, [
    [sig1X - 70, sigY - 22],
    [sig1X - 60, sigY - 40],
    [sig1X - 52, sigY - 10],
    [sig1X - 45, sigY - 22],
    [sig1X - 35, sigY - 8],
    [sig1X - 25, sigY - 28],
    [sig1X - 18, sigY - 5],
    [sig1X - 10, sigY - 25],
    [sig1X, sigY - 6]
  ], '#0a2342', 2.4);

  // 'Montgomery' sweeping uppercase M & wave
  drawFountainPenStroke(ctx, [
    [sig1X + 15, sigY + 10],
    [sig1X + 22, sigY - 55],
    [sig1X + 35, sigY - 15],
    [sig1X + 48, sigY - 50],
    [sig1X + 58, sigY + 2],
    [sig1X + 68, sigY - 20],
    [sig1X + 78, sigY - 8],
    [sig1X + 90, sigY - 25],
    [sig1X + 105, sigY - 12],
    [sig1X + 120, sigY - 30],
    [sig1X + 138, sigY - 15]
  ], '#0c1b33', 2.8);

  // Elegant underline flourish with loop back
  drawFountainPenStroke(ctx, [
    [sig1X - 140, sigY + 18],
    [sig1X - 60, sigY + 22],
    [sig1X + 30, sigY + 20],
    [sig1X + 145, sigY + 16],
    [sig1X + 155, sigY + 12],
    [sig1X + 140, sigY + 6],
    [sig1X + 90, sigY + 14]
  ], '#0c1b33', 1.8);

  // T-cross and dots
  drawFountainPenStroke(ctx, [[sig1X - 28, sigY - 35], [sig1X - 12, sigY - 33]], '#0c1b33', 2.0);
  ctx.beginPath();
  ctx.arc(sig1X - 45, sigY - 35, 1.8, 0, Math.PI * 2);
  ctx.arc(sig1X - 10, sigY - 38, 1.8, 0, Math.PI * 2);
  ctx.fillStyle = '#0c1b33';
  ctx.fill();
  ctx.restore();

  // --- SIGNATURE 2: Dr. Elena Vance, LL.M. (Chief Regulatory Officer) ---
  ctx.save();
  // Flowing 'E' flourish
  drawFountainPenStroke(ctx, [
    [sig2X - 125, sigY - 20],
    [sig2X - 110, sigY - 60],
    [sig2X - 85, sigY - 65],
    [sig2X - 95, sigY - 35],
    [sig2X - 75, sigY - 40],
    [sig2X - 90, sigY - 5],
    [sig2X - 65, sigY + 8],
    [sig2X - 50, sigY - 15]
  ], '#091e3a', 3.0);

  // 'lena' cursive strokes
  drawFountainPenStroke(ctx, [
    [sig2X - 50, sigY - 15],
    [sig2X - 40, sigY - 45],
    [sig2X - 32, sigY - 8],
    [sig2X - 22, sigY - 22],
    [sig2X - 12, sigY - 5],
    [sig2X - 2, sigY - 25],
    [sig2X + 8, sigY - 8]
  ], '#0a2342', 2.3);

  // 'Vance' sweeping dynamic V & high ascenders
  drawFountainPenStroke(ctx, [
    [sig2X + 22, sigY - 30],
    [sig2X + 35, sigY + 12],
    [sig2X + 52, sigY - 68],
    [sig2X + 62, sigY - 10],
    [sig2X + 75, sigY - 25],
    [sig2X + 88, sigY - 6],
    [sig2X + 102, sigY - 28],
    [sig2X + 118, sigY - 12],
    [sig2X + 135, sigY - 38],
    [sig2X + 148, sigY + 5]
  ], '#0c1b33', 2.9);

  // Flowing tail flourish
  drawFountainPenStroke(ctx, [
    [sig2X - 135, sigY + 18],
    [sig2X - 40, sigY + 22],
    [sig2X + 60, sigY + 21],
    [sig2X + 155, sigY + 16]
  ], '#0c1b33', 1.8);
  ctx.restore();
}

/**
 * Draws the official certificate on an HTML5 canvas at ultra-high resolution (2400x1680)
 */
export function drawCertificateToCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 2400;
  const height = 1680;
  canvas.width = width;
  canvas.height = height;

  // 1. Background Parchment Texture
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 1400);
  bgGrad.addColorStop(0, '#fdfbf7');
  bgGrad.addColorStop(0.65, '#f5f0e2');
  bgGrad.addColorStop(1, '#ebe3ce');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle security micro-pattern
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < width; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Outer Ornate Double Gold Borders
  ctx.save();
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 16;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  ctx.strokeStyle = '#0f3d2e';
  ctx.lineWidth = 4;
  ctx.strokeRect(84, 84, width - 168, height - 168);

  // Guilloche ornate corner markers
  const drawCorner = (cx: number, cy: number, rot: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(80, 0);
    ctx.lineTo(80, 20);
    ctx.lineTo(20, 20);
    ctx.lineTo(20, 80);
    ctx.lineTo(0, 80);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#0f3d2e';
    ctx.fillRect(28, 28, 24, 24);
    ctx.restore();
  };

  drawCorner(100, 100, 0);
  drawCorner(width - 100, 100, Math.PI / 2);
  drawCorner(width - 100, height - 100, Math.PI);
  drawCorner(100, height - 100, (3 * Math.PI) / 2);
  ctx.restore();

  // 3. Header Crest / Brand Badge
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const crestX = width / 2;
  const crestY = 210;

  // Crest Outer Ring
  ctx.beginPath();
  ctx.arc(crestX, crestY, 60, 0, Math.PI * 2);
  ctx.fillStyle = '#0a2e22';
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Inner Crest Text / Monogram
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 42px "Times New Roman", Times, Georgia, serif';
  ctx.fillText('G', crestX, crestY + 3);

  // Brand Name & Reg Top Header
  ctx.fillStyle = '#0a2e22';
  ctx.font = 'bold 30px "Times New Roman", Times, Georgia, serif';
  ctx.fillText('G R O W V E S T   G L O B A L   T E C H N O L O G I E S', width / 2, 310);

  ctx.fillStyle = '#6b5a3e';
  ctx.font = '600 18px "Georgia", serif';
  ctx.fillText('REGISTRAR OF COMPANIES & FINANCIAL JURISDICTION', width / 2, 350);

  // Divider Line with Center Diamond
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 350, 380);
  ctx.lineTo(width / 2 + 350, 380);
  ctx.stroke();

  ctx.fillStyle = '#c5a059';
  ctx.beginPath();
  ctx.moveTo(width / 2, 372);
  ctx.lineTo(width / 2 + 8, 380);
  ctx.lineTo(width / 2, 388);
  ctx.lineTo(width / 2 - 8, 380);
  ctx.closePath();
  ctx.fill();

  // Main Certificate Title
  ctx.fillStyle = '#0a2e22';
  ctx.font = 'bold 56px "Times New Roman", Times, Georgia, serif';
  ctx.fillText('CERTIFICATE OF INCORPORATION', width / 2, 455);

  ctx.fillStyle = '#8c6b2d';
  ctx.font = 'bold 24px "Georgia", serif';
  ctx.fillText('AND OFFICIAL REGISTRATION OF ENTITY', width / 2, 505);

  // Preamble Text (with exact spacing so words never touch)
  ctx.fillStyle = '#2c332d';
  ctx.font = 'normal 24px "Georgia", serif';
  drawWrappedText(
    ctx,
    'This is to certify that under the Companies Act & Financial Services Regulatory Register, the institution named herein is duly incorporated, legally certified, and recognized in continuous good standing:',
    width / 2,
    565,
    1800,
    36,
    'center'
  );

  // 4. Highlight Box for Company Name & Official Registration Number
  const boxY = 660;
  const boxW = 1900;
  const boxH = 200;
  const boxX = (width - boxW) / 2;

  ctx.fillStyle = '#f8f5eb';
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Company Name
  ctx.fillStyle = '#064e3b';
  ctx.font = 'bold 42px "Times New Roman", Times, Georgia, serif';
  ctx.fillText(OFFICIAL_CERTIFICATE_DATA.companyName, width / 2, boxY + 58);

  // Official Reg Numbers
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 30px "Courier New", Courier, monospace';
  ctx.fillText(`OFFICIAL REGISTRATION NUMBER:  ${OFFICIAL_CERTIFICATE_DATA.registrationNumber}`, width / 2, boxY + 112);

  ctx.fillStyle = '#374151';
  ctx.font = '600 20px "Georgia", serif';
  ctx.fillText(
    `COMPANY REGISTRATION NO. (CRN): ${OFFICIAL_CERTIFICATE_DATA.crn}    •    LEI IDENTIFIER: ${OFFICIAL_CERTIFICATE_DATA.leiCode}`,
    width / 2,
    boxY + 158
  );

  // 5. Detailed Corporate Metadata Grid (2 Columns, strictly bounded width to prevent overlapping)
  ctx.textAlign = 'left';
  const metaStartY = 910;
  const col1X = 320;
  const col2X = 1300;
  const colWidth = 840;

  const drawMetaField = (label: string, value: string, x: number, y: number) => {
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 16px "Georgia", serif';
    ctx.fillText(label.toUpperCase(), x, y);

    ctx.fillStyle = '#111827';
    ctx.font = '600 21px "Georgia", serif';
    drawWrappedText(ctx, value, x, y + 28, colWidth, 28, 'left');
  };

  drawMetaField('Date of Registration & Incorporation', OFFICIAL_CERTIFICATE_DATA.incorporationDate, col1X, metaStartY);
  drawMetaField('Registration & Legal Jurisdiction', 'England & Wales & International FINMA Architecture Standards', col1X, metaStartY + 90);
  drawMetaField('Registered Head Office', OFFICIAL_CERTIFICATE_DATA.registeredAddress, col1X, metaStartY + 180);

  drawMetaField('Corporate Status & Standing', OFFICIAL_CERTIFICATE_DATA.status, col2X, metaStartY);
  drawMetaField('Certified Business Scope', 'Multi-Asset Cryptographic Custody, Settlement Rails & Algorithmic Portfolios', col2X, metaStartY + 90);
  drawMetaField('Operational European Hub', OFFICIAL_CERTIFICATE_DATA.operationalHub, col2X, metaStartY + 180);

  // 6. Official Wax Seal (Bottom Left)
  const sealX = 460;
  const sealY = 1360;
  const sealR = 90;

  // Red Ribbon Tails behind seal
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(sealX - 35, sealY + 60);
  ctx.lineTo(sealX - 55, sealY + 160);
  ctx.lineTo(sealX - 25, sealY + 145);
  ctx.lineTo(sealX, sealY + 160);
  ctx.lineTo(sealX - 10, sealY + 60);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(sealX + 10, sealY + 60);
  ctx.lineTo(sealX, sealY + 160);
  ctx.lineTo(sealX + 25, sealY + 145);
  ctx.lineTo(sealX + 55, sealY + 160);
  ctx.lineTo(sealX + 35, sealY + 60);
  ctx.closePath();
  ctx.fill();

  // Seal Sunburst / Star Ring
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.fillStyle = '#c5a059';
  for (let i = 0; i < 36; i++) {
    ctx.rotate((Math.PI * 2) / 36);
    ctx.fillRect(sealR - 15, -4, 25, 8);
  }
  ctx.restore();

  // Main Seal Body
  const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, sealR);
  sealGrad.addColorStop(0, '#fef08a');
  sealGrad.addColorStop(0.5, '#d4af37');
  sealGrad.addColorStop(1, '#854d0e');
  ctx.fillStyle = sealGrad;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#713f12';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 13px "Times New Roman", serif';
  ctx.fillText('OFFICIAL REGISTRATION', sealX, sealY - 30);
  ctx.font = 'bold 24px "Times New Roman", serif';
  ctx.fillText('GROWVEST', sealX, sealY);
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillText('SEAL 2021-2026', sealX, sealY + 28);

  // 7. REAL SIGNATURES IN CENTER
  const sig1X = 1100;
  const sig2X = 1660;
  const sigY = 1350;

  drawAuthenticSignatures(ctx, sig1X, sig2X, sigY);

  // Underline bar for Signature 1
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sig1X - 140, sigY + 25);
  ctx.lineTo(sig1X + 140, sigY + 25);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px "Georgia", serif';
  ctx.fillText('Sir Alistair Montgomery, CBE', sig1X, sigY + 52);
  ctx.fillStyle = '#64748b';
  ctx.font = '15px "Georgia", serif';
  ctx.fillText('Registrar General of Companies', sig1X, sigY + 76);

  // Underline bar for Signature 2
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sig2X - 140, sigY + 25);
  ctx.lineTo(sig2X + 140, sigY + 25);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px "Georgia", serif';
  ctx.fillText('Dr. Elena Vance, LL.M.', sig2X, sigY + 52);
  ctx.fillStyle = '#64748b';
  ctx.font = '15px "Georgia", serif';
  ctx.fillText('Chief Regulatory & Compliance Officer', sig2X, sigY + 76);

  // 8. Security Footer Hash & Verification Bar
  ctx.fillStyle = '#6b7280';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText(
    `AUTHENTICATED CRYPTOGRAPHIC PROOF:  ${OFFICIAL_CERTIFICATE_DATA.digitalVerificationHash}`,
    width / 2,
    height - 110
  );

  ctx.fillStyle = '#9ca3af';
  ctx.font = '13px "Georgia", serif';
  ctx.fillText(
    'This electronic certificate is digitally signed and officially archived in the Global Financial Registry. For live validation, visit verification registry.',
    width / 2,
    height - 85
  );

  ctx.restore();
}

/**
 * Downloads the high-res PNG certificate image
 */
export function downloadCertificatePNG(filename = 'GROWVEST_Official_Registration_Certificate_GRZ849201.png'): void {
  const canvas = document.createElement('canvas');
  drawCertificateToCanvas(canvas);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

/**
 * Triggers standard browser print dialog tailored for certificate PDF generation
 */
export function printCertificate(): void {
  window.print();
}
