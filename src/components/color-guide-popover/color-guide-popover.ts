import { Component } from '@angular/core';

/**
 * Generated class for the ColorGuidePopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'color-guide-popover',
  templateUrl: 'color-guide-popover.html'
})
export class ColorGuidePopoverComponent {


  colorList: any;

  constructor() {

    this.colorList = [{

      name: 'Spirit',
      color: '#4286f4'

    },{

      name: 'Mixers',
      color: '#009999'

    }, {

      name: 'Sodas, Juice, Milk',
      color: '#00e68a'

    }]

  }

}
