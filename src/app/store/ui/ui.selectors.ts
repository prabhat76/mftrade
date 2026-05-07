import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UiState } from './ui.reducer';

const selectUiState = createFeatureSelector<UiState>('ui');
export const selectToasts = createSelector(selectUiState, s => s.toasts);
export const selectSidebarOpen = createSelector(selectUiState, s => s.sidebarOpen);
export const selectMarketOpen = createSelector(selectUiState, s => s.marketOpen);
export const selectIsLoading = (key: string) => createSelector(selectUiState, s => !!s.loadingMap[key]);
