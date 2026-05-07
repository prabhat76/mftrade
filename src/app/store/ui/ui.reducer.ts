import { createReducer, on } from '@ngrx/store';
import { ToastMessage } from '../../core/models';
import * as UiActions from './ui.actions';

export interface UiState {
  toasts: ToastMessage[];
  sidebarOpen: boolean;
  loadingMap: Record<string, boolean>;
  marketOpen: boolean;
}

const initialState: UiState = {
  toasts: [], sidebarOpen: true, loadingMap: {}, marketOpen: false,
};

export const uiReducer = createReducer(
  initialState,
  on(UiActions.showToast, (state, { toast }) => ({ ...state, toasts: [...state.toasts, toast] })),
  on(UiActions.dismissToast, (state, { id }) => ({ ...state, toasts: state.toasts.filter(t => t.id !== id) })),
  on(UiActions.toggleSidebar, state => ({ ...state, sidebarOpen: !state.sidebarOpen })),
  on(UiActions.setLoading, (state, { key, loading }) => ({
    ...state, loadingMap: { ...state.loadingMap, [key]: loading },
  })),
  on(UiActions.setMarketStatus, (state, { isOpen }) => ({ ...state, marketOpen: isOpen })),
);
