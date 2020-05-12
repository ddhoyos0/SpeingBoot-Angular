import Swal from 'sweetalert2';
import { ClientesService } from './../../service/clientes.service';
import { Clientes } from './../../models/clientes';
import { Component, OnInit, Input } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from '../../service/modal.service';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Clientes;
  fotoSelecionada: File;
  progreso = 0;

  constructor(
    private service: ClientesService,
    public modalService: ModalService
  ) { }

  ngOnInit(){}

  seleccionarFoto(event){
    this.fotoSelecionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSelecionada.type.indexOf('image') < 0){
      Swal('Error al seleccionar imagen:', ' El archivo debe ser del tipo imagen!!', 'error');
      this.fotoSelecionada = null;
    }
  }

  subirFoto(){
    if (!this.fotoSelecionada){
      Swal('Error Upload:', ' debe seleccionar una foto!', 'error');
    }else{
      this.service.uploadImg(this.fotoSelecionada, this.cliente.id)
      .subscribe( event => {
        if (event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded / event.total) * 100);
        }else if (event.type === HttpEventType.Response){
          const response: any = event.body;
          this.cliente = response.cliente as Clientes;

          this.modalService.getNotificarUpload().emit(this.cliente);
          Swal('La foto se ha subido completamente!', response.mensaje, 'success');
        }
       // this.cliente = client;
        //
      });
    }
  }
  cerrarModal(){
    this.modalService.cerrarModal();
    this.progreso = 0;
    this.fotoSelecionada = null;
  }
}
