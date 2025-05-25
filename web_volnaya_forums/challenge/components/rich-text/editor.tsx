import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from '@/components/rich-text/toolbar/editor-toolbar';
import { useEffect } from 'react';

interface EditorProps {
    content: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

const Editor = ({ content, placeholder, onChange }: EditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        editor?.commands.setContent(content);
    }, [content]);

    if (!editor) return <></>;

    return (
        <div className="prose max-w-none w-full border rounded-md border-input bg-background dark:prose-invert grow overflow-hidden shadow-sm">
            <EditorToolbar editor={editor} />
            <div className="editor">
                <EditorContent editor={editor} placeholder={placeholder} spellCheck={false} />
            </div>
        </div>
    );
};

export default Editor;
