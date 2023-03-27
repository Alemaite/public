import { Component } from '@angular/core';

@Component({
  selector: 'new-row',
  styleUrls: ['./admin.component.css'],
  template: `
    <tr class="mat-row">
      <td class="mat-cell">
        <mat-form-field>
          <input matInput placeholder="" value="" />
        </mat-form-field>
      </td>
      <td class="mat-cell">
        <mat-form-field class="unit">
          <input matInput placeholder="" value="" />
        </mat-form-field>
      </td>
      <td class="mat-cell">
        <mat-form-field class="name">
          <input matInput placeholder="" value="" />
        </mat-form-field>
      </td>
    </tr>
  `,
})
export class TableRowComponent {
  constructor() {}
}
