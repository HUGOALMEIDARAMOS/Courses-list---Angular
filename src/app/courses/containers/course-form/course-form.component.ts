import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {

  form = this.formBuilder.group({
    _id :[''],
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    category:['', [Validators.required]]
  });

  constructor(
    private formBuilder : NonNullableFormBuilder, //serve para impedir que todos os campos do formulario sejam vazios,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
    ) {

   }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form.setValue({
      _id: course._id,
      name: course.name,
      category : course.category
    });

  }

  onSubmit(){
     this.service.save(this.form.value)
      .subscribe({
        next: (response) => this.onSuccess(),
        error: (e) => this.onError(),
      })
  }

  onCancel(){
    this.location.back(); //volta para rota anterior
  }

  private onSuccess(){
    this.snackBar.open('Curso salvo com sucesso.', '',  {duration: 3000})
    this.onCancel()
  }


  private onError(){
    this.snackBar.open('Erro ao salvar', '',  {duration: 3000})
  }

  getErrorMessage(fieldName: string){
    const field = this.form.get(fieldName);
    if(field?.hasError('required')){
      return 'campo Obrigatorio'
    }

    if(field?.hasError('minlength')){
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return  `Tamanho minimo precisa ser de ${requiredLength} caracteres`
    }

    if(field?.hasError('maxlength')){
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength'] : 200;
      return  `Tamanho maximo precisa ser de ${requiredLength} caracteres`
    }

    return 'Campo invalido'

  }


}
