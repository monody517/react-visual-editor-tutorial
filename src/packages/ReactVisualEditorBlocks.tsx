/** container中的每一个子组件，在这里设置了样式和渲染函数 */

import {ReactVisualEditorBlock, ReactVisualEditorConfig} from "./ReactVisualEditor.utils";
import {useMemo} from "react";

export const ReactVisualEditorBlocks: React.FC<{
  block: ReactVisualEditorBlock,
  config: ReactVisualEditorConfig
}> = (props) => {

  const style = useMemo(() => { // 可拖拽组件的样式，由App的editorValue中的block确定，主要确定位置
    return {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`
    }
  }, [props.block.top, props.block.left])

  const component = props.config.componentMap[props.block.componentKey]
  let render: any;
  if(component){
    render = component.render() // 渲染函数
  }

  return (
    <div className="react-visual-editor-block" style={style}>
      {render}
    </div>
  )
}
