import {Absolute} from "../../layout/absolute/Absolute";
import {Rect} from "../../../types/layout/Rect";
import {Position} from "../../../types/layout/Position";
import {useEventListener} from "../../../hooks/useEventListener";
import {useControlKeysState} from "../../../hooks/useControlKeysState";
import {Fragment, ReactNode, useMemo, useState} from "react";
import {CellState} from "../../../types/sudoku/CellState";
import {CellBackground} from "../cell/CellBackground";
import {CellSelection, CellSelectionColor} from "../cell/CellSelection";
import {CellDigits} from "../cell/CellDigits";
import {FieldSvg} from "./FieldSvg";
import {
    gameStateApplyArrowToSelectedCells,
    gameStateClearSelectedCells,
    gameStateGetCurrentFieldState,
    gameStateSelectAllCells,
    ProcessedGameState
} from "../../../types/sudoku/GameState";
import {MergeStateAction} from "../../../types/react/MergeStateAction";
import {PuzzleDefinition} from "../../../types/sudoku/PuzzleDefinition";
import {FieldLayer} from "../../../types/sudoku/FieldLayer";
import {FieldLayerContext} from "../../../contexts/FieldLayerContext";
import {FieldRect} from "./FieldRect";
import {AutoSvg} from "../../svg/auto-svg/AutoSvg";
import {
    asConstraint,
    getAllPuzzleConstraintsAndComponents,
    isConstraint,
    isValidUserDigit,
    prepareGivenDigitsMapForConstraints
} from "../../../types/sudoku/Constraint";
import {FieldCellMouseHandler} from "./FieldCellMouseHandler";

export interface FieldProps<CellType, GameStateExtensionType = {}, ProcessedGameStateExtensionType = {}> {
    puzzle: PuzzleDefinition<CellType, GameStateExtensionType, ProcessedGameStateExtensionType>;
    state: ProcessedGameState<CellType> & ProcessedGameStateExtensionType;
    onStateChange: (state: MergeStateAction<ProcessedGameState<CellType> & ProcessedGameStateExtensionType>) => void;
    rect: Rect;
    cellSize: number;
}

export const Field = <CellType, GameStateExtensionType = {}, ProcessedGameStateExtensionType = {}>(
    {
        puzzle,
        state,
        onStateChange,
        rect,
        cellSize
    }: FieldProps<CellType, GameStateExtensionType, ProcessedGameStateExtensionType>
) => {
    const {
        typeManager,
        fieldSize,
        fieldMargin = 0,
        initialDigits = {},
    } = puzzle;

    const {
        isValidCell = () => true,
        getRegionsWithSameCoordsTransformation,
        getCellSelectionType,
    } = typeManager;

    const items = useMemo(() => getAllPuzzleConstraintsAndComponents(puzzle, state, cellSize), [puzzle, state, cellSize]);

    const ItemsInOneRegion = () => <>
        {items.map((item, index) => {
            if (isConstraint(item)) {
                const {component: Component, ...otherData} = asConstraint(item);

                return Component && <Component
                    key={index}
                    gameState={state}
                    cellSize={cellSize}
                    {...otherData}
                />;
            } else {
                return <Fragment key={index}>{item as ReactNode}</Fragment>;
            }
        })}
    </>;

    const fullMargin = fieldMargin + fieldSize.fieldSize;
    const regionsWithSameCoordsTransformation = getRegionsWithSameCoordsTransformation?.(puzzle) || [{
        left: -fullMargin,
        top: -fullMargin,
        width: fieldSize.columnsCount + fullMargin * 2,
        height: fieldSize.rowsCount + fullMargin * 2,
    }];

    const Items = () => <>
        {regionsWithSameCoordsTransformation.map((rect, index) => <FieldRect
            key={`items-region-${index}`}
            puzzle={puzzle}
            clip={true}
            {...rect}
        >
            <AutoSvg
                left={-rect.left}
                top={-rect.top}
                width={1}
                height={1}
            >
                <ItemsInOneRegion/>
            </AutoSvg>
        </FieldRect>)}
    </>;

    const {selectedCells, isReady, enableConflictChecker} = state;
    const {cells} = gameStateGetCurrentFieldState(state);

    if (!isReady) {
        onStateChange = () => {};
    }

    const userDigits = useMemo(() => prepareGivenDigitsMapForConstraints(puzzle, cells), [puzzle, cells]);

    const {isAnyKeyDown} = useControlKeysState();

    const [isDeleteSelectedCellsStroke, setIsDeleteSelectedCellsStroke] = useState(false);

    // Handle outside click
    useEventListener(window, "mousedown", () => {
        if (!isAnyKeyDown) {
            onStateChange(gameStateClearSelectedCells);
        }

        setIsDeleteSelectedCellsStroke(false);
    });

    // Handle arrows
    useEventListener(window, "keydown", (ev: KeyboardEvent) => {
        const {code, ctrlKey, shiftKey} = ev;

        // Use the key modifiers from the event - they are always up-to-date
        const isAnyKeyDown = ctrlKey || shiftKey;

        const handleArrow = (xDirection: number, yDirection: number, isMainKeyboard = true) => (isMainKeyboard || !ctrlKey) && onStateChange(
            gameState => gameStateApplyArrowToSelectedCells(puzzle, gameState, xDirection, yDirection, isAnyKeyDown, isMainKeyboard)
        );

        switch (code) {
            case "ArrowLeft":
                handleArrow(-1, 0);
                break;
            case "ArrowRight":
                handleArrow(1, 0);
                break;
            case "ArrowUp":
                handleArrow(0, -1);
                break;
            case "ArrowDown":
                handleArrow(0, 1);
                break;
            case "KeyA":
                if (ctrlKey && !shiftKey) {
                    onStateChange(gameState => gameStateSelectAllCells(puzzle, gameState));
                    ev.preventDefault();
                }
                handleArrow(-1, 0, false);
                break;
            case "KeyD":
                handleArrow(1, 0, false);
                break;
            case "KeyW":
                handleArrow(0, -1, false);
                break;
            case "KeyS":
                handleArrow(0, 1, false);
                break;
            case "Escape":
                if (!isAnyKeyDown) {
                    onStateChange(gameStateClearSelectedCells);
                    ev.preventDefault();
                }
                break;
        }
    });

    const renderCellsLayer = (keyPrefix: string, renderer: (cellState: CellState<CellType>, cellPosition: Position) => ReactNode, useShadow = false) =>
        <FieldSvg
            fieldSize={fieldSize}
            fieldMargin={fieldMargin}
            cellSize={cellSize}
            useShadow={useShadow}
        >
            {cells.flatMap((row, rowIndex) => row.map((cellState, columnIndex) => {
                const cellPosition: Position = {
                    left: columnIndex,
                    top: rowIndex,
                };

                if (!isValidCell(cellPosition, puzzle)) {
                    return null;
                }

                return <FieldRect
                    key={`cell-${keyPrefix}-${rowIndex}-${columnIndex}`}
                    puzzle={puzzle}
                    {...cellPosition}
                >
                    {renderer(cellState, cellPosition)}
                </FieldRect>;
            }))}
        </FieldSvg>;

    return <Absolute
        {...rect}
        angle={typeManager.getFieldAngle?.(state)}
        style={{backgroundColor: "white"}}
    >
        <FieldSvg
            fieldSize={fieldSize}
            fieldMargin={fieldMargin}
            cellSize={cellSize}
        >
            <FieldLayerContext.Provider value={FieldLayer.beforeBackground}>
                <Items/>
            </FieldLayerContext.Provider>
        </FieldSvg>

        {renderCellsLayer("background", ({colors}) => <CellBackground
            colors={colors}
        />)}

        <FieldSvg
            fieldSize={fieldSize}
            fieldMargin={fieldMargin}
            cellSize={cellSize}
        >
            <FieldLayerContext.Provider value={FieldLayer.beforeSelection}>
                <Items/>
            </FieldLayerContext.Provider>
        </FieldSvg>

        {renderCellsLayer("selection", (cellState, cellPosition) => {
            let color = "";
            let width = 1;

            if (selectedCells.contains(cellPosition)) {
                color = selectedCells.last()?.left === cellPosition.left && selectedCells.last()?.top === cellPosition.top
                    ? CellSelectionColor.mainCurrent
                    : CellSelectionColor.mainPrevious;
            } else if (getCellSelectionType) {
                const customSelection = getCellSelectionType(cellPosition, puzzle, state);
                if (customSelection) {
                    color = customSelection.color;
                    width = customSelection.strokeWidth;
                }
            }

            return !!color && <CellSelection
                size={cellSize}
                color={color}
                strokeWidth={width}
            />;
        })}

        <FieldSvg
            fieldSize={fieldSize}
            fieldMargin={fieldMargin}
            cellSize={cellSize}
        >
            <FieldLayerContext.Provider value={FieldLayer.regular}>
                <Items/>
            </FieldLayerContext.Provider>
        </FieldSvg>

        <FieldSvg
            fieldSize={fieldSize}
            fieldMargin={fieldMargin}
            cellSize={cellSize}
            useShadow={false}
        >
            <FieldLayerContext.Provider value={FieldLayer.lines}>
                <Items/>
            </FieldLayerContext.Provider>
        </FieldSvg>

        <FieldSvg
            fieldSize={fieldSize}
            fieldMargin={fieldMargin}
            cellSize={cellSize}
        >
            <FieldLayerContext.Provider value={FieldLayer.top}>
                <Items/>
            </FieldLayerContext.Provider>
        </FieldSvg>

        {renderCellsLayer("digits", (cellState, cell) => <CellDigits
            puzzle={puzzle}
            data={cellState}
            initialData={initialDigits?.[cell.top]?.[cell.left]}
            size={1}
            cellPosition={cell}
            state={state}
            isValidUserDigit={!enableConflictChecker || isValidUserDigit(cell, userDigits, items, puzzle, state)}
        />, true)}

        {isReady && renderCellsLayer("mouse-handler", (cellState, cellPosition) => <FieldCellMouseHandler
            puzzle={puzzle}
            state={state}
            onStateChange={onStateChange}
            cellPosition={cellPosition}
            cellState={cellState}
            isDeleteSelectedCellsStroke={isDeleteSelectedCellsStroke}
            onIsDeleteSelectedCellsStrokeChange={setIsDeleteSelectedCellsStroke}
        />)}
    </Absolute>;
};
