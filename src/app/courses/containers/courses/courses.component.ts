import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]> | null = null;


  constructor(
    private courseServices: CoursesService,
     public dialog: MatDialog,
     private router: Router,
     private route : ActivatedRoute,
     private snackBar: MatSnackBar
     ) {
      this.refresh();
  }

  ngOnInit(): void {
  }

  onAdd(){
    console.log('onAdd');
    this.router.navigate(['new'], {relativeTo:this.route}) //aqui usamos o relative  (courses) e acrescentar o (new), assim nao precisamos colocar [courses/new]
  }

  onError(messageError: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: messageError
    });
  }

  onEdit(course: Course){
    this.router.navigate(['edit', course._id], {relativeTo:this.route})
  }

  onRemove(course: Course){
    const dialoRef = this.dialog.open(ConfirmationDialogComponent, {
      width:'200px',
      data: 'tem certeza que deseja remover o curso?',
    });

    dialoRef.afterClosed().subscribe( (result: boolean) => {
      if(result){
        this.courseServices.remove(course._id).subscribe(
          {
            next: () => {
              this.refresh();
              this.snackBar.open('Curso excluido com sucesso', '', {duration: 5000, verticalPosition: 'top', horizontalPosition:'center'});
            },
            error: () => this.onError('Erro ao tentar remover curso')
          }
        );
      }
    })
  }


  refresh(){
    this.courses$ = this.courseServices.list()
    .pipe(
      //Serve para tratamento de erro
      catchError(error => {
        this.onError('Erro ao carregar cursos.')
        return of([]) //É preciso retornar um valor, então usamos o (of) do rjx e dentro representamos um array vazio.
      })
    )
  }



}
