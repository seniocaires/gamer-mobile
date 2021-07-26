import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    if (this._storage === null || this._storage === undefined) {
      const storage = await this.storage.create();
      this._storage = storage;
    }
  }

  public async get(key: string): Promise<any> {
    await this.init();
    return this._storage?.get(key);
  }

  public async set(key: string, value: any) {
    await this.init();
    this._storage?.set(key, value);
  }

}
