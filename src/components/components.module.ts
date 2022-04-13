import { NgModule } from '@angular/core';
import { AddAmountComponent } from './add-amount/add-amount';
import { ColorGuidePopoverComponent } from './color-guide-popover/color-guide-popover';
import { IngredientsListPopoverComponent } from './ingredients-list-popover/ingredients-list-popover';
@NgModule({
	declarations: [AddAmountComponent,
    ColorGuidePopoverComponent,
    IngredientsListPopoverComponent],
	imports: [],
	exports: [AddAmountComponent,
    ColorGuidePopoverComponent,
    IngredientsListPopoverComponent]
})
export class ComponentsModule {}
