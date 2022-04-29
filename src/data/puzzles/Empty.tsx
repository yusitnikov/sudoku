import {PuzzleDefinition} from "../../types/sudoku/PuzzleDefinition";
import {RotatableDigit} from "../../sudokuTypes/rotatable/types/RotatableDigit";
import {RotatableDigitSudokuTypeManager} from "../../sudokuTypes/rotatable/types/RotatableDigitSudokuTypeManager";
import {RotatableGameState, RotatableProcessedGameState} from "../../sudokuTypes/rotatable/types/RotatableGameState";
import {FieldSize8, FieldSize9} from "../../types/sudoku/FieldSize";
import {LanguageCode} from "../../types/translations/LanguageCode";
import {PartiallyTranslatable} from "../../types/translations/Translatable";
import {DigitSudokuTypeManager} from "../../sudokuTypes/default/types/DigitSudokuTypeManager";
import {ChessSudokuTypeManager} from "../../sudokuTypes/chess/types/ChessSudokuTypeManager";
import {ChessPiece} from "../../sudokuTypes/chess/types/ChessPiece";
import {ChessGameState} from "../../sudokuTypes/chess/types/ChessGameState";

const title: PartiallyTranslatable = {
    [LanguageCode.en]: "Empty",
    [LanguageCode.ru]: "Пустой",
};

export const EmptyRegular: PuzzleDefinition<number> = {
    noIndex: true,
    title,
    slug: "empty-regular",
    typeManager: DigitSudokuTypeManager(),
    fieldSize: FieldSize9,
};

export const EmptyRotatable: PuzzleDefinition<RotatableDigit, RotatableGameState, RotatableProcessedGameState> = {
    noIndex: true,
    title,
    slug: "empty-rotatable",
    typeManager: RotatableDigitSudokuTypeManager,
    fieldSize: FieldSize9,
};

export const EmptyChess: PuzzleDefinition<ChessPiece, ChessGameState, ChessGameState> = {
    noIndex: true,
    title,
    slug: "empty-chess",
    typeManager: ChessSudokuTypeManager,
    fieldSize: FieldSize8,
};
