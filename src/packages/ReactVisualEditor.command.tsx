import deepcopy from "deepcopy";
import { useCommander } from "./plugin/command.plugin";
import { ReactVisualEditorBlock, ReactVisualEditorValue } from "./ReactVisualEditor.utils";

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
        followQueue: false
    })
}