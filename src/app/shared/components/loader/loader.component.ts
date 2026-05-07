import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-loader',
  template: `
    <div class="loader-wrap" [class.overlay]="overlay">
      <div class="spinner"></div>
      <p *ngIf="message" class="loader-msg">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loader-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; gap: 12px; }
    .loader-wrap.overlay { position: fixed; inset: 0; background: rgba(255,255,255,.8); z-index: 9998; }
    .loader-msg { font-size: .875rem; color: var(--text-secondary); }
  `]
})
export class LoaderComponent {
  @Input() overlay = false;
  @Input() message = '';
}
