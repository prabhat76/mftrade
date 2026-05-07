import { createAction, props } from '@ngrx/store';
import { ToastMessage } from '../../core/models';

export const showToast = createAction('[UI] Show Toast', props<{ toast: ToastMessage }>());
export const dismissToast = createAction('[UI] Dismiss Toast', props<{ id: string }>());
export const toggleSidebar = createAction('[UI] Toggle Sidebar');
export const setLoading = createAction('[UI] Set Loading', props<{ key: string; loading: boolean }>());
export const setMarketStatus = createAction('[UI] Set Market Status', props<{ isOpen: boolean }>());
