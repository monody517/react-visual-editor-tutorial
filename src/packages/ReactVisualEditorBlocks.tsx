/** container中的每一个子组件，在这里设置了样式和渲染函数 */

import {ReactVisualEditorBlock, ReactVisualEditorConfig} from "./ReactVisualEditor.utils";
import {useEffect, useMemo, useRef} from "react";
import {useUpdate} from "./hook/useUpdate";
import classNames from "classnames";

export const ReactVisualEditorBlocks: React.FC<{
  block: ReactVisualEditorBlock,
  config: ReactVisualEditorConfig,
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void,
}> = (props) => {

  const style = useMemo(() => { // 可拖拽组件的样式，由App的editorValue中的block确定，主要确定位置
    return {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      opacity: props.block.adjustPostion ? '0' : '',
    }
  }, [props.block.top, props.block.left, props.block.adjustPostion])

  const classes = useMemo(() => classNames([
    'react-visual-editor-block',
    {
      'react-visual-editor-focus': props.block.focus
    }
  ]), [props.block.focus])

  const eleRef = useRef({} as HTMLDivElement)
  const {froceUpdate} = useUpdate()


  useEffect(() => {  // block的adjustPostion为true时调整block的位置居中
    if (props.block.adjustPostion) {
      const {top, left} = props.block
      const {width, height} = eleRef.current.getBoundingClientRect()
      props.block.adjustPostion = false
      props.block.top = top - height / 2
      props.block.left = left - width / 2
      froceUpdate()// 强制刷新页面,否则修改了数值但不重新渲染
    }
  }, [])

  const component = props.config.componentMap[props.block.componentKey]
  let render: any;
  if (component) {
    render = component.render() // 渲染函数
  }

  return (
    <div className={classes} style={style} ref={eleRef} onMouseDown={props.onMouseDown}>
      {render}
    </div>
  )
}
