import {Position} from "../../../../types/layout/Position";
import {blackColor} from "../../../app/globals";
import {useIsFieldLayer} from "../../../../contexts/FieldLayerContext";
import {FieldLayer} from "../../../../types/sudoku/FieldLayer";

const radius = 0.2;
const lineWidth = 0.02;

export interface XMarkProps extends Position {
    isFilled?: boolean;
}

export const XMark = ({left, top}: XMarkProps) => {
    const isLayer = useIsFieldLayer(FieldLayer.top);

    left -= 0.5;
    top -= 0.5;

    return isLayer && <>
        <line
            x1={left - radius * 0.7}
            y1={top - radius * 0.7}
            x2={left + radius * 0.7}
            y2={top + radius * 0.7}
            strokeWidth={lineWidth}
            stroke={blackColor}
        />

        <line
            x1={left + radius * 0.7}
            y1={top - radius * 0.7}
            x2={left - radius * 0.7}
            y2={top + radius * 0.7}
            strokeWidth={lineWidth}
            stroke={blackColor}
        />
    </>;
};
