import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useState } from 'react';
import { uploadContentImage } from '../../lib/storage';
const A = {
  DEEP:    '#3D2921',
  MUTED:   'rgba(61,41,33,0.72)',
  HAIR:    'rgba(61,41,33,0.08)',
  HAIR2:   'rgba(61,41,33,0.14)',
  CREAM2:  '#F1ECE3',
  TERRA:   '#C1856A',
};

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function BlogEditor({ content, onChange }: Props) {
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: 'Začni písať článok…' }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploadingImg(true);
    setImgError(null);
    try {
      const result = await uploadContentImage(file, 'blog');
      editor.chain().focus().setImage({ src: result.url, alt: '' }).run();
    } catch (err: any) {
      setImgError(err.message ?? 'Nahrávanie zlyhalo');
    } finally {
      setUploadingImg(false);
      e.target.value = '';
    }
  };

  if (!editor) return null;

  const Btn = ({
    active, onClick, label, title, disabled,
  }: {
    active?: boolean; onClick: () => void; label: string; title: string; disabled?: boolean;
  }) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      className="px-2 py-0.5 rounded text-xs font-medium transition-colors disabled:opacity-40"
      style={{ background: active ? A.CREAM2 : 'transparent', color: active ? A.DEEP : A.MUTED, fontWeight: active ? 600 : 400 }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${A.HAIR}` }}>
      {/* Fixed toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5" style={{ background: A.CREAM2, borderBottom: `1px solid ${A.HAIR}` }}>
        <Btn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="B" title="Tučné (⌘B)" />
        <Btn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="I" title="Kurzíva (⌘I)" />
        <div className="w-px h-4 mx-0.5" style={{ background: A.HAIR2 }} />
        <Btn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2" title="Nadpis sekcie" />
        <Btn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="H3" title="Podnadpis" />
        <div className="w-px h-4 mx-0.5" style={{ background: A.HAIR2 }} />
        <Btn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="❝ Citát" title="Pull quote — zobrazí sa ako zvýraznený citát" />
        <Btn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} label="— HR" title="Oddeľovač" />
        <div className="w-px h-4 mx-0.5" style={{ background: A.HAIR2 }} />
        <button
          type="button"
          title="Vložiť obrázok (JPEG, PNG, WebP)"
          disabled={uploadingImg}
          onMouseDown={e => { e.preventDefault(); imageInputRef.current?.click(); }}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors disabled:opacity-40"
          style={{ color: A.MUTED }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
          {uploadingImg ? 'Nahrávam…' : 'Obrázok'}
        </button>
        <span className="ml-auto text-xs" style={{ color: A.MUTED }}>
          Vyber text → menu
        </span>
      </div>

      {/* Floating bubble menu on text selection */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 120, placement: 'top' }}
        className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg shadow-xl"
        style={{ background: '#FFFFFF', border: `1px solid ${A.HAIR}`, boxShadow: '0 4px 16px rgba(61,41,33,0.10)' }}
      >
        <Btn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="B" title="Tučné" />
        <Btn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="I" title="Kurzíva" />
        <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
        <Btn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2" title="Nadpis sekcie" />
        <Btn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="H3" title="Podnadpis" />
        <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
        <Btn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="❝" title="Pull quote" />
      </BubbleMenu>

      {/* Editor content area */}
      <EditorContent
        editor={editor}
        className="blog-editor-prose px-5 py-4 min-h-64 cursor-text"
        style={{ background: '#FFFFFF' }}
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleImageFile}
      />

      {imgError && (
        <p className="px-3 py-1.5 text-xs bg-red-50 border-t border-red-100" style={{ color: A.TERRA }}>
          {imgError}
        </p>
      )}
    </div>
  );
}
