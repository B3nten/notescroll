
import { Dialog } from "@/common/components/dialog"
import { Dropdown } from "@/common/components/dropdown"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import supabase, { logOut } from "@/modules/supabase"
import { Editor } from "@/modules/tiptap/Editor"




export default function Index() {

  return (
    <div className='space-x-2'>
      <button className='text-xl p-2 bg-slate-500 text-white' onClick={logOut}>logout</button>
      <Dialog
        title='Sample dialog'
        trigger={<button className='text-xl p-2 bg-slate-500 text-white'>dialog</button>}>
        <div>THIS IS A DIALOG BOX</div>
      </Dialog>
      <Dialog alert
        action={<button className='px-4 py-2 bg-green-400 rounded-xl'>okay</button>}
        cancel={<button className='px-4 py-2 bg-red-400 rounded-xl'>cancel</button>}
        title='Sample dialog'
        trigger={<button className='text-xl p-2 bg-slate-500 text-white'>alert</button>}>
        <div>THIS IS A DIALOG BOX</div>
      </Dialog>
      <Dropdown
        trigger={<button className='text-xl'>hello ↴</button>}>
        <DropdownMenu.Item>
          <button>test</button>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <button>test 2</button>
        </DropdownMenu.Item>
      </Dropdown>
      <Editor/>
    </div>
  )
}