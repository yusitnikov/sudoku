import {areCellStatesEqual, CellState, cloneCellState, createEmptyCellState} from "./CellState";
import {indexes} from "../../utils/indexes";
import {
    getLineVector,
    invertLine,
    invertPosition,
    isSamePosition,
    Line,
    Position
} from "../layout/Position";
import {SudokuTypeManager} from "./SudokuTypeManager";
import {PuzzleDefinition} from "./PuzzleDefinition";
import {Set} from "../struct/Set";

export interface FieldState<CellType> {
    cells: CellState<CellType>[][];
    lines: Set<Line>;
}

export const createEmptyFieldState = <CellType>(
    {typeManager, fieldSize: {rowsCount, columnsCount}, loopHorizontally, loopVertically}: PuzzleDefinition<CellType, any, any>
): FieldState<CellType> => ({
    cells: indexes(rowsCount).map(() => indexes(columnsCount).map(() => createEmptyCellState(typeManager))),
    lines: new Set<Line>(
        [],
        (line1, line2) => {
            const vector1 = getLineVector(line1);
            const vector2 = getLineVector(line2);

            if (!isSamePosition(vector1, vector2)) {
                if (!isSamePosition(vector1, invertPosition(vector2))) {
                    return false;
                }

                line2 = invertLine(line2);
            }

            let {left, top} = getLineVector({start: line1.start, end: line2.start});

            if (loopVertically) {
                top %= rowsCount;
            }

            if (loopHorizontally) {
                left %= columnsCount;
            }

            return !left && !top;
        }
    ),
});

export const cloneFieldState = <CellType>(
    typeManager: SudokuTypeManager<CellType>,
    {cells, lines}: FieldState<CellType>
): FieldState<CellType> => ({
    cells: cells.map(row => row.map(cellState => cloneCellState(typeManager, cellState))),
    lines: lines.clone(),
});

export const processFieldStateCells = <CellType>(
    fieldState: FieldState<CellType>,
    affectedCells: Position[],
    processor: (cellState: CellState<CellType>) => CellState<CellType>
) => {
    for (const {left: columnIndex, top: rowIndex} of affectedCells) {
        fieldState.cells[rowIndex][columnIndex] = processor(fieldState.cells[rowIndex][columnIndex]);
    }

    return fieldState;
};

export const processFieldStateLines = <CellType>(
    fieldState: FieldState<CellType>,
    processor: (lines: Set<Line>) => Set<Line>
) => {
    return {
        ...fieldState,
        lines: processor(fieldState.lines),
    };
};

export const areAllFieldStateCells = <CellType>(
    fieldState: FieldState<CellType>,
    affectedCells: Position[],
    predicate: (cellState: CellState<CellType>) => boolean
) =>
    affectedCells.every(({left: columnIndex, top: rowIndex}) => predicate(fieldState.cells[rowIndex][columnIndex]));

export const isAnyFieldStateCell = <CellType>(
    fieldState: FieldState<CellType>,
    affectedCells: Position[],
    predicate: (cellState: CellState<CellType>) => boolean
) =>
    affectedCells.some(({left: columnIndex, top: rowIndex}) => predicate(fieldState.cells[rowIndex][columnIndex]));

export const areFieldStatesEqual = <CellType>(
    typeManager: SudokuTypeManager<CellType>,
    {cells, lines}: FieldState<CellType>,
    {cells: cells2, lines: lines2}: FieldState<CellType>
) =>
    cells.every(
        (row, rowIndex) => row.every(
            (cell, columnIndex) => areCellStatesEqual(typeManager, cell, cells2[rowIndex][columnIndex])
        )
    ) &&
    lines.equals(lines2);
