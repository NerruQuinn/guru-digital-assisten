import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const DebugLastDoc = () => {
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLastDoc = async () => {
      try {
        const { data, error } = await supabase
          .from('generated_documents')
          .select('title, output_content')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setDoc(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLastDoc();
  }, []);

  if (loading) return <div className="p-8">Memuat...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!doc) return <div className="p-8">Tidak ada dokumen.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{doc.title}</h2>
      <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-sm font-mono whitespace-pre-wrap">
        {JSON.stringify(doc.output_content, null, 2)}
      </pre>
    </div>
  );
};

export default DebugLastDoc;
