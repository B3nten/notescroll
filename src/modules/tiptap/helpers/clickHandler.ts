
import { getAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { MarkType } from 'prosemirror-model'

type ClickHandlerOptions = {
  type: MarkType,
}

export function clickHandler(options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('handleClickReference'),
    props: {
      handleClick: (view, pos, event) => {
        const attrs = getAttributes(view.state, options.type.name)
        const reference = (event.target as HTMLElement)?.closest('[data-reference]')

        if (reference && event.button === 2) {
          //@ts-ignore
          console.log(options.type.instance.attrs.reference)
          return true
        }

        return false
      },
    },
  })
}