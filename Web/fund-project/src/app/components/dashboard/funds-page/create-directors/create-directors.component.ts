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
  _directorsList = [];
  @Input('directorsList') set directorsList(value: any) {
    this._directorsList = value;
  }

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
    console.log(directors);
    
  }

  removeDirector(index: any,value:any) {
    console.log(value);
    
    let questions = this.directorForm.get('name') as FormArray;
    questions.removeAt(index);
    if (index >= 0) {
      // this.apiService.deleteDirector(value).subscribe((res:any)=>{
      //   if(res.status == "ok"){
      //     this._directorsList.splice(index, 1);
      //     this.sendDirectorsData.emit(this._directorsList);
      //     this.refresh();
      //   }else{
      //     this.refresh();
      //   }
      // },err=>{
      //   this.refresh();
      // })
    }
  }

  refresh(){
    return this._directorsList = [...this._directorsList];
  }

  // remove(value: string): void {
  //   const index = this.directors.findIndex((res:any)=>res.name == value);

  //   if (index >= 0) {
  //     this.apiService.deleteDirector(value).subscribe((res:any)=>{
  //       if(res.status == "ok"){
  //         this.directors.splice(index, 1);
  //         this.refresh();
  //       }else{
  //         this.refresh();
  //       }
  //     },err=>{
  //       this.refresh();
  //     })
  //   }
  // }

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();

  //   // Add our fruit
  //   if (value) {
  //     this.directors.map((res: any, index: any) => {
  //       if (res.name != value) {
  //         let person={
  //           id:null,
  //           name:value
  //         }
  //         this.apiService.addDirector(person).subscribe(
  //           (result: any) => {
  //             if (result.status == 'ok') {
  //               this.directors.push(value);
  //               this.refresh();
  //             } else {
  //               this.refresh();
  //             }
  //           },
  //           (err: any) => {
  //             this.refresh();
  //           }
  //         );
  //       }
  //     });
  //   }

  // }

  getValidDirectors(directors: any) {
    let arr: any = [];
    this._directorsList.map((res) => {
      directors.map((result: any) => {
        if (res === result.name) {
          arr.push(result.name);
        }
      });
    });
    return arr;
  }

  submitData() {
    if (this.directorForm.valid) {
      let validDirectors = this.getValidDirectors(this.directorForm.value);
      if (validDirectors && validDirectors.length) {
        this.apiService.addDirector(validDirectors).subscribe(
          (result: any) => {
            if (result.status == 'ok') {
              this.sendDirectorsData.emit(validDirectors);
              this._directorsList = this._directorsList.concat(validDirectors);
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
}
