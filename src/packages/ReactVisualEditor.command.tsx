import deepcopy from "deepcopy";
import { useCommander } from "./plugin/command.plugin";
import { ReactVisualEditorBlock, ReactVisualEditorValue } from "./ReactVisualEditor.utils";
import {useState} from "react";
import {KeyboardCode} from "./plugin/keyboard-code";

export function useVisualCommand(
    { focusData, value, updateBlock }:
        {
            focusData: {
                focus: ReactVisualEditorBlock[],
                unFocus: ReactVisualEditorBlock[]
            },
            value: ReactVisualEditorValue,
            updateBlock: (blocks: ReactVisualEditorBlock[]) => void
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
    })

    return {
        delete: commander.state.commands.delete,
        redo: commander.state.commands.redo,
        undo: commander.state.commands.undo,
    }
}
