import { EventEmitter } from '@angular/core';
import { Size } from '../item';

export interface PanelComponent {
  data: any;
  resizeEmitter: EventEmitter<Size>;
  handleResize? (width: number, height: number): void; 
}

