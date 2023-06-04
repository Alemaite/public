import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DropdownService {
  dropdownActive = new Subject<boolean>();
}
