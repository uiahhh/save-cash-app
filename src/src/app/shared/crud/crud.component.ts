import { Component, ElementRef, ViewChild, Input, TemplateRef, ContentChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
//TODO: esta chamada é necessaria, mas causa erro no efeito waves - issue: https://github.com/Dogfalo/materialize/issues/2667
import * as Materialize from 'materialize-css';

import { CardItemDirective } from './card-item.directive';
import { SharedData } from '../shared-data';

export enum Action {
  Create,
  Edit,
  Delete
}

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html'
})
export class CrudComponent { 

  @Input()
  form: FormGroup;

  @Input()
  collection: string;

  @Input()
  filter: (value) => boolean = (value) => true;

  @Input()
  sort: any = '';

  @ContentChild(CardItemDirective, {read: TemplateRef}) 
  cardItemTemplate;

  get isCreate() { return this.action == Action.Create;}
  get isEdit() { return this.action == Action.Edit;}
  get isDelete() { return this.action == Action.Delete;}

  action: Action;
  itemSelected:any;
  itemOpened:any;
  items: any = [];
  //items$: AngularFireList<any[]>;
  itemCollection: AngularFirestoreCollection<any>;

  @ViewChild('itemModal') 
  itemModal: ElementRef;
  itemModalElement: any;

  modalConfig = {
    dismissible: true, 
    opacity: .5,
    inDuration: 300, 
    outDuration: 200, 
    startingTop: '4%',
    endingTop: '10%', 
    ready: (modal, trigger) => console.log(modal, trigger),
    complete: () => console.log('Closed')
  };

  constructor(protected db: AngularFirestore) {     
  }

  ngOnInit() {
    this.loadData(this.collection, this.filter, this.sort);
  }
  
  public loadData(collection, filter, sort) {
    this.itemCollection = this.db
      .collection<any>('users')
      .doc(SharedData.userLogged.uid)
      .collection<any>(collection);

    this.itemCollection
      .snapshotChanges()
      .map(this.snapshotToValue)
      .subscribe(values => {
        this.items = values.filter(filter);
        this.items.sort((a, b) => this.sortCompare(sort, a, b));
      });
  }

  public getData() {
    return this.items;
  }

  sortCompare(field, a, b) {
    if (a[field] < b[field])
      return -1;
    if (a[field] > b[field])
      return 1;
    return 0;
  }  

  ngAfterViewInit() {   
    this.itemModalElement = jQuery(this.itemModal.nativeElement);
    this.itemModalElement.modal(this.modalConfig);
  } 

  snapshotToValue(values) {       
    return values.map(value => {
      const data: any = value.payload.doc.data();
      data.id = value.payload.doc.id;
      return data;
    });
  }

  selectItem(item) {
    if (this.itemSelected == item)
      this.itemSelected = null;
    else
      this.itemSelected = item;
  }

  createItem(item) {
    this.openItem(Action.Create, {});
  }

  editItem(item) {
    this.openItem(Action.Edit, this.itemSelected);
  }

  deleteItem(item) {
    this.openItem(Action.Delete, this.itemSelected);
  }

  openItem(action: Action, item: any) {
    this.itemSelected = null;
    this.itemOpened = item;
    this.action = action;

    this.form.reset(item);
    if (this.action == Action.Delete)
      this.form.disable();
    else
      this.form.enable();

    this.itemModalElement.modal('open');
    Materialize.updateTextFields();
  }

  save() {
    let data = this.form.value;
    
    if (this.form.invalid) {
      Materialize.toast('Preencha corretamente.', 2500);
      return;
    }

    switch (this.action) {
      case Action.Create:  
        this.itemCollection.add(data);      
        break;    
      case Action.Edit:  
        let itemToEdit = this.itemCollection.doc<any>(this.itemOpened.id);
        itemToEdit.update(data);      
        break;
      case Action.Delete:     
        let itemToDelete = this.itemCollection.doc<any>(this.itemOpened.id);
        itemToDelete.delete();   
        break;                
      default:
        break;
    }

    this.itemModalElement.modal('close');
  }
}