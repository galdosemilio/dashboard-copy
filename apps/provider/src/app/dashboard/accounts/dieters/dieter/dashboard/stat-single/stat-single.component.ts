import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ccr-stat-single',
  templateUrl: './stat-single.component.html',
  styleUrls: ['./stat-single.component.scss']
})
export class StatSingleComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() isEditable: boolean;

  @Input() title: string;
  @Input() value: number;

  @Output() edit = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onClick() {
    if (this.isEditable) {
      this.edit.emit();
    }
  }
}
