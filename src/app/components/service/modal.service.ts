import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal = false;
  private notificarUpload = new EventEmitter<any>();

  constructor() { }

  getNotificarUpload(): EventEmitter<any>{
    return this.notificarUpload;
  }

  abrirModal(){ this.modal = true; }

  cerrarModal(){ this.modal = false; }
}
