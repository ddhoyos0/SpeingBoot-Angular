import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directivas',
  templateUrl: './directivas.component.html'
})
export class DirectivasComponent {
  habilitar = true;
  listaCursos: string[] = ['Angular', 'Java SE', 'Spring Boot'];

  constructor() { }

  setHabilitar(): void {
    this.habilitar = (this.habilitar === true) ? false : true;
  }
}
