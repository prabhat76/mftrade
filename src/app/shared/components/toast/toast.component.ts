import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastMessage } from '../../../core/models';
import { selectToasts } from '../../../store/ui/ui.selectors';
import { dismissToast } from '../../../store/ui/ui.actions';

@Component({
  standalone: false,
  selector: 'app-toast',
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts$ | async"
           class="toast toast-{{ toast.type }}"
           (click)="dismiss(toast.id)">
        <span class="material-icons toast-icon">{{ iconMap[toast.type] }}</span>
        <span class="toast-msg">{{ toast.message }}</span>
        <button class="toast-close">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-icon { font-size: 1.1rem; flex-shrink: 0; }
    .toast-success .toast-icon { color: var(--success); }
    .toast-error   .toast-icon { color: var(--danger); }
    .toast-warning .toast-icon { color: var(--warning); }
    .toast-info    .toast-icon { color: var(--info); }
    .toast-msg { flex: 1; font-size: .875rem; }
    .toast-close { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: .875rem; }
  `]
})
export class ToastComponent implements OnInit {
  toasts$: Observable<ToastMessage[]>;
  iconMap: Record<string, string> = {
    success: 'check_circle', error: 'error', warning: 'warning', info: 'info',
  };

  constructor(private store: Store) {
    this.toasts$ = this.store.select(selectToasts);
  }

  ngOnInit() {
    this.toasts$.subscribe(toasts => {
      toasts.forEach(t => {
        if (t.duration) setTimeout(() => this.dismiss(t.id), t.duration);
      });
    });
  }

  dismiss(id: string) { this.store.dispatch(dismissToast({ id })); }
}
