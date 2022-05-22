import {
    Mark,
    mergeAttributes,
} from '@tiptap/core'
import { clickHandler } from './clickHandler'

const reference = Mark.create({
    name: 'reference',

    addCommands(): any {
        return {
            setReference: () => ({ commands }: any) => {
                return commands.setMark(this.name)
            },
            toggleReference: () => ({ commands }: any) => {
                return commands.toggleMark(this.name)
            },
            unsetReference: () => ({ commands }: any) => {
                return commands.unsetMark(this.name)
            },
        }
    },

    addAttributes() {
        return {
            reference: {
                default: '8989893jhjdh9',
                // Customize the HTML parsing (for example, to load the initial content)
                parseHTML: element => element.getAttribute('data-reference'),
                // … and customize the HTML rendering.
                renderHTML: attributes => {
                    return {
                        'data-reference': attributes.reference,
                        class: 'reference',
                        oncontextmenu: 'return false;'
                    }
                },
            },
        }
    },

    renderHTML({ HTMLAttributes }) {
        return ['reference', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },

    addProseMirrorPlugins(): any {
        const plugins = []

        plugins.push(clickHandler({
            type: this.type
        }))
        return plugins
    }
})

export {reference as reference}