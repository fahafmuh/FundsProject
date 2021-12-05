import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-directors',
  templateUrl: './create-directors.component.html',
  styleUrls: ['./create-directors.component.scss']
})
export class CreateDirectorsComponent implements OnInit {
  directorForm:FormGroup;
  constructor(private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.directorForm = new FormGroup({
      name: new FormArray([])
    });
  }

  GetControls(name: string) {
    return (this.directorForm.get(name) as FormArray).controls;
  }

  
  addDirector() {
    let val = this.formbuilder.group({
      name: ['', []]
    });

    let form = this.directorForm.get('name') as FormArray
    form.push(val);
  }

  removeDirector(index:any) {
    let questions = this.directorForm.get('name') as FormArray;
    questions.removeAt(index);
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

}
