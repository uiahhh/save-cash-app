import { Component, Injectable, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import * as $ from 'jquery';
import * as moment from 'moment';

import { CrudComponent } from '../../shared/crud/crud.component';
import { SharedData } from '../../shared/shared-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent { 

  weeks = [0,1,2,3,4];

  headSelected: boolean = false;

  categories: any;
  categorySelected: any;

  incomes: any;
  incomesSoFar: any;
  incomesSum: any;
  incomesSumGoal: any;
  incomesMonth: any;
  incomesPercent: any;

  expenses: any;
  expensesSoFar: any;
  expensesSum: any;
  expensesSumGoal: any;
  expensesMonth: any;
  expensesPercent: any;
  expensesWeek: any;

  categoryType: any;

  get month () { return SharedData.month; };
  get year () { return SharedData.year; };
  get yearMonth () { return SharedData.yearMonth(); }
  get months () { return SharedData.months; };

  @ViewChild('modal') 
  modal: ElementRef;
  modalElement: any;

  modalConfig = {
    dismissible: true, 
    opacity: .5,
    inDuration: 300, 
    outDuration: 200, 
    startingTop: '4%',
    endingTop: '10%', 
    ready: (modal, trigger) => { 
      console.log(modal, trigger);
    },
    complete: () => { console.log('Closed'); } 
  };

  constructor(protected db: AngularFirestore, fb: FormBuilder, protected route: ActivatedRoute){
  
  }

  ngAfterViewInit() {   

    this.modalElement = jQuery(this.modal.nativeElement);
    this.modalElement.modal(this.modalConfig);
    
    this.route.params.subscribe(params => { 
      this.categoryType = params.categoryType;
      this.loadData();
    });
  }

  loadData() {
    this.db
      .collection<any>('users')
      .doc(SharedData.userLogged.uid)
      .collection<any>('categories')
      .snapshotChanges()
      .map(this.snapshotToValue)
      .subscribe(values => {
        this.categories = values.filter(c => !c.isIncome && 
          ((this.categoryType != 'year' && c.type != 'year') || c.type == this.categoryType)); //traz somente o anual ou traz todo o resto
        this.categories.sort((a, b) => this.sortCompare('sort', a, b));
        this.loadExpenses();
      });   
  }

  sortCompare(field, a, b) {
    if (a[field] < b[field])
      return -1;
    if (a[field] > b[field])
      return 1;
    return 0;
  }  

  nextMonth() {
    let qtt = this.categoryType == 'year' ? 12 : 1;
    SharedData.nextMonth(qtt);
    this.setComputedFields();
  }

  prevMonth() {
    let qtt = this.categoryType == 'year' ? 12 : 1;
    SharedData.prevMonth(qtt);
    this.setComputedFields();
  }

  formatDate(date) {
    return moment(date, 'YYYY-MM-DD').format('DD/MM');
  }

  snapshotToValue(values) {       
    return values.map(value => {
      const data: any = value.payload.doc.data();
      data.id = value.payload.doc.id;
      return data;
    });
  }

  loadExpenses() {
    this.db
      .collection<any>('users')
      .doc(SharedData.userLogged.uid)
      .collection<any>('expenses')
      .snapshotChanges()
      .map(this.snapshotToValue)
      .subscribe(values => {
        this.expenses = values;   
        this.loadIncomes();     
      });  
  }

  loadIncomes() {
    this.db
      .collection<any>('users')
      .doc(SharedData.userLogged.uid)
      .collection<any>('incomes')
      .snapshotChanges()
      .map(this.snapshotToValue)
      .subscribe(values => {
        this.incomes = values;     
        this.setComputedFields();
      });  
  }

  setComputedFields() {
    if (this.categoryType == 'year')
      this.expensesMonth = this.expenses.filter(e => e.date.startsWith(this.year) && e.category.type == 'year');
    else 
      this.expensesMonth = this.expenses.filter(e => e.date.startsWith(this.yearMonth) && e.category.type != 'year');
    this.expensesSum = this.expensesMonth.length == 0 ? 0 : this.expensesMonth.map(e => e.value).reduce(this.getSum);
    this.expensesSumGoal = this.categories.length == 0 ? 0 : this.categories.map(e => e.goalMonthly).reduce(this.getSum);
    let expensesSoFarArr = this.expensesMonth.filter(e => e.date <= moment().format('YYYY-MM-DD'));
    this.expensesSoFar = expensesSoFarArr.length == 0 ? 0 : expensesSoFarArr.map(e => e.value).reduce(this.getSum);
    this.expensesPercent = (this.expensesSoFar / this.expensesSum) * 100;
    if (this.expensesPercent > 100) this.expensesPercent = 100;
    if (this.categoryType != 'year') this.expensesWeek = this.getExpensesWeek();

    if (this.categoryType == 'year')
      this.incomesMonth = this.incomes.filter(e => e.date.startsWith(this.year) && e.category.type == 'year');
    else 
      this.incomesMonth = this.incomes.filter(e => e.date.startsWith(this.yearMonth) && e.category.type != 'year');
    this.incomesSum = this.incomesMonth.length == 0 ? 0 : this.incomesMonth.map(e => e.value).reduce(this.getSum);
    //this.incomesSumGoal = this.incomesMonth.length == 0 ? 0 : this.incomesMonth.map(e => e.category.goalMonthly).reduce(this.getSum);
    let incomesSoFarArr = this.incomesMonth.filter(e => e.date <= moment().format('YYYY-MM-DD'));
    this.incomesSoFar = incomesSoFarArr.length == 0 ? 0 : incomesSoFarArr.map(e => e.value).reduce(this.getSum);
    this.incomesPercent = (this.incomesSoFar / this.incomesSum) * 100;
    if (this.incomesPercent > 100) this.incomesPercent = 100;

    this.soFarColor = this.getColor(false, this.incomesSoFar, this.expensesSoFar);
    this.totalColor = this.getColor(false, this.incomesSum, this.expensesSum);

    this.categories.forEach(category => {
      this.setSumExpenses(category, this.expensesMonth);
      this.setGoalPercent(category, category.goalMonthly, false);  
      if (this.categoryType != 'year') this.setComputedFieldsWeek(category);   
    });
  }

  soFarColor;
  totalColor;

  getColor(isweek, goal, current) {
    let result = 'amber';
    let daysInMonth = moment(this.yearMonth, 'YYYY-MM').daysInMonth();
    let currentDay = moment().date();
    let expected = (this.incomesSoFar / daysInMonth) * currentDay;

    let percent = (current / goal) * 100;

    if (isweek || this.yearMonth != moment().format('YYYY-MM')){
      if (percent > 97) result = 'pink';
      if (percent < 70) result = 'cyan';
    } else {
      if (current > expected * 1.1) result = 'pink';
      if (current < expected * 0.9) result = 'cyan';
    }

    return result;
  }

  getExpensesWeek() {
    let result = [];
    let startOfWeek = moment(this.yearMonth, 'YYYY-MM').startOf('week');
    let endOfWeek = moment(this.yearMonth, 'YYYY-MM').endOf('week');

    for (let index = 0; index < this.weeks.length; index++) {
      let expenses = this.expenses
        .filter(e => startOfWeek.format('YYYY-MM-DD') <= e.date && e.date <= endOfWeek.format('YYYY-MM-DD'));
      result.push(expenses);

      startOfWeek = startOfWeek.add(7, 'days');
      endOfWeek = endOfWeek.add(7, 'days');
    } 
    return result;
  }

  setComputedFieldsWeek(category) {
    category.weeks = [];
    for (let index = 0; index < this.weeks.length; index++) {
      let categoryWeek: any = { id: category.id };   
      categoryWeek.goalWeekly = Math.round((category.goalMonthly * 12) / 52);

      this.setSumExpenses(categoryWeek, this.expensesWeek[index]);   
      this.setGoalPercent(categoryWeek, categoryWeek.goalWeekly, true);  
      category.weeks.push(categoryWeek);
    } 
  }

  setSumExpenses(category, expenses) {
    category.expenses = expenses
      .filter(e => e.category.id == category.id);
    
    category.expenses.sort((a, b) => this.sortCompare('date', a, b));
    
    if (category.expenses.length == 0) {
      category.sumExpenses = 0;
    } else {
      category.sumExpenses = category.expenses
        .map(e => e.value)
        .reduce(this.getSum);
    }
  }

  setGoalPercent(category, goal, isweek: boolean) {
    category.goalPercent = (category.sumExpenses / goal) * 100;
    if (category.goalPercent > 100) category.goalPercent = 100;
    if (category.goalPercent < 0) category.goalPercent = 0;

    category.goalColor = this.getColor(isweek, goal, category.sumExpenses);
  }

  getSum(total, num) {
    return total + num;
  }
  
  selectCategory(category) { 
    if (this.categorySelected == category)
      this.categorySelected = null;
    else
      this.categorySelected = category;
  } 

  openModal() {
    this.modalElement.modal('open');
  }

  save() {
    this.modalElement.modal('close');
  }

  selectHead() {
    this.headSelected = !this.headSelected;
  }

  // weeks = [0,1,2,3,4];
  
  // itemSelected:any={};
  // itemOpened:any={};
  
  // data$: Observable<any>;
  // items: any;



  // constructor(
  //   private router: Router,
  //   private http: HttpClient, 
  //   private firebase: AngularFirestore
  // ) {     
  // }


  // ngOnInit(){
  //   this.loadData();   

  //   this.firebase
  //     .collection<any>('items')
  //     .valueChanges()
  //     .map(items => items.map(i => {
  //       i.height = '5';
  //       return i;
  //     }))
  //     .subscribe(items => this.items = items);  
  // }

  // loadData() {
  //   let requestURL = 'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json';
  //   this.data$ = this.http.get(requestURL).share();      
  // } 

  // selectItem(item) { 
  //   if (this.itemSelected == item)
  //     this.itemSelected = {};
  //   else
  //     this.itemSelected = item;
  // } 

  // openItem(item) {
  //   this.itemOpened = item;
  //   this.itemModalElement.modal('open');
  // }
}
