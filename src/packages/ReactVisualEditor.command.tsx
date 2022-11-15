import deepcopy from "deepcopy";
import { useCommander } from "./plugin/command.plugin";
import { ReactVisualEditorBlock, ReactVisualEditorValue } from "./ReactVisualEditor.utils";
import {useRef, useState} from "react";
import {KeyboardCode} from "./plugin/keyboard-code";
import {useCallbackRef} from "./hook/useCallbackRefs";

export function useVisualCommand(
    { focusData, value, updateBlock }:
        {
            focusData: {
                focus: ReactVisualEditorBlock[],
                unFocus: ReactVisualEditorBlock[]
            },
            value: ReactVisualEditorValue,
            updateBlock: (blocks: ReactVisualEditorBlock[] | null) => void
        }
) {
    const commander = useCommander()

    /* 删除命令 */
    commander.useRegistry({
        name: 'delete',
        keyboard: [
            'delete',
            'ctrl+d',
            'backspace',
        ],
        execute() {

            const before = deepcopy(value.blocks)
            const after = deepcopy(focusData.unFocus)

            return {
                redo: () => {
                    updateBlock(deepcopy(after))
                },
                undo: () => {
                    updateBlock(deepcopy(before))
                }
            }
        },
        followQueue: true
    });

      /* 拖拽命令 */
      (()=> {
          const dragData = useRef({before: null as null | ReactVisualEditorBlock[]})
          const hander = {
              dragstart: useCallbackRef(()=>dragData.current.before = deepcopy(value.blocks)),
              dragend:useCallbackRef(()=>commander.state.commands.drag())
          }
          commander.useRegistry({
              name: 'drag',
              followQueue: true,
              execute: () => {
                  let before = deepcopy(dragData.current.before)
                  let after = deepcopy(value.blocks)
                  return {
                    redo: () => {
                        updateBlock(deepcopy(after))
                    },
                      undo: ()=> {
                          updateBlock(deepcopy(before))
                      }
                  }
              }
          })
      })()

    return {
        delete: commander.state.commands.delete,
        redo: commander.state.commands.redo,
        undo: commander.state.commands.undo,
        drag: commander.state.commands.drag,
    }
}
