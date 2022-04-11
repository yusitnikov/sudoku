import {Translatable} from "../../../types/translations/Translatable";
import {LanguageCode} from "../../../types/translations/LanguageCode";
import React, {ReactNode} from "react";

export const chessSudokuRules: Translatable<ReactNode> = {
    [LanguageCode.en]: <>
        <strong>Standard chess rules apply</strong>:
        put chess pieces to the board so that they will form a valid chess position
        (that is result of some chess game)
    </>,
    [LanguageCode.ru]: <>
        <strong>Стандартные правила шахмат</strong>:
        поставьте шахматные фигуры на доску так, чтоб они образовали позицию,
        которая может получиться в результате игры в шахматы
    </>,
};

export const normalSudokuRulesForChessPieces: Translatable = {
    [LanguageCode.en]: "chess pieces cannot repeat in rows, columns and boxes",
    [LanguageCode.ru]: "шахматные фигуры не могут повторяться на каждой линии и в каждом регионе, огражденном жирными линиями",
};

export const emptyCells: Translatable = {
    [LanguageCode.en]: "However, unlike in sudoku, you are not required to fill every cell (there will be blank spaces) as doing so will break chess rules. You are also not required to put all possible chess pieces to the board",
    [LanguageCode.ru]: "Однако, в отличие от обычного судоку, не обязательно заполнять каждую клетку, т.к. это противоречило бы правилам шахмат. Также, не обязательно ставить на доску все возможные фигуры",
};

export const noPastPromotions: Translatable = {
    [LanguageCode.en]: "There were no pawn promotions in the game that led to the current position on the board",
    [LanguageCode.ru]: "В игре, результат которой мы видим на доске, не было превращений пешек",
};

export const mateInOne: Translatable = {
    [LanguageCode.en]: "Both white and black have a mate in 1 move in case it's their turn",
    [LanguageCode.ru]: "И белые, и черные могут поставить мат в 1 ход, если это их ход",
};
