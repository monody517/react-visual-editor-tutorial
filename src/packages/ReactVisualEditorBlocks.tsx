import {ReactVisualEditorBlock, ReactVisualEditorConfig} from "./ReactVisualEditor.utils";
import {useMemo} from "react";

export const ReactVisualEditorBlocks: React.FC<{
  block: ReactVisualEditorBlock,
  config: ReactVisualEditorConfig
}> = (props) => {

  const style = useMemo(() => {
    return {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`
    }
  }, [props.block.top, props.block.left])

  const component = props.config.componentMap[props.block.componentKey]
  let render: any;
  if(component){
    render = component.render()
  }

  console.log('style',style)

  return (
    <div className="react-visual-editor-block" style={style}>
      {render}
    </div>
  )
}
