import {CellWriteMode} from "../../../types/sudoku/CellWriteMode";
import {CellWriteModeButton} from "../../../components/sudoku/controls/CellWriteModeButton";
import {ControlsProps} from "../../../components/sudoku/controls/Controls";
import {QuadMastersGameState} from "../types/QuadMastersGameState";
import {useTranslate} from "../../../contexts/LanguageCodeContext";
import {quads} from "../data/translations";
import {AutoSvg} from "../../../components/svg/auto-svg/AutoSvg";
import {QuadByData} from "../../../components/sudoku/constraints/quad/Quad";
import {textColor} from "../../../components/app/globals";
import {useEventListener} from "../../../hooks/useEventListener";

export const QuadMastersControls = (
    {context, isHorizontal}: ControlsProps<number, QuadMastersGameState, QuadMastersGameState>
) => {
    const translate = useTranslate();

    useEventListener(window, "keydown", (ev: KeyboardEvent) => {
        if (context.state.isShowingSettings) {
            return;
        }

        if (ev.ctrlKey || ev.shiftKey || ev.altKey) {
            return;
        }

        switch (ev.code) {
            case "KeyC":
            case "Tab":
                context.onStateChange(({persistentCellWriteMode}) => ({
                    persistentCellWriteMode: persistentCellWriteMode === CellWriteMode.custom ? CellWriteMode.main : CellWriteMode.custom
                }));
                ev.preventDefault();
                break;
            case "Home":
                context.onStateChange({persistentCellWriteMode: CellWriteMode.main});
                ev.preventDefault();
                break;
            case "End":
                context.onStateChange({persistentCellWriteMode: CellWriteMode.custom});
                ev.preventDefault();
                break;
        }
    });

    return <CellWriteModeButton
        top={isHorizontal ? 3 : 4}
        left={isHorizontal ? 4 : 3}
        cellWriteMode={CellWriteMode.custom}
        data={cellSize => <AutoSvg
            width={cellSize}
            height={cellSize}
            viewBox={"0 0 1 1"}
        >
            <line
                x1={0}
                y1={0.5}
                x2={1}
                y2={0.5}
                stroke={textColor}
                strokeWidth={1 / cellSize}
            />

            <line
                x1={0.5}
                y1={0}
                x2={0.5}
                y2={1}
                stroke={textColor}
                strokeWidth={1 / cellSize}
            />

            <QuadByData
                context={context}
                cells={[{top: 0.5, left: 0.5}]}
                expectedDigits={[1, 2, 3, 4]}
            />
        </AutoSvg>}
        fullSize={true}
        title={`${translate(quads)} (${translate("shortcut")}: C / End)`}
        context={context}
    />;
};
