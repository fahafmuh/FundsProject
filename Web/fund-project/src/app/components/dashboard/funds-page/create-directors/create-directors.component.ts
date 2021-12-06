import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-create-directors',
  templateUrl: './create-directors.component.html',
  styleUrls: ['./create-directors.component.scss'],
})
export class CreateDirectorsComponent implements OnInit {
  directorForm: FormGroup;
  @Input('directorsList') _directorsList:any = [];
  
  @Input('headingPerson') headingPerson:string = '';

  @Output('sendDirectorsData') sendDirectorsData = new EventEmitter();

  constructor(
    private formbuilder: FormBuilder,
    private apiService: APIService
  ) {}

  ngOnInit(): void {
    this.directorForm = this.formbuilder.group({
      directors: this.formbuilder.array(
        this.TransformActions(),
        Validators.required
      )
    });
    console.log(this._directorsList);
    
  }

  TransformActions(): FormGroup[] {
    let fb: FormGroup[] = [];
    fb.push(
      this.formbuilder.group({
        name: ['', [Validators.required]],
      })
    );

    return fb;
  }

  GetControls(name: string) {
    return (this.directorForm.get(name) as FormArray).controls;
  }

  addDirector() {
    let fb: FormGroup = this.formbuilder.group({
      name: ['', [Validators.required]]

		})
		let directors = this.directorForm.get('directors') as FormArray;
		directors.push(fb);
  }

  removeDirector(index: any) {
    let questions = this.directorForm.get('directors') as FormArray;
    questions.removeAt(index);
  }

  deleteDirector(id:number){
      let index = this._directorsList.findIndex((res:any)=>res.id == id);
        if(index >= 0){
          this.apiService.deleteDirector(id).subscribe((res:any)=>{
            if(res.status == "ok"){
              this._directorsList.splice(index, 1);
              this.sendDirectorsData.emit(this._directorsList);
              this.refresh();
            }else{
              this.refresh();
            }
          },err=>{
            this.refresh();
          })
        }
        
  }

  refresh(){
    return this._directorsList = [...this._directorsList];
  }
  
  submitData() {
    console.log(this.directorForm.value);
    
    if (this.directorForm.valid) {
        this.apiService.addDirector(this.directorForm.value.directors[0]).subscribe(
          (result: any) => {
            if (result.status == 'ok') {
              let obj = {
                director_name: this.directorForm.value.directors[0].name
              }
              this._directorsList.push(obj);
              this.refresh();
              this.sendDirectorsData.emit(this._directorsList);
              this.directorForm.reset();
            } else {
              this.refresh();
            }
          },
          (err: any) => {
            this.refresh();
          }
        );
    }
  }
}
