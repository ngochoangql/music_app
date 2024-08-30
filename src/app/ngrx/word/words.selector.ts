import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WordState } from "./words.reducer";

export const selectWordState = createFeatureSelector<WordState>("words");
export const selectAllWords = createSelector(
  selectWordState,
  (state: WordState) => state.words
);
export const selectWordsError = createSelector(
  selectWordState,
  (state: WordState) => state.error
);
