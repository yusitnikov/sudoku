import {PuzzleDefinition} from "../../types/sudoku/PuzzleDefinition";
import {FieldSize9} from "../../types/sudoku/FieldSize";
import {LanguageCode} from "../../types/translations/LanguageCode";
import {DigitSudokuTypeManager} from "../../sudokuTypes/default/types/DigitSudokuTypeManager";
import {CellColor} from "../../types/sudoku/CellColor";
import {ThermometerConstraint} from "../../components/sudoku/constraints/thermometer/Thermometer";
import {KropkiDotConstraint} from "../../components/sudoku/constraints/kropki-dot/KropkiDot";
import {RulesParagraph} from "../../components/sudoku/rules/RulesParagraph";
import {
    blackKropkiDotsExplained,
    chaosConstructionRulesApply,
    normalSudokuRulesApply,
    notAllDotsGiven,
    thermometersExplained
} from "../ruleSnippets";

export const Miraculous: PuzzleDefinition<number> = {
    slug: "miraculous",
    title: {
        [LanguageCode.en]: "Miraculous",
    },
    author: {
        [LanguageCode.en]: "Smank, Raumplaner and Uklusi",
        [LanguageCode.ru]: "Smank, Raumplaner и Uklusi",
    },
    rules: translate => <>
        <RulesParagraph>{translate(normalSudokuRulesApply)}.</RulesParagraph>
        <RulesParagraph>{translate(chaosConstructionRulesApply)}.</RulesParagraph>
        <RulesParagraph>{translate({
            [LanguageCode.en]: "Cells highlighted the same color share a region",
            [LanguageCode.ru]: "Ячейки, выделенные одним цветом, принадлежат одной общей области",
        })}.</RulesParagraph>
        <RulesParagraph>{translate({
            [LanguageCode.en]: "All digits must be consecutive to their adjacent neighbours. For the purpose of this rule 1 and 9 are consecutive",
            [LanguageCode.ru]: "Соседние ячейки содержат последовательные цифры (различающиеся на 1). Для этого правила, 1 и 9 считаются последовательными",
        })}.</RulesParagraph>
        <RulesParagraph>{translate({
            [LanguageCode.en]: "The grid is toroidal: the top connects to the bottom, the left connects to the right. Use the \"move\" button or the arrow keys to move the grid",
            [LanguageCode.ru]: "Поле имеет форму тора: верх соединяется с низом, левая часть соединяется с правой. Используйте кнопку «двигать» или стрелки, чтобы двигать поле",
        })}.</RulesParagraph>
        <RulesParagraph>{translate(blackKropkiDotsExplained)}. {translate(notAllDotsGiven)}.</RulesParagraph>
        <RulesParagraph>{translate(thermometersExplained)}.</RulesParagraph>
    </>,
    typeManager: DigitSudokuTypeManager(),
    fieldSize: {...FieldSize9, regions: []},
    initialColors: {
        1: {
            8: [CellColor.darkGrey],
        },
        3: {
            3: [CellColor.blue],
            4: [CellColor.green],
            8: [CellColor.lightGrey],
        },
        4: {
            4: [CellColor.darkGrey],
            5: [CellColor.orange],
        },
        5: {
            5: [CellColor.lightGrey],
            6: [CellColor.purple],
            8: [CellColor.yellow],
        },
        6: {
            6: [CellColor.yellow],
            7: [CellColor.red],
        },
        8: {
            0: [CellColor.green],
            2: [CellColor.orange],
            4: [CellColor.purple],
            6: [CellColor.red],
            8: [CellColor.blue],
        },
    },
    items: [
        ThermometerConstraint("R5C2", "R4C1"),
        KropkiDotConstraint("R1C7", "R1C8", true),
    ],
    allowDrawingBorders: true,
    loopHorizontally: true,
    loopVertically: true,
    fieldMargin: 0.99,
};
