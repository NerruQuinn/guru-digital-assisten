import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export const generateDocx = async (title: string, content: string) => {
  // Parsing the string content line by line
  const lines = content.split('\n');
  const paragraphs: Paragraph[] = [];

  // Add the title at the top, centered and bold
  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: 'center',
      children: [
        new TextRun({
          text: title,
          bold: true,
          font: 'Times New Roman',
          size: 24, // 12pt
        }),
      ],
      spacing: {
        after: 400,
      },
    })
  );

  // Process the rest of the lines based on basic Markdown headings
  for (let line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      // Empty line -> empty paragraph to preserve spacing
      paragraphs.push(new Paragraph({ children: [] }));
      continue;
    }

    if (trimmedLine.startsWith('## ')) {
      // Heading 2
      const text = trimmedLine.replace(/^##\s+/, '');
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: text,
              bold: true,
              font: 'Times New Roman',
              size: 24, // 12pt
            }),
          ],
          spacing: {
            before: 240,
            after: 120,
          },
        })
      );
    } else if (trimmedLine.startsWith('# ')) {
      // Heading 1
      const text = trimmedLine.replace(/^#\s+/, '');
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({
              text: text,
              bold: true,
              font: 'Times New Roman',
              size: 24, // 12pt
            }),
          ],
          spacing: {
            before: 300,
            after: 150,
          },
        })
      );
    } else {
      // Normal paragraph
      // Quick check for bold markdown syntax (**text**) within standard line
      const textRuns: TextRun[] = [];
      const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
      
      parts.forEach(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          textRuns.push(
            new TextRun({
              text: part.replace(/\*\*/g, ''),
              bold: true,
              font: 'Times New Roman',
              size: 24, // 12pt
            })
          );
        } else if (part) {
          textRuns.push(
            new TextRun({
              text: part,
              font: 'Times New Roman',
              size: 24, // 12pt
            })
          );
        }
      });

      paragraphs.push(
        new Paragraph({
          children: textRuns,
          spacing: {
            after: 120,
          },
        })
      );
    }
  }

  // Define cm to twips converter (1 cm = ~567 twips)
  // Top/bottom 2.54 cm = ~1440 twips (1 inch)
  // Left/Right 3 cm = ~1701 twips
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1701,
              right: 1701,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  // Export and download
  const blob = await Packer.toBlob(doc);
  
  // Create safe filename
  const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  saveAs(blob, `${safeTitle}.docx`);
};
