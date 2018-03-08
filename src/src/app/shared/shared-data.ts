import * as moment from 'moment';

export class SharedData {

    public static userLogged: {
      uid?: string,
      displayName?: string,
      email?: string,
      photoURL?: string,
    } = {};

    public static version = 'v.1.0.4';
    public static month =  moment().month() + 1;
    public static year = moment().year();
    public static  yearMonth() { return this.year + '-' + (this.month < 10 ? '0' + this.month : this.month); }

    public static  months = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];

      public static nextMonth(qtt: number = 1) {
        this.month += qtt;
        if (this.month > 12) {
          this.month = this.month - 12;
          this.year++;
        }
      }
    
      public static prevMonth(qtt: number = 1) {
        this.month -= qtt;
        if (this.month < 1) {
          this.month = this.month + 12;
          this.year--;
        }
      } 
}