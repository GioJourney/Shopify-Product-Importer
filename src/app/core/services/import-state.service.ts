import { computed, Injectable, signal } from '@angular/core';
import type { ImportResult, Progress } from '@types';

@Injectable({ providedIn: 'root' })
export class ImportStateService {
  readonly excelPath = signal<string | null>(null);
  readonly imageFolder = signal<string | null>(null);
  readonly lastResult = signal<ImportResult | null>(null);
  readonly progress = signal<Progress | null>(null);
  readonly running = signal(false);

  readonly canRun = computed(() => !!this.excelPath());

  readonly progressPercent = computed(() => {
    const p = this.progress();
    if (!p || p.total === 0) {
      return 0;
    }
    return Math.round((p.current / p.total) * 100);
  });

  reset(): void {
    this.lastResult.set(null);
    this.progress.set(null);
    this.running.set(false);
  }
}
