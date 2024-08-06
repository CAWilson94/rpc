import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  addOrUpdateLocalStorageItem<T>(key: string, value: Partial<T>){ 
      const existingItem = this.getLocalStorageItem<T>(key);

      if(existingItem){ 
        const updatedItem = {...existingItem, ...value};
        this.setLocalStorageItem(key, updatedItem);
      }else{
        this.setLocalStorageItem(key, value);
      }
  }

  setLocalStorageItem<T>(key: string, value: T){
      localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorageItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T: null;
  }

  removeLocalStorageItem(key: string){ 
    localStorage.removeItem(key);
  }

  clear(){ 
    localStorage.clear();
  }
  
}
