import { useRef, useState } from 'react'
import './app.scss'

export default () => {
    const [pos,setPos] = useState({
        left: 0,
        top:0
    })

    const moveDraggier = (()=>{

        const dragData = useRef({
            startTop: 0,          // 拖拽开始时block的top值
            startLeft: 0,         // 拖拽开始时block的left值
            startX: 0,            // 拖拽开始时鼠标的X值
            startY: 0             // 拖拽开始时鼠标的Y值
        })

        const mouseDown = ((e:React.MouseEvent<HTMLDivElement>)=>{
            document.addEventListener('mousemove',mouseMove),
            document.addEventListener('mouseup',mouseUp),
            dragData.current = {
                startTop: pos.top,
                startLeft: pos.left,
                startX: e.clientX,
                startY: e.clientY
            }
        })
        const mouseMove = ((e:MouseEvent)=>{
            const {startX,startY,startLeft,startTop} = dragData.current
            const durX = e.clientX
            const durY = e.clientY
            setPos({
                top: startTop + durY,
                left: startLeft + durX
            })
        })
        const mouseUp = (()=>{
            document.removeEventListener('mousemove',mouseMove)
            document.removeEventListener('mouseup',mouseUp)
        })
        return {mouseDown}
    })()

    return (
        <div>
            <div
            style={{
                height: '50px',
                width: '50px',
                backgroundColor: 'red',
                position: 'relative',
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                display: 'inline-block'
            }}
            onMouseDown={moveDraggier.mouseDown}
            >
            </div>
            </div>
        
    )
}