import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ReferenceComponent } from '../helpers/ReferenceComponent'

export default Node.create({
    // configuration …
    name: 'referenceNode',
    group: 'inline',
    content: 'inline*',
    inline: true,
    draggable: true,

    addCommands(): any {
        return {
            setReference: (editor: any, attr: any) => ({ commands }: any) => {
                const { view, state } = editor
                const { from, to } = view.state.selection
                const text = state.doc.textBetween(from, to, '')
                const isReference = Object.keys(editor.getAttributes('referenceNode')).length
                if (!editor.view.state.selection.empty) {
                    if (isReference) {
                        return true
                    }
                    return commands.insertContent({ type: 'referenceNode', attrs:{
                        content: text,
                        name: attr.name,
                        id: attr.id,
                        type: attr.type
                    } })
                }
            },
            unsetReference: () => ({ commands }: any) => {
                return commands.unsetNode(this.name)
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'reference',
            },
        ]
    },

    addAttributes() {
        return {
            id: {
                default: 0,
            },
            type: {
                default: 'character'
            },
            name: {
                default: 'Name'
            },
            content: {
                default: 'Reference'
            }
        }
    },

    renderHTML({ HTMLAttributes }) {
        return ['reference', mergeAttributes(HTMLAttributes), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ReferenceComponent)
    },
})