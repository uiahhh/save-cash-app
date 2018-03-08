import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent { 

  form: FormGroup;
  
    constructor(fb: FormBuilder) {
      this.form = fb.group({
        name: ['', Validators.required],
        goalMonthly: ['', Validators.required],
        sort: ['', Validators.required],
        //fixed: ['', Validators.required],
        isIncome: ['', Validators.required],
        type: ['1', Validators.required],
      });
    }
}