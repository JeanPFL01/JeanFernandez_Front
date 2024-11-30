import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Hijo } from 'src/models/hijo';
import { HijoService } from 'src/services/hijo.service';
import Swal from 'sweetalert2';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-son-details',
  templateUrl: './son-details.component.html',
  styleUrls: ['./son-details.component.scss']
})
export class SonDetailsComponent implements OnInit {

  idHijo = 0;
  idPersonal = 0;
  tipoDoc = "DNI"
  numeroDoc = ""
  apPaterno = ""
  apMaterno = ""
  nombre1 = ""
  nombre2 = ""
  nombreCompleto = ""
  fechaNac = new Date()

  nombre1Control = new FormControl('', [Validators.required]);
  numeroDocControl = new FormControl('', [Validators.required]);
  tipoDocControl = new FormControl('', [Validators.required]);
  apPaternoControl = new FormControl('', [Validators.required]);
  apMaternoControl = new FormControl('', [Validators.required]);
  fechaNacControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();


  modelo : Hijo[] = []

  title = "";
  button = "";
  loading = false;
   constructor(public dialogRef: MatDialogRef<SonDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private hijoService : HijoService) {
      if(data){
        this.idHijo = data.idHijo;
        this.idPersonal = data.idPersonal;
        if(this.idHijo > 0){
          this.title = "Editar Hijo";
          this.button = "Editar";
        }else{
          this.title = "Agregar Hijo"
          this.button = "Agregar"
        }
      }
    }

  ngOnInit() {
    if(this.idHijo > 0){
      this.loading = true;
      this.hijoService.GetHijoById(this.idHijo).subscribe(
        (response) => {
          if(response.isSuccess === true && response.data !== null){
            this.idPersonal = response.data.idPersonal
            this.tipoDoc = response.data.tipoDoc
            this.numeroDoc = response.data.numeroDoc
            this.apPaterno = response.data.apPaterno
            this.apMaterno = response.data.apMaterno
            this.nombre1 = response.data.nombre1
            this.nombre2 = response.data.nombre2
            this.nombreCompleto = response.data.nombreCompleto
            this.fechaNac = response.data.fechaNac
          }else{
            Swal.fire({
              title: 'Ocurrio un problema.',
              text: "",
              icon: 'error',
              showCancelButton: true,
            })
          }
        },(error) => {
          Swal.fire({
            title: 'Error: ' + error,
            text: "",
            icon: 'error',
            showCancelButton: true,
          })
        }
      ).add(() => {
        this.loading = false;
      })
    }

  }
  saveChanges(){
    this.modelo[0] = {
      idHijo : this.idHijo,
      idPersonal : this.idPersonal,
      tipoDoc : this.tipoDoc,
      numeroDoc : this.numeroDoc,
      apPaterno : this.apPaterno,
      apMaterno : this.apMaterno,
      nombre1 : this.nombre1,
      nombre2 : this.nombre2,
      nombreCompleto : this.nombre1 + ' ' + this.nombre2 + ' ' + this.apPaterno + ' ' + this.apMaterno,
      fechaNac : this.fechaNac,
    }
    console.log(this.modelo[0])
    Swal.fire({
      title: '¿Está seguro de ' + this.button + ' este registro?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText : 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      width: '20rem',
      heightAuto : true
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.hijoService.AddOrUpdateHijo(this.modelo[0]).subscribe(
          (response) => {
            if(response.isSuccess === true && response.data === true){
              Swal.fire({
                title: 'Se ' + (this.modelo[0].idHijo > 0 ? 'editó' : 'agregó') + ' el registro correctamente.',
                text: "",
                icon: 'success',
              })
            }else{
              Swal.fire({
                title: 'Ocurrio un problema.' + response.message ,
                text: "",
                icon: 'error',
              })
            }
          },(error) => {
            Swal.fire({
              title: 'Error: ' + error,
              text: "",
              icon: 'error',
            })
          }
        ).add(() => {
          this.dialogRef.close()
          this.loading = false;
        })
      }
    })
  }
}