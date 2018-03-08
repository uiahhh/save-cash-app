import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html'
})
export class WalletsComponent { 

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      name: ['', Validators.required]
    });
  }
}