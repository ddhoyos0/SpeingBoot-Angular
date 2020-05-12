import { ClientesService } from './../../service/clientes.service';
import { Component, OnInit } from '@angular/core';
import { Clientes } from '../../models/clientes';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  cliente: Clientes = new Clientes();
  errores: string[];

  constructor(
    private clienteService: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(data => {
      const id = data.id;
      if (id){
        this.clienteService.getClienteId(id).subscribe( client => {
          this.cliente = client;
        });
      }
    });
  }
  create(): void {
    this.clienteService.addCliente(this.cliente)
      .subscribe(json => {
        this.router.navigate(['clientes']);
        Swal('Nuevo Cliente', `${json.mensaje} =>> ${json.cliente.nombre}`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente)
      .subscribe(json => {
        this.router.navigate(['clientes']);
        Swal('Actualizar Cliente', `${json.mensaje} ${json.cliente.nombre}`, 'success');
      },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    });
  }
}
