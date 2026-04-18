import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

export const generateDocx = async (title: string, data: Record<string, any>, templateUrl: string) => {
  try {
    const response = await fetch(templateUrl);
    if (!response.ok) {
      throw new Error(`Gagal mengunduh template: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    
    doc.render(data);
    
    const blob = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    saveAs(blob, `${safeTitle}.docx`);
  } catch (error) {
    console.error("Docxtemplater error:", error);
    throw error;
  }
};
