import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, first, tap } from 'rxjs';
import { Course } from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = 'api/courses'

  constructor(private readonly http: HttpClient) { }

  list(){
    return this.http.get<Course[]>(this.API)
    .pipe(
      first(),
      //delay(5000),
      tap(courses => console.log('LISTAGEM DOS CURSOS',courses))
    )
  }

  loadById(id: String){
    return this.http.get<Course>(`${this.API}/${id}`)
  }

  save(record:  Partial<Course>){ //utilizado o (partial) para informar ao angular que alguns campos nao serao enviados, comoe xemplo o id
   console.log(record);
    if(record._id){
      console.log("update");
      return this.update(record);
    }
    console.log("reate");
    return this.create(record);
  }


  private create(record:  Partial<Course>){
    return this.http.post<Course>(this.API, record).pipe( first())
  }

  private update(record:  Partial<Course>){
    return this.http.put<Course>(`${this.API}/${record._id}`, record).pipe( first())
  }

  remove(id: string){
    return this.http.delete(`${this.API}/${id}`).pipe( first());
  }





}
