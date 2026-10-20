import {act} from 'react'
import {createRoot} from 'react-dom/client'
import {expect,it,vi} from 'vitest'
import RichEditor from '../garden/RichEditor'
it('does not create a dirty draft merely by opening existing Markdown',async()=>{
 const element=document.createElement('div');document.body.appendChild(element);const root=createRoot(element),changed=vi.fn();
 await act(async()=>{root.render(<RichEditor value={'## 现有文章\n\n已有正文。\n'} onChange={changed} onError={vi.fn()}/>);await new Promise(r=>setTimeout(r,30))});
 expect(element.querySelector('.tiptap')).toBeTruthy();expect(changed).not.toHaveBeenCalled();
 await act(async()=>{root.render(<RichEditor value={'## 导入的文章\n\n![界面](/garden/avatar-480.webp)'} onChange={changed} onError={vi.fn()}/>);await new Promise(r=>setTimeout(r,20))});
 expect(changed).toHaveBeenCalled();expect(changed.mock.lastCall?.[1].type).toBe('doc');
 // Restoring a server snapshot remounts the editor, rather than treating the
 // restored Markdown as a new external edit that dirties the saved draft.
 changed.mockClear();
 await act(async()=>{root.render(<RichEditor key="restored-version" value={'## 现有文章\n\n已有正文。\n'} onChange={changed} onError={vi.fn()}/>);await new Promise(r=>setTimeout(r,20))});
 expect(changed).not.toHaveBeenCalled();
 await act(async()=>root.unmount());element.remove();
})
