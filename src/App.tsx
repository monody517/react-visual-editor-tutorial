import {useState} from 'react'
import './app.scss'
import {ReactVisualEditor} from './packages/ReactVisualEditor'
import {ReactVisualEditorValue} from './packages/ReactVisualEditor.utils'
import {visualConfig} from './visual.config'


export default () => {
  // const [pos,setPos] = useState({
  //     left: 0,
  //     top:0
  // })

  // const moveDraggier = (()=>{

  //     const dragData = useRef({
  //         startTop: 0,          // 拖拽开始时block的top值
  //         startLeft: 0,         // 拖拽开始时block的left值
  //         startX: 0,            // 拖拽开始时鼠标的X值
  //         startY: 0             // 拖拽开始时鼠标的Y值
  //     })

  //     const mouseDown = useCallbackRef((e:React.MouseEvent<HTMLDivElement>)=>{
  //         document.addEventListener('mousemove',mouseMove),
  //         document.addEventListener('mouseup',mouseUp),
  //         dragData.current = {
  //             startTop: pos.top,
  //             startLeft: pos.left,
  //             startX: e.clientX,
  //             startY: e.clientY
  //         }
  //     })
  //     const mouseMove = useCallbackRef((e:MouseEvent)=>{  // move函数一直不变，但是执行的是传入的最新的传入函数
  //         const {startX,startY,startLeft,startTop} = dragData.current
  //         const durX = e.clientX
  //         const durY = e.clientY
  //         setPos({
  //             top: startTop + durY,
  //             left: startLeft + durX
  //         })
  //         console.log(pos);

  //     })
  //     const mouseUp = useCallbackRef(()=>{
  //         document.removeEventListener('mousemove',mouseMove)
  //         document.removeEventListener('mouseup',mouseUp)
  //     })
  //     return {mouseDown}
  // })()

  const [editorValue, setEditorValue] = useState(() => {
    const val: ReactVisualEditorValue = {
      container: {
        width: 1000,
        height: 500
      },
      blocks: [
        {
          componentKey: 'text',
          top: 100,
          left: 100
        },
        {
          componentKey: 'button',
          top: 200,
          left: 200
        },
        {
          componentKey: 'input',
          top: 300,
          left: 300
        },
      ],
    }
    return val
  })

  return (
    // <div>
    //     <div
    //     style={{
    //         height: '50px',
    //         width: '50px',
    //         backgroundColor: 'red',
    //         position: 'relative',
    //         top: `${pos.top}px`,
    //         left: `${pos.left}px`,
    //         display: 'inline-block'
    //     }}
    //     onMouseDown={moveDraggier.mouseDown}
    //     >
    //     </div>
    //     </div>
    <div>
      <ReactVisualEditor config={visualConfig} value={editorValue} onChange={setEditorValue}/>
    </div>

  )
}
