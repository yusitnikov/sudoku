import {FieldStateInitialDigitsMap} from "./FieldState";
import {ReactNode} from "react";
import {SudokuTypeManager} from "./SudokuTypeManager";
import {FieldSize} from "./FieldSize";

export interface PuzzleDefinition<CellType, GameStateExtensionType = {}, ProcessedGameStateExtensionType = {}> {
    title: ReactNode;
    slug: string;
    author?: ReactNode;
    rules: ReactNode;
    typeManager: SudokuTypeManager<CellType, GameStateExtensionType, ProcessedGameStateExtensionType>;
    fieldSize: FieldSize;
    digitsCount?: number;
    initialDigits?: FieldStateInitialDigitsMap<CellType>;
    backgroundItems?: ReactNode;
    topItems?: ReactNode;
}
