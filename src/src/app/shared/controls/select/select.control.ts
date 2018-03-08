import {NgModule,Component,Input,Output,EventEmitter,forwardRef,ChangeDetectorRef, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl} from '@angular/forms';

import * as $ from 'jquery';
//TODO: esta chamada é necessaria, mas causa erro no efeito waves - issue: https://github.com/Dogfalo/materialize/issues/2667
import * as Materialize from 'materialize-css';

export const SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectControl),
  multi: true
};

@Component({
    selector: 'select-control',
    template: `

    <ng-content></ng-content>
    <select #select  
    [ngStyle]="style" [class]="styleClass"
    [attr.id]="inputId" [name]="name" 
    [disabled]="disabled" [attr.tabindex]="tabindex" 
    (blur)="onBlur($event)" (change)="handleChange($event)">
        <option></option>
        <option 
        *ngFor="let option of options" 
        [selected]="value && value[optionValue] == option[optionValue]"
        [value]="option[optionValue]">{{ option[optionLabel] }}</option>
    </select>


    `,
    providers: [SELECT_VALUE_ACCESSOR]
})
export class SelectControl implements ControlValueAccessor {

    @ViewChild('select') 
    selectElement: ElementRef;
    selectElementJQuery: any;

    @Input()
    value: any;

    @Input() 
    optionLabel: string = 'text';

    @Input() 
    optionValue: string = 'id';

    @Input() 
    set options(options) {  console.log('_options'); this._options = options; setTimeout(_ => this.buildControl(), 100); };
    get options(): any { return this._options; }
    _options: any;

    @Input() 
    name: string;

    @Input() 
    disabled: boolean;
    
    @Input() 
    tabindex: number;

    @Input() 
    inputId: string;
    
    @Input() 
    style: any;

    @Input() 
    styleClass: string;
    
    @Input() 
    formControl: FormControl;
    
    @Output() 
    onChange: EventEmitter<any> = new EventEmitter();
    
    onModelChange: Function = () => {};
    
    onModelTouched: Function = () => {};

    constructor(private cd: ChangeDetectorRef) {}

    ngAfterViewInit() {           
        this.selectElementJQuery = jQuery(this.selectElement.nativeElement);
    }

    buildControl() {
        this.selectElementJQuery.material_select('destroy');
        this.selectElementJQuery.material_select();

        this.selectElementJQuery.on('change', () => {
            let id = this.selectElementJQuery[0].value;
            let values = this.options.filter(c => c[this.optionValue] == id);
            this.value = values.length > 0 ? values[0] : null;

            this.updateModel();
        });
    }

    updateModel() {
        this.onModelChange(this.value);        
        this.onChange.emit(this.value);
    }
    
    handleChange(event) {
        let value = !this.options ? [] : this.options.filter(o => o.id == event.target.value);
        this.value = value.length > 0 ? value[0] : null;    
        this.updateModel();
    }

    onBlur(event) {
        this.onModelTouched();
    }
    
    writeValue(value: any) : void {
        this.value = value;
    }
    
    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }
    
    setDisabledState(val: boolean): void {
        this.disabled = val;
    }
}