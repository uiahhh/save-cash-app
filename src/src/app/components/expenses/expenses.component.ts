import { Component, Injectable, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import * as $ from 'jquery';
import * as moment from 'moment';
//TODO: esta chamada é necessaria, mas causa erro no efeito waves - issue: https://github.com/Dogfalo/materialize/issues/2667
import * as Materialize from 'materialize-css';

import { CrudComponent } from '../../shared/crud/crud.component';
import { SharedData } from '../../shared/shared-data';
import { DurationInputArg2 } from 'moment';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent { 

  form: FormGroup;
  categoryItems: any;
  walletItems: any;

  get filter(): (value) => boolean {
    if (this.categoryType == 'year')
      return (value) => value.category.type == this.categoryType && value.date.startsWith(this.year);
    else
      return (value) => value.category.type == this.categoryType && value.date.startsWith(this.yearMonth);
  };

  sort: any = 'date';
  collection: any = 'expenses';
  

  @ViewChild('crud') 
  crud: CrudComponent;

  get month () { return SharedData.month; };
  get year () { return SharedData.year; };
  get yearMonth () { return SharedData.yearMonth(); }
  get months () { return SharedData.months; };

  constructor(protected db: AngularFirestore, fb: FormBuilder, protected route: ActivatedRoute){

    this.form = fb.group({
      text: ['', Validators.required],
      value: ['', Validators.required],
      date: [moment().format('YYYY-MM-DD'), Validators.required],
      category: ['', Validators.required],      
    });

    this.categoryType = this.route.snapshot.params.categoryType;
    this.collection = this.route.snapshot.params.collection;
  }

  nextMonth() {
    let qtt = this.categoryType == 'year' ? 12 : 1;
    SharedData.nextMonth(qtt);
    this.loadData();
  }

  prevMonth() {
    let qtt = this.categoryType == 'year' ? 12 : 1;
    SharedData.prevMonth(qtt);
    this.loadData();
  }  

  formatDate(date) {
    return moment(date, 'YYYY-MM-DD').format('DD/MM');
  }

  categoryType: string = 'month';

  loadData() {
    this.crud.loadData(this.collection, this.filter, this.sort);
    this.db
      .collection<any>('users')
      .doc(SharedData.userLogged.uid)
      .collection<any>('categories')
      .snapshotChanges()
      .map(this.snapshotToValue)
      .subscribe(values => {
        if (this.collection == 'expenses')
          this.categoryItems = values.filter(e => !e.isIncome && e.type == this.categoryType);
        else
          this.categoryItems = values.filter(e => e.isIncome && e.type == this.categoryType);
      }); 

    this.db
      .collection<any>('users')
      .doc(SharedData.userLogged.uid)
      .collection<any>('wallets')
      .snapshotChanges()
      .map(this.snapshotToValue)
      .subscribe(values => {
        this.walletItems = values;
      });       
  }

  public compareById(object1: any, object2: any): boolean {
    return object1 != null && object2 != null && object1.id === object2.id;
  }

  snapshotToValue(values) {       
    return values.map(value => {
      const data: any = value.payload.doc.data();
      data.id = value.payload.doc.id;
      return data;
    });
  }

  copyNextMonth() {

    let categoryTypeLabel = this.categoryType == 'year' ? 'ano' : 'mês';
    if (confirm('Fazer cópia e ir para o próximo ' + categoryTypeLabel + '?') == false) return;

    let itemCollection = this.db
      .collection<any>('users')
      .doc(SharedData.userLogged.uid)
      .collection<any>(this.collection);  

    let items = this.crud.getData();
    items.forEach(item => {
      let data: any = {};
      Object.assign(data, item);
      delete data.id;
      let incrementType: DurationInputArg2 = this.categoryType == 'year' ? 'y' : 'M';
      data.date = moment(data.date, 'YYYY-MM-DD').add(1, incrementType).format('YYYY-MM-DD');
      itemCollection.add(data); 
    });  
    
    Materialize.toast('Dados copiados com sucesso.', 2500);
    this.nextMonth();
  }

  ngAfterViewInit() {   
    this.route.params.subscribe(params => { 
      this.categoryType = params.categoryType;
      this.collection = params.collection;
      this.loadData();
    });
  } 
}