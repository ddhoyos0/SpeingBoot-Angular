import { ActivatedRoute } from '@angular/router';
import { Clientes } from './../models/clientes';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ClientesService } from './../service/clientes.service';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../service/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  clientes: Clientes[];
  paginator: any;
  clienteSeleccionado: Clientes;
  constructor(
    private clientService: ClientesService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {

        let page: number = +params.get('page');

        if (!page){
          page = 0;
        }

        this.clientService.getClientes(page)
        .subscribe(response => {
          this.clientes = response.content as Clientes[];
          this.paginator = response;
        });
    });

    this.modalService.getNotificarUpload().subscribe(client => {
      this.clientes.map(clientOriginal => {
        if (client.id === clientOriginal.id){
          clientOriginal.foto = client.foto;
        }
        return clientOriginal;
      });
    });
  }

  delete(cliente: Clientes): void {
    // tslint:disable-next-line: deprecation
    Swal.fire({
      title: 'Esta seguro?',
      text: `¿seguro que desea eliminar al cliente ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
         this.clientService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            Swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito!!`,
              'success'
            );
          }
        );
      }
    });
  }

  abrirModal(cliente: Clientes){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
