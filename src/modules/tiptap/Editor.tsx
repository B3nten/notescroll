import { Dialog } from '@/common/components/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import referenceNode from './referenceNode'
import styles from './editor.module.css'
import * as Toolbar from '@radix-ui/react-toolbar'

import { FaBold, FaItalic, FaStrikethrough, FaHeading, FaListUl, FaListOl } from "react-icons/fa"
import { BiHeading } from 'react-icons/bi'

export function Editor() {

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: styles.editor,
            },
        },
        extensions: [
            StarterKit.configure({
                blockquote: false,
                codeBlock: false,
                code: false,
                heading: {
                    HTMLAttributes: {
                        class: styles.heading,
                    },
                },
                horizontalRule: {
                    HTMLAttributes: {
                        class: styles.horizontalRule
                    }
                },
                orderedList: {
                    HTMLAttributes: {
                        class: styles.orderedlist
                    }
                },
                bulletList: {
                    HTMLAttributes: {
                        class: styles.unorderedlist
                    }
                }
            }),
            referenceNode,

        ],
        content: `<p>Hello World! 🌎️</p>`,
    })

    function setReference() {
        //@ts-ignore
        editor?.chain().focus().setReference(editor, { id: '090909', type: 'poop', name: 'lolol' }).run()
    }

    return (
        <div className='group rounded-lg p-2'>
            <Toolbar.Root className='flex h-0 group-focus-within:h-10 items-center space-x-4 border-stone-700 shadow-lg rounded-lg group-focus-within:mb-3 overflow-clip transition-all'>
                <Toolbar.Button onClick={() => editor?.chain().focus().toggleBold().run()}>
                    <FaBold />
                </Toolbar.Button>
                <Toolbar.Button onClick={() => editor?.chain().focus().toggleItalic().run()}>
                    <FaItalic />
                </Toolbar.Button>
                <Toolbar.Button onClick={() => editor?.chain().focus().toggleStrike().run()}>
                    <FaStrikethrough />
                </Toolbar.Button>

                <Toolbar.Separator className='h-6 w-[1px] bg-black' />

                <Toolbar.Button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                    <FaHeading />
                </Toolbar.Button>
                <Toolbar.Button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <BiHeading />
                </Toolbar.Button>

                <Toolbar.Separator className='h-6 w-[1px] bg-black' />

                <Toolbar.Button onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                    <FaListUl />
                </Toolbar.Button>
                <Toolbar.Button onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                    <FaListOl/>
                </Toolbar.Button>

                <Toolbar.Separator className='h-6 w-[1px] bg-black' />

                <Toolbar.Button asChild>
                    <div>
                        <Dialog
                            trigger={<button disabled={editor?.view.state.selection.empty} className='p-2'>Add Reference</button>}>
                            <DialogClose asChild>
                                <button onClick={() => setReference()}>Set Reference</button>
                            </DialogClose>
                        </Dialog>
                    </div>
                </Toolbar.Button>
                <Toolbar.Button asChild>
                    <button onClick={() => console.log(editor?.getJSON())} className='p-2'>Print json</button>
                </Toolbar.Button>
                <Toolbar.Button asChild>
                    <button onClick={() => console.log(editor?.getHTML())} className='p-2'>Print html</button>
                </Toolbar.Button>
            </Toolbar.Root>
            <EditorContent className='peer' editor={editor} />
        </div>
    )
}


