import { createAction, props } from '@ngrx/store';

export const loadWords = createAction('[Words] Load Words');
export const loadWordsSuccess = createAction(
  '[Words] Load Items Success',
  props<{ words: any[] }>()
);
export const loadWordsFailure = createAction(
  '[Words] Load Words Failure',
  props<{ error: any }>()
);
