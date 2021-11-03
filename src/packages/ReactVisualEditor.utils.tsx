/**
 * 容器内每个元素的数据类型
 */
export interface ReactVisualEditorBlock{
    componentKey: string,   // component对象中的key，通过这个来找到visual config中的component
    top: number,    // component对象的top值
    left: number,   // component对象的left值
}

/**
 * 编辑器编辑的数据类型
 */
export interface ReactVisualEditorValue {
    container: {
        height: number,     // 容器高度
        width: number,      // 容器宽度
    },
    blocks: ReactVisualEditorBlock[],   //  容器数组
}

/**
 * 编辑器中预定义组件的类型
 */
export interface ReactVisualEditorComponent {
    key: string,  // 组件唯一标识
    name: string, // 组件预览显示名称
    preview: () => JSX.Element, // 组件预览时的内容
    render: () => JSX.Element, // 组件拖拽出来的内容
}

/**
 * 创建一个编辑器预设配置信息对象
 */
export function createVisualConfig() {
    /**用于block数据，通过componentKey找到这个component对象，使用component对象的render属性渲染内容到container容器中 */
    const componentMap: { [k: string]: ReactVisualEditorComponent } = {}
    /**用于在menu中渲染预定义的组件列表 */
    const componentArray: ReactVisualEditorComponent[] = []

    /**
     * 注册一个组件
     */
    function registryComponent(key: string, option: Omit<ReactVisualEditorComponent, 'key'>) {
        if (componentMap[key]) {
            const index = componentArray.indexOf(componentMap[key])
            componentArray.splice(index, 1)
        }
        const newComponent = {
            key,
            ...option
        }
        componentArray.push(newComponent)
        componentMap[key] = newComponent
    }

    return {
        componentArray,
        componentMap,
        registryComponent
    }
}

export type ReactVisualEditorConfig  = ReturnType<typeof createVisualConfig>
