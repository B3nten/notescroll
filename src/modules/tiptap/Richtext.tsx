import { DialogTrigger, DialogContent, Dialog } from '@/common/components/dialog'
import {
	DropdownContent,
	DropdownTrigger,
	Dropdown,
	DropdownItem,
	DropdownGroup,
} from '@/common/components/dropdown'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import referenceNode from './nodes/referenceNode'
import styles from './editor.module.css'
import * as Toolbar from '@radix-ui/react-toolbar'
import { FaBold, FaItalic, FaStrikethrough, FaHeading, FaListUl, FaListOl } from 'react-icons/fa'
import { BiHeading } from 'react-icons/bi'
import { VscReferences } from 'react-icons/vsc'
import { CgFormatHeading } from 'react-icons/cg'
import { AiFillSave } from 'react-icons/ai'
import { Loading } from '@/common/components/loading'
import { useEffect, useState } from 'react'
import isEqual from 'lodash.isequal'
import { ReferenceSearch } from './helpers/ReferenceSearch'
import { useDebounce } from '@/common/hooks/useDebounce'

interface Richtext {
	state?: 'saving' | 'saved' | 'error' | undefined | null
	onChange?: (content: { json: JSONContent; text: string }) => void
	onDebouncedChange?: (content: { json: JSONContent; text: string }) => void
	content?: any
	initialContent?: any
	minHeight?: string
	maxHeight?: string
	editable?: boolean
	toolbarVisible?: boolean
	debounceDelay?: number
}

export function Richtext({
	state,
	content,
	initialContent,
	onChange: onChange,
	onDebouncedChange: onDebouncedChange,
	minHeight = '200px',
	maxHeight = 'none',
	editable = true,
	toolbarVisible = false,
	debounceDelay = 1000,
}: Richtext) {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: `textarea input-ghost ${styles.editor} ${!editable && styles.notEditable}`,
				style: `min-height:${minHeight}; max-height:${maxHeight};`,
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
						class: styles.horizontalRule,
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: styles.orderedlist,
					},
				},
				bulletList: {
					HTMLAttributes: {
						class: styles.unorderedlist,
					},
				},
			}),
			referenceNode,
		],

		onUpdate({ editor }) {
			if (onChange) {
				onChange({ json: editor.getJSON(), text: editor.getText() })
			}
			if (onDebouncedChange) {
				debouncer()
			}
		},
	})

	const debouncer = useDebounce(() => {
		if (onDebouncedChange && editor) {
			onDebouncedChange({ json: editor.getJSON(), text: editor.getText() })
		}
	}, 2000)

	function setReference(id: string, type: string, docName: string) {
		editor
			?.chain()
			.focus()
			//@ts-ignore
			.setReference(editor, { id: id, type: type, name: docName })
			.run()
	}

	// Update content when it changes, as long as it's not the same
	useEffect(() => {
		if (editor && content) {
			if (!isEqual(content, editor.getJSON())) {
				editor?.commands?.setContent(content)
			}
		}
	}, [content, editor])

	// Set initial content once
	const [loadedInitialContent, setLoadedInitialContent] = useState(false)
	useEffect(() => {
		if (editor && initialContent && !loadedInitialContent) {
			editor.commands.setContent(initialContent)
			setLoadedInitialContent(true)
		}
	}, [initialContent, editor, loadedInitialContent])

	// React to editable change
	useEffect(() => {
		editor && editor?.setEditable(editable)
	}, [editor, editable])

	return (
		<div className={`relative group rounded-lg p-2 transition`}>
			<Toolbar.Root
				className={`relative flex px-2 py-1 items-center space-x-1 sm:space-x-2 shadow-lg bg-secondary rounded-lg mb-2 overflow-clip transition-all scale-y-0 group-focus-within:scale-y-100 origin-bottom delay-200 w-full ${
					!editable && 'hidden'
				} ${toolbarVisible && 'scale-y-100'}`}>
				<Toolbar.Button
					onClick={() => editor?.chain().focus().toggleBold().run()}
					disabled={editor?.view.state.selection.empty}
					className={`${styles.button}
                    ${
								editor?.view.state.selection.empty
									? 'opacity-40'
									: 'hover:bg-secondary-focus'
							}  
                    ${editor?.isActive('bold') ? '!border-black' : ''}`}>
					<FaBold className='fill-secondary-content stroke-secondary-content' />
				</Toolbar.Button>
				<Toolbar.Button
					onClick={() => editor?.chain().focus().toggleItalic().run()}
					disabled={editor?.view.state.selection.empty}
					className={`${styles.button}
                    ${
								editor?.view.state.selection.empty
									? 'opacity-40'
									: 'hover:bg-secondary-focus'
							}  
                    ${editor?.isActive('italic') ? '!border-black' : ''}
                    `}>
					<FaItalic className='fill-secondary-content stroke-secondary-content' />
				</Toolbar.Button>
				<Toolbar.Button
					onClick={() => editor?.chain().focus().toggleStrike().run()}
					disabled={editor?.view.state.selection.empty}
					className={`${styles.button}
                    ${
								editor?.view.state.selection.empty
									? 'opacity-40'
									: 'hover:bg-secondary-focus'
							}  
                    ${editor?.isActive('strike') ? '!border-black' : ''}
                    `}>
					<FaStrikethrough className='fill-secondary-content stroke-secondary-content' />
				</Toolbar.Button>

				<Toolbar.Separator className='h-6 w-[1px] bg-accent' />

				<Toolbar.Button
					onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
					className={`${styles.button} hover:bg-secondary-focus hidden sm:block
                                    ${
													editor?.isActive('heading', { level: 1 })
														? '!border-black'
														: ''
												}`}>
					<FaHeading className='fill-secondary-content stroke-secondary-content' />
				</Toolbar.Button>
				<Toolbar.Button
					onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
					className={`${styles.button} hover:bg-secondary-focus hidden sm:block
                                    ${
													editor?.isActive('heading', { level: 2 })
														? '!border-black'
														: ''
												}`}>
					<BiHeading className='fill-secondary-content stroke-secondary-content' />
				</Toolbar.Button>
				<Toolbar.Button
					onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
					className={`${styles.button} hover:bg-secondary-focus hidden sm:block
                                    ${
													editor?.isActive('heading', { level: 3 })
														? '!border-black'
														: ''
												}`}>
					<CgFormatHeading className='stroke-secondary-content fill-secondary-content text-secondary-content' />
				</Toolbar.Button>

				<div className='sm:hidden flex items-center'>
					<Dropdown>
						<DropdownTrigger>
							<button
								className={`${styles.button} hover:bg-secondary-focus
                                        ${
															editor?.isActive('heading', {
																level: 1,
															})
																? '!border-black'
																: ''
														}`}>
								<FaHeading className='fill-secondary-content stroke-secondary-content' />
							</button>
						</DropdownTrigger>
						{/*@ts-ignore*/}
						<DropdownContent>
							<DropdownItem>
								<Toolbar.Button
									onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
									className={`${styles.button} hover:bg-secondary-focus
                                            ${
																editor?.isActive('heading', {
																	level: 1,
																})
																	? '!border-black'
																	: ''
															}`}>
									<FaHeading className='fill-secondary-content stroke-secondary-content' />
								</Toolbar.Button>
							</DropdownItem>
							<DropdownItem>
								<Toolbar.Button
									onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
									className={`${styles.button} hover:bg-secondary-focus
                                            ${
																editor?.isActive('heading', {
																	level: 2,
																})
																	? '!border-black'
																	: ''
															}`}>
									<BiHeading className='fill-secondary-content stroke-secondary-content' />
								</Toolbar.Button>
							</DropdownItem>
							<DropdownItem>
								<Toolbar.Button
									onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
									className={`${styles.button} hover:bg-secondary-focus
                                            ${
																editor?.isActive('heading', {
																	level: 3,
																})
																	? '!border-black'
																	: ''
															}`}>
									<CgFormatHeading className='fill-secondary-content stroke-secondary-content' />
								</Toolbar.Button>
							</DropdownItem>
						</DropdownContent>
					</Dropdown>
				</div>

				<Toolbar.Separator className='h-6 w-[1px] bg-accent' />

				<Toolbar.Button
					onClick={() => editor?.chain().focus().toggleBulletList().run()}
					className={`${styles.button} hover:bg-secondary-focus 
                                ${editor?.isActive('bulletList') ? '!border-black' : ''}`}>
					<FaListUl className='fill-secondary-content stroke-secondary-content' />
				</Toolbar.Button>
				<Toolbar.Button
					onClick={() => editor?.chain().focus().toggleOrderedList().run()}
					className={`${styles.button} hover:bg-secondary-focus 
                                    ${editor?.isActive('orderedList') ? '!border-black' : ''}`}>
					<FaListOl className='fill-secondary-content stroke-secondary-content' />
				</Toolbar.Button>

				<Toolbar.Separator className='h-6 w-[1px] bg-accent' />

				<Toolbar.Button asChild>
					<div className='flex items-center justify-center'>
						<Dialog>
							<DialogTrigger>
								<button
									disabled={editor?.view.state.selection.empty}
									className={`${styles.button}
                                        ${
															editor?.view.state.selection.empty
																? 'opacity-40'
																: 'hover:bg-secondary-focus'
														}`}>
									<div className='flex items-center space-x-1'>
										<span className='text-secondary-content'>Add Reference</span>
										<VscReferences className='fill-secondary-content stroke-secondary-content' />
									</div>
								</button>
							</DialogTrigger>
							<DialogContent title='Add reference'>
								<ReferenceSearch setReference={setReference} />
							</DialogContent>
						</Dialog>
					</div>
				</Toolbar.Button>
				<div className='sm:absolute right-5 flex items-center'>
					{state === 'saved' && <AiFillSave className='fill-primary' />}
					{state === 'saving' && (
						<div className='inline-block'>
							<Loading loaded={[false]} />
						</div>
					)}
					{state === 'error' && <div className='text-error text-sm'>error</div>}
				</div>
			</Toolbar.Root>
			<EditorContent className='peer' editor={editor} />
		</div>
	)
}
