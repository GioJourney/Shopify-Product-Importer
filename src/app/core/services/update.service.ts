import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { UpdateStatus } from '@types';

@Injectable({ providedIn: 'root' })
export class UpdateService {
  /** Auto-updates are only available inside the packaged Electron shell. */
  get isSupported(): boolean {
    return !!window.shopifyImporter?.updates;
  }

  getAppVersion(): Promise<string> {
    return this.api.getAppVersion();
  }

  check(): Promise<UpdateStatus> {
    return this.api.check();
  }

  download(): Promise<UpdateStatus> {
    return this.api.download();
  }

  install(): Promise<void> {
    return this.api.install();
  }

  status$(): Observable<UpdateStatus> {
    return new Observable<UpdateStatus>((subscriber) => {
      const unsubscribe = this.api.onStatus((status) => subscriber.next(status));
      return () => unsubscribe();
    });
  }

  private get api() {
    return window.shopifyImporter.updates;
  }
}
