import {PuzzleDefinitionLoader} from "../../types/sudoku/PuzzleDefinition";
import {createRegularFieldSize} from "../../types/sudoku/FieldSize";
import {LanguageCode} from "../../types/translations/LanguageCode";
import {generateRandomPuzzleDigits, getDailyRandomGeneratorSeed} from "../../utils/random";
import {QuadMastersSudokuTypeManager} from "../../sudokuTypes/quad-masters/types/QuadMastersSudokuTypeManager";
import {QuadMastersGameState} from "../../sudokuTypes/quad-masters/types/QuadMastersGameState";
import {isValidFinishedPuzzleByConstraints} from "../../types/sudoku/Constraint";
import {getAutoRegionWidth} from "../../utils/regions";
import {RulesParagraph} from "../../components/sudoku/rules/RulesParagraph";
import {normalSudokuRulesApply} from "../ruleSnippets";
import {
    correctGuessRules,
    incorrectGuessMultiPlayerRules,
    incorrectGuessSinglePlayerRules,
    multiPlayerScoreRules,
    multiPlayerTurnsRules,
    phase,
    placeDigitRules,
    placeQuadRules,
    quadBlackDigits,
    quadRedDigits,
    singlePlayerScoreRules,
    twoPhasesGame
} from "../../sudokuTypes/quad-masters/data/ruleSnippets";
import {RulesUnorderedList} from "../../components/sudoku/rules/RulesUnorderedList";

export const generateQuadMasters = (slug: string, daily: boolean): PuzzleDefinitionLoader<number, QuadMastersGameState, QuadMastersGameState> => ({
    slug,
    fulfillParams: (
        {
            size = 9,
            regionWidth = getAutoRegionWidth(size),
            seed,
            ...other
        }
    ) => ({
        size,
        regionWidth,
        seed: daily ? "daily" : (seed ?? Math.round(Math.random() * 1000000)),
        isRandom: !seed && !daily,
        ...other
    }),
    loadPuzzle: ({size: sizeStr, regionWidth: regionWidthStr, seed: seedStr, isRandom, host}) => {
        const fieldSize = Number(sizeStr);
        const regionWidth = Number(regionWidthStr);
        const randomSeed = daily ? getDailyRandomGeneratorSeed() : Number(seedStr);

        return {
            noIndex: true,
            title: {
                [LanguageCode.en]: `Quad Masters`,
            },
            slug,
            saveState: !isRandom,
            saveStateKey: `${slug}-${fieldSize}-${regionWidth}-${randomSeed}`,
            typeManager: QuadMastersSudokuTypeManager(generateRandomPuzzleDigits(fieldSize, regionWidth, randomSeed)),
            fieldSize: createRegularFieldSize(fieldSize, regionWidth),
            resultChecker: isValidFinishedPuzzleByConstraints,
            forceAutoCheckOnFinish: true,
            fieldMargin: Math.max(0, (7 - fieldSize) / 2),
            rules: translate => <>
                <RulesParagraph>{translate(normalSudokuRulesApply)}.</RulesParagraph>
                <RulesParagraph>{translate(host ? multiPlayerTurnsRules : twoPhasesGame)}.</RulesParagraph>
                <RulesParagraph>{translate(phase)} 1:</RulesParagraph>
                <RulesUnorderedList>
                    <li>{translate(placeQuadRules)}.</li>
                    <li>{translate(quadRedDigits)}.</li>
                    <li>{translate(quadBlackDigits)}.</li>
                </RulesUnorderedList>
                <RulesParagraph>{translate(phase)} 2:</RulesParagraph>
                <RulesUnorderedList>
                    <li>{translate(placeDigitRules)}.</li>
                    <li>{translate(correctGuessRules)}.</li>
                    <li>{translate(host ? incorrectGuessMultiPlayerRules : incorrectGuessSinglePlayerRules)}.</li>
                </RulesUnorderedList>
                <RulesParagraph>{translate(host ? multiPlayerScoreRules : singlePlayerScoreRules)}.</RulesParagraph>
            </>,
        };
    },
});
