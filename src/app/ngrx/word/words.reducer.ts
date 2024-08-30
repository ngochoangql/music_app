import { createReducer, on } from "@ngrx/store";
import * as WordsAction from './words.action';
export interface WordState {
  words: any[];
  error: any;
}

export const initialState: WordState = {
  words : [],
  error : null
};


export const wordsReducer = createReducer(
  initialState,
  on(WordsAction.loadWordsSuccess, (state, { words }) => ({ ...state, words })),
  on(WordsAction.loadWordsFailure, (state, { error }) => ({ ...state, error }))
);
