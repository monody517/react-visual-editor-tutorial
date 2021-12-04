import { useCallback, useRef, useState } from "react";

export interface CommandExecute {
    undo?: () => void, // 调用当前命令队列将要执行的函数
    redo?: () => void // 重复调用当前的命令
}

interface Command {
    name: string,  // 命令的唯一表示
    keyboard: string | string[],  // 命令快捷键
    execute: (...args: any[]) => CommandExecute, // 命令执行后需要返回undo和redo执行的动作
    followQueue: boolean    // 命令执行完是否需要将命令执行得到的redo，undo存入命令队列
}

export function useCommander() {

    const [state] = useState(() => ({
        current: -1,        // 当前命令队列中，最后执行的命令返回的CommandExecute对象
        queue: [] as CommandExecute[],    // 命令队列
        commandArray: [] as { current: Command }[],   // 预定义命令的数组
        commands: {} as Record<string, (...args: any[]) => void>,  // 通过command name执行 command动作的一个包装
        destroyList: [] as ((() => void) | undefined)[]     // 所有命令在组件销毁之前，需要执行的消除副作用的函数数组
    }))


    // 注册一个命令
    const useRegistry = useCallback((command: Command) => {
        const commandRef = useRef(command)
        commandRef.current = command

        useState(() => {
            if (state.commands[command.name]) {
                const existIndex = state.commandArray.findIndex(item => item.current.name === command.name)
                state.commandArray.splice(existIndex, 1)
            }
            state.commandArray.push(commandRef)
            state.commands[command.name] = (...args: any[]) => {
                const { redo, undo } = commandRef.current.execute(...args)
            }
        })
    }, [])

    return {
        useRegistry
    }
}