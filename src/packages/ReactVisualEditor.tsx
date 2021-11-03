import './ReactVisualEditor.scss'
import {ReactVisualEditorConfig, ReactVisualEditorValue} from './ReactVisualEditor.utils'
import {useMemo} from "react";
import {ReactVisualEditorBlocks} from "./ReactVisualEditorBlocks";

export const ReactVisualEditor: React.FC<{
  value: ReactVisualEditorValue, // 编辑器编辑的数据类型
  onChange: (val: ReactVisualEditorValue) => void,
  config: ReactVisualEditorConfig  // 组件数据类型，包括Map，Array，以及注册一个组件的方法
}> = (props) => {
  console.log(props);
  // @ts-ignore

  const containerStyle = useMemo(() => {
    return {
      height: `${props.value.container.height}px`,
      width: `${props.value.container.width}px`
    }
  }, [props.value.container.width, props.value.container.height])

  console.log('props.value.blocks', props.value.blocks)

  return (
    <div className="react-visual-editor">
      <div className="react-visual-editor-menu">
        {props.config.componentArray.map((component, index) => {
          return (
            <div className="react-visual-editor-menu-item" key={index}>
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
        <div className="react-visual-editor-container" style={containerStyle}>
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
