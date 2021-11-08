import './ReactVisualEditor.scss'
import {
  creatVisualBlock,
  ReactVisualEditorBlock,
  ReactVisualEditorComponent,
  ReactVisualEditorConfig,
  ReactVisualEditorValue
} from './ReactVisualEditor.utils'
import {useMemo, useRef} from "react";
import {ReactVisualEditorBlocks} from "./ReactVisualEditorBlocks";
import {useCallbackRef} from "./hook/useCallbackRefs";
import {Simulate} from "react-dom/test-utils";


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

  // 计算当前的blocks中有哪些block是选中的，哪些是未选中的
  const focusData = useMemo(() => {
    const focus: ReactVisualEditorBlock[] = []
    const unfocus: ReactVisualEditorBlock[] = []
    props.value.blocks.forEach((block) => {
      (block.focus ? focus : unfocus).push(block)
    })
    return {focus, unfocus}
  }, [props.value.blocks])

  // 对外暴露的方法
  const methods = {
    // 更新block触发重新渲染
    updateBlocks: (blocks: ReactVisualEditorBlock[]) => {
      props.onChange({...props.value, blocks: [...blocks]})
    },
    // 清空选中的元素
    clearFocus: (external?: ReactVisualEditorBlock) => {
      (!!external ? focusData.focus.filter(item => item !== external) : focusData.focus).forEach(block => block.focus = false)
      {
        methods.updateBlocks(props.value.blocks)
      }
    }
  }

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
                adjustPostion: true,
                focus: true
              })
            ]
          })
        })
      }
      return block
    })()

  // block元素选中事件
  const focusHandler = (() => {
    const mousedownBlock = ((e: React.MouseEvent<HTMLDivElement>, block: ReactVisualEditorBlock) => {
      if (e.shiftKey) {
        // 摁住shift键时，如果此时没有选中的block，则选中这个block，否则令这个block的状态取反
        if (focusData.focus.length <= 1) {
          block.focus = true
        } else {
          block.focus = !block.focus
        }
        methods.updateBlocks(props.value.blocks)
      } else {
        // 如果点击的block没有被选中，才清空其他的block，否则不做任何事情，防止拖拽多个block时去掉其他的focus
        if (!block.focus) {
          console.log('block', block)
          block.focus = true
          methods.clearFocus(block)
        }
      }
      setTimeout(()=>{blockDraggier.mousedown(e)})
    })
    const mousedownContainer = ((e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) {
        return
      }
      if (!e.shiftKey) {
        methods.clearFocus()
      }
    })
    return {
      block: mousedownBlock,
      container: mousedownContainer
    }
  })()

  // block元素在container中的拖拽事件
  const blockDraggier = (() => {
    const dragData = useRef({
      startX: 0,  // 拖拽开始时鼠标的left值
      startY: 0,  // 拖拽开始时鼠标的top值
      startPosArray: [] as { top: number, left: number }[]   // 拖拽开始时所有选中的block元素的left值和top值
    })
    const mousedown = useCallbackRef((e: React.MouseEvent<HTMLDivElement>) => {
      // @ts-ignore
      document.addEventListener('mousemove', mousemove)
      // @ts-ignore
      document.addEventListener('mouseup', mouseup)
      console.log('mousedown', focusData.focus)
      dragData.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosArray: focusData.focus.map(({top, left}) => ({top, left}))
      }
      console.log('dragData', dragData)
    })
    const mousemove = useCallbackRef((e: React.MouseEvent) => {
      const {startX, startY,startPosArray} = dragData.current
      const {clientY: moveY, clientX: moveX} = e
      const durX = moveX - startX
      const durY = moveY - startY
      focusData.focus.forEach((block, index) => {
        const {left, top} = startPosArray[index]
        block.top = top + durY
        block.left = left + durX
      })
      methods.updateBlocks(props.value.blocks)
    })
    const mouseup = useCallbackRef((e: React.MouseEvent) => {
      // @ts-ignore
      document.removeEventListener('mousemove', mousemove)
      // @ts-ignore
      document.removeEventListener('mouseup', mouseup)
    })
    return {mousedown}
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
        <div className="react-visual-editor-container"
             style={containerStyle}
             ref={containerRef}
             onMouseDown={focusHandler.container}
        >
          {props.value.blocks.map((block, index) => {
            return (
              <ReactVisualEditorBlocks
                key={index}
                block={block}
                config={props.config}
                onMouseDown={e => focusHandler.block(e, block)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
