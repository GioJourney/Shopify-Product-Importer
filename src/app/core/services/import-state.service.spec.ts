import { TestBed } from '@angular/core/testing';
import { ImportStateService } from './import-state.service';

describe('ImportStateService', () => {
  let service: ImportStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportStateService);
  });

  describe('canRun', () => {
    it('is false with no excel path selected', () => {
      expect(service.canRun()).toBe(false);
    });

    it('is true once an excel path is set', () => {
      service.excelPath.set('C:/products.xlsx');
      expect(service.canRun()).toBe(true);
    });
  });

  describe('progressPercent', () => {
    it('is 0 when there is no progress', () => {
      expect(service.progressPercent()).toBe(0);
    });

    it('is 0 when total is 0 (avoids divide-by-zero)', () => {
      service.progress.set({ current: 0, total: 0, title: '' });
      expect(service.progressPercent()).toBe(0);
    });

    it('rounds the percentage to the nearest integer', () => {
      service.progress.set({ current: 1, total: 3, title: 'Product' });
      expect(service.progressPercent()).toBe(33);
    });

    it('reaches 100 when complete', () => {
      service.progress.set({ current: 8, total: 8, title: 'Last' });
      expect(service.progressPercent()).toBe(100);
    });
  });

  describe('reset', () => {
    it('clears result, progress and running but keeps selected paths', () => {
      service.excelPath.set('C:/products.xlsx');
      service.imageFolder.set('C:/images');
      service.progress.set({ current: 2, total: 4, title: 'x' });
      service.running.set(true);

      service.reset();

      expect(service.lastResult()).toBeNull();
      expect(service.progress()).toBeNull();
      expect(service.running()).toBe(false);
      expect(service.excelPath()).toBe('C:/products.xlsx');
      expect(service.imageFolder()).toBe('C:/images');
    });
  });
});
