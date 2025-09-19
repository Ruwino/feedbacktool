import { Component, Inject, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import {TestModel} from "../../../TestOverview/models/testModel";

@Component({
  selector: 'app-test-column',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './test-column.component.html',
  styleUrls: ['./test-column.component.css'],
})
export class TestColumnComponent {
  @Input() test!: TestModel[];
}
