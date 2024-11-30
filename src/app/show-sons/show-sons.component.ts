import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetListHijo } from 'src/models/hijo';
import { HijoService } from 'src/services/hijo.service';
import { SonDetailsComponent } from './son-details/son-details.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-sons',
  templateUrl: './show-sons.component.html',
  styleUrls: ['./show-sons.component.scss']
})
export class ShowSonsComponent implements OnInit {
  loading = false;
  idPersonal = 0;

  displayedColumns: string[] = ['idHijo', 'nombreCompleto', 'fechaNac','options'];
  datasource = new MatTableDataSource<GetListHijo>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<ShowSonsComponent>, private dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private hijoService : HijoService)
    {
      if(data){
        this.idPersonal = data.idPersonal
      }
    }

  ngOnInit() {
    this.hijoService.GetHijosByIdPersonal(this.idPersonal).subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.datasource.data = response.data;
          this.datasource.paginator = this.paginator;
          this.datasource.sort = this.sort;
        }
      }
    )
  }
  addHijo(){
    const dialogRef = this.dialog.open(SonDetailsComponent, {
      data : {
        idHijo : 0,
        idPersonal : this.idPersonal,
      },
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.hijoService.GetHijosByIdPersonal(this.idPersonal).subscribe(
          (response) => {
            if(response.isSuccess === true){
              this.datasource.data = response.data;
              this.datasource.paginator = this.paginator;
              this.datasource.sort = this.sort;
            }
          }
        )
      }
    );
  }
  editHijo(idHijo : number){
    const dialogRef = this.dialog.open(SonDetailsComponent, {
      data : {
        idHijo : idHijo,
        idPersonal : this.idPersonal,
      }
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.hijoService.GetHijosByIdPersonal(this.idPersonal).subscribe(
          (response) => {
            if(response.isSuccess === true){
              this.datasource.data = response.data;
              this.datasource.paginator = this.paginator;
              this.datasource.sort = this.sort;
            }
          }
        )
      }
    );
  }
  deleteHijo(idHijo : number){
    Swal.fire({
      title: '¿Está seguro de eliminar este registro?',
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
        this.hijoService.DeleteHijo(idHijo).subscribe(
          (response) => {
            if(response.isSuccess === true && response.data === true){
              Swal.fire({
                title: 'Se eliminó el registro correctamente.',
                text: "",
                icon: 'success',
              })
            }else{
              Swal.fire({
                title: 'Error : ' + response.message,
                text: "",
                icon: 'success',
              })
            }
          },(error) => {
            Swal.fire({
              title: 'Ocurrio un error al eliminar el registro. ' + error,
              text: "",
              icon: 'error',
            })
          }
        ).add(() => {
          this.hijoService.GetHijosByIdPersonal(this.idPersonal).subscribe(
            (response) => {
              if(response.isSuccess === true){
                this.datasource.data = response.data;
                this.datasource.paginator = this.paginator;
                this.datasource.sort = this.sort;
              }
            }
          )
        })
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();

    if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    }
  }
}
