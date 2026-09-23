/**
 * Utility to generate standalone printable HTML, trigger real PDF file downloads,
 * or open high-fidelity document views in a new tab.
 */

export interface PDFExportOptions {
  filename: string;
  title: string;
  htmlContent: string;
  isArabic?: boolean;
}

/**
 * Wraps content in a complete, self-contained, beautifully styled HTML document
 * ready for browser print-to-PDF or direct saving.
 */
export const buildPrintableHtmlDocument = ({
  title,
  htmlContent,
  isArabic = true
}: {
  title: string;
  htmlContent: string;
  isArabic?: boolean;
}): string => {
  return `<!DOCTYPE html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: ${isArabic ? "'Cairo', sans-serif" : "'Inter', -apple-system, sans-serif"};
      background-color: #ffffff;
      color: #111827;
      margin: 0;
      padding: 24px;
      line-height: 1.6;
      font-size: 13px;
    }
    .print-sheet {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
    }
    .gold-accent {
      color: #b8860b;
    }
    .gold-bg {
      background-color: #d4af37 !important;
      color: #000000 !important;
    }
    .gold-border {
      border-color: #d4af37 !important;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px 12px;
      text-align: ${isArabic ? 'right' : 'left'};
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-sheet">
    ${htmlContent}
  </div>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      // Auto-trigger print dialog when opened
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
};

/**
 * Directly downloads the content as an HTML/PDF document file to the client computer.
 */
export const downloadDocumentFile = ({
  filename,
  title,
  htmlContent,
  isArabic = true
}: PDFExportOptions): void => {
  const completeHtml = buildPrintableHtmlDocument({
    title,
    htmlContent,
    isArabic
  });

  const blob = new Blob([completeHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

/**
 * Generates an object URL for a standalone printable HTML document.
 * Provides both text/html or application/pdf compatibility for anchor downloads.
 */
export const getDocumentBlobUrl = ({
  title,
  htmlContent,
  isArabic = true,
  mimeType = 'text/html;charset=utf-8'
}: {
  title: string;
  htmlContent: string;
  isArabic?: boolean;
  mimeType?: string;
}): string => {
  const completeHtml = buildPrintableHtmlDocument({
    title,
    htmlContent,
    isArabic
  });
  const blob = new Blob([completeHtml], { type: mimeType });
  return URL.createObjectURL(blob);
};

/**
 * Opens the high-fidelity document in a new tab with an instant print-to-PDF trigger.
 */
export const openDocumentInNewTab = ({
  title,
  htmlContent,
  isArabic = true
}: {
  title: string;
  htmlContent: string;
  isArabic?: boolean;
}): void => {
  const completeHtml = buildPrintableHtmlDocument({
    title,
    htmlContent,
    isArabic
  });

  const blob = new Blob([completeHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 30000);
};
