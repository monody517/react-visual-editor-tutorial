import './ReactVisualEditor.scss'
import {
  creatVisualBlock,
  ReactVisualEditorComponent,
  ReactVisualEditorConfig,
  ReactVisualEditorValue
} from './ReactVisualEditor.utils'
import {useMemo, useRef} from "react";
import {ReactVisualEditorBlocks} from "./ReactVisualEditorBlocks";
import {useCallbackRef} from "./hook/useCallbackRefs";


export const ReactVisualEditor: React.FC<{
  value: ReactVisualEditorValue, // 编辑器编辑的数据类型
  onChange: (val: ReactVisualEditorValue) => void,
  config: ReactVisualEditorConfig  // 组件数据类型，包括Map，Array，以及注册一个组件的方法
}> = (props) => {

  const containerRef = useRef({} as HTMLDivElement)

  const dragData = useRef({
    dragComponent: null as null | ReactVisualEditorComponent
  })

  const containerStyle = useMemo(() => { // 整个container的样式，由App中的editorValue值确定
    return {
      height: `${props.value.container.height}px`,
      width: `${props.value.container.width}px`
    }
  }, [props.value.container.width, props.value.container.height])

  const menuDraggier = ( // 拖拽事件
    () => {
      const block = {
        dragstart: useCallbackRef((e: React.DragEvent<HTMLDivElement>, dragComponent: ReactVisualEditorComponent) => {
          containerRef.current.addEventListener('dragenter', container.dragenter)
          containerRef.current.addEventListener('dragover', container.dragover)
          containerRef.current.addEventListener('dragleave', container.dragleave)
          containerRef.current.addEventListener('drop', container.drop)
          dragData.current.dragComponent = dragComponent
        }),
        dragend: useCallbackRef((e: React.DragEvent<HTMLDivElement>) => {
          containerRef.current.removeEventListener('dragenter', container.dragenter)
          containerRef.current.removeEventListener('dragover', container.dragover)
          containerRef.current.removeEventListener('dragleave', container.dragleave)
          containerRef.current.removeEventListener('drop', container.drop)
        })
      }
      const container = {
        dragenter: useCallbackRef((e: DragEvent) => {
          e.dataTransfer!.dropEffect = 'move'
        }),
        dragover: useCallbackRef((e: DragEvent) => {
          e.preventDefault()
        }),
        dragleave: useCallbackRef((e: DragEvent) => {
          e.dataTransfer!.dropEffect = 'none'
        }),
        drop: useCallbackRef((e: DragEvent) => {
          console.log('新增block', dragData.current.dragComponent)
          props.onChange({
            ...props.value,
            blocks: [
              ...props.value.blocks,
              creatVisualBlock({
                top: e.offsetY,
                left: e.offsetX,
                component: dragData.current.dragComponent!,
                adjustPostion: true
              })
            ]
          })
        })
      }
      return block
    })()

  return (
    <div className="react-visual-editor">
      <div className="react-visual-editor-menu">
        {props.config.componentArray.map((component, index) => {

          return (
            <div className="react-visual-editor-menu-item"
                 key={index}
                 draggable
                 onDragStart={e => menuDraggier.dragstart(e, component)}
                 onDragEnd={menuDraggier.dragend}
            >
              {component.preview()}
              <div className="react-visual-editor-menu-item-name">
                {component.name}
              </div>
            </div>
          )
        })}
      </div>
      <div className="react-visual-editor-head">head</div>
      <div className="react-visual-editor-operator">operator</div>
      <div className="react-visual-editor-body">
        <div className="react-visual-editor-container" style={containerStyle} ref={containerRef}>
          {props.value.blocks.map((item, index) => {
            return (
              <ReactVisualEditorBlocks
                key={index}
                block={item}
                config={props.config}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
