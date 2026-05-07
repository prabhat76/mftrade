import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-sip-calculator',
  template: `
    <div class="page-container">
      <a routerLink="/mutual-funds" class="btn btn-outline btn-sm" style="margin-bottom:16px">← Back</a>
      <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:20px">SIP Calculator</h2>

      <div class="flex gap-16" style="flex-wrap:wrap;align-items:flex-start">
        <div class="card" style="flex:1;min-width:280px">
          <form [formGroup]="form" (ngSubmit)="calculate()">
            <div class="form-group">
              <label>Monthly Investment (₹)</label>
              <input class="form-control" formControlName="monthly" type="number" placeholder="5000">
            </div>
            <div class="form-group">
              <label>Expected Annual Return (%)</label>
              <input class="form-control" formControlName="rate" type="number" placeholder="12" step="0.1">
            </div>
            <div class="form-group">
              <label>Investment Period (Years)</label>
              <input class="form-control" formControlName="years" type="number" placeholder="10">
            </div>
            <button class="btn btn-primary btn-block" type="submit" [disabled]="form.invalid">Calculate</button>
          </form>
        </div>

        <div class="card" style="flex:1;min-width:280px" *ngIf="result">
          <h3 style="margin-bottom:16px;font-weight:600">Projection</h3>
          <div class="info-grid">
            <div class="info-row"><span>Total Invested</span><span class="font-bold">₹{{ result.invested | number:'1.0-0' }}</span></div>
            <div class="info-row"><span>Estimated Returns</span><span class="font-bold positive">₹{{ result.returns | number:'1.0-0' }}</span></div>
            <div class="info-row"><span>Maturity Value</span><span class="font-bold" style="font-size:1.1rem;color:var(--primary)">₹{{ result.maturity | number:'1.0-0' }}</span></div>
            <div class="info-row"><span>Wealth Gained</span><span class="font-bold positive">{{ result.gainPercent | number:'1.1-1' }}%</span></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .info-grid { display: flex; flex-direction: column; }
    .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); font-size: .875rem; }
    .info-row:last-child { border-bottom: none; }
    .info-row span:first-child { color: var(--text-secondary); }
  `]
})
export class SipCalculatorComponent {
  form: FormGroup;
  result: { invested: number; returns: number; maturity: number; gainPercent: number } | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      monthly: [5000, [Validators.required, Validators.min(100)]],
      rate: [12, [Validators.required, Validators.min(1), Validators.max(50)]],
      years: [10, [Validators.required, Validators.min(1), Validators.max(40)]],
    });
  }

  calculate() {
    const { monthly, rate, years } = this.form.value;
    const n = years * 12;
    const r = rate / 100 / 12;
    const maturity = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = monthly * n;
    this.result = { invested, returns: maturity - invested, maturity, gainPercent: ((maturity - invested) / invested) * 100 };
  }
}
