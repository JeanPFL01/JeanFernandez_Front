import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetListPersonal } from 'src/models/personal';
import { PersonalService } from 'src/services/personal.service';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import Swal from 'sweetalert2';
import { ShowSonsComponent } from './show-sons/show-sons.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = ''
  arrowPositionState = 'start';

  loading = false;

  displayedColumns: string[] = ['idPersonal', 'nombreCompleto', 'tipoDoc', 'numeroDoc', 'fechaNac', 'fechaIngreso', 'options'];
  datasource: MatTableDataSource<GetListPersonal> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private personalService: PersonalService, private dialog : MatDialog) {}

  ngOnInit() {
    this.loading = true;
    this.personalService.GetPersonal().subscribe(
      (response) => {
        if (response.isSuccess === true) {
          this.datasource.data = response.data;
          this.datasource.paginator = this.paginator;
          this.datasource.sort = this.sort;
          this.arrowPositionState = 'end';
          console.log(this.datasource.data)
        }
      },
      (error) => {
        console.error('Error en la suscripción', error);
      }
    ).add(() => {
      this.loading = false;
    });
  }

  addPersonal(){
    const dialogRef = this.dialog.open(PersonalDetailsComponent, {
      data : {
        idPersonal : 0,
      },
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.personalService.GetPersonal().subscribe(
          (response) => {
            if (response.isSuccess === true) {
              this.datasource.data = response.data;
              this.datasource.paginator = this.paginator;
              this.datasource.sort = this.sort;
              this.arrowPositionState = 'end';
              console.log(this.datasource.data)
            }
          },
          (error) => {
            console.error('Error en la suscripción', error);
          }
        );
      }
    );
  }
  editPersonal(idPersonal : number){
    const dialogRef = this.dialog.open(PersonalDetailsComponent, {
      data : {
        idPersonal : idPersonal,
      }
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.personalService.GetPersonal().subscribe(
          (response) => {
            if (response.isSuccess === true) {
              this.datasource.data = response.data;
              this.datasource.paginator = this.paginator;
              this.datasource.sort = this.sort;
              this.arrowPositionState = 'end';
              console.log(this.datasource.data)
            }
          },
          (error) => {
            console.error('Error en la suscripción', error);
          }
        );
      }
    );
  }
  deletePersonal(idPersonal : number){
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
        this.personalService.DeletePersonal(idPersonal).subscribe(
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
        ).add(() =>{

        this.loading = false;
          this.personalService.GetPersonal().subscribe(
            (response) => {
              if (response.isSuccess === true) {
                this.datasource.data = response.data;
                this.datasource.paginator = this.paginator;
                this.datasource.sort = this.sort;
                this.arrowPositionState = 'end';
                console.log(this.datasource.data)
                console.log(this.datasource.data)
              }
            },
            (error) => {
              console.error('Error en la suscripción', error);
            }
          );
        })
      }
    })
  }
  showSons(idPersonal : number){
    const dialogRef = this.dialog.open(ShowSonsComponent, {
      data : {
        idPersonal : idPersonal,
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();

    if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    }
  }
}
