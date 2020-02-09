import { EventManager } from '@angular/platform-browser';
import { Injectable, EventEmitter } from '@angular/core';
import { fromEvent, Subscription, Observable, of, from, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators'

@Injectable()
export class WindowEventService {

  public onResize$ = new EventEmitter<{ width: number; height: number; }>();
  public onResizeEnd$ = new EventEmitter<{ width: number; height: number; }>();

  private subscription: Subscription;
  private subject: Subject<any> = new Subject<any>();

  constructor(eventManager: EventManager) {
    eventManager.addGlobalEventListener('window', 'resize',
      e => {
        this.onResize$.emit({
          width: e.target.innerWidth,
          height: e.target.innerHeight
        })
        this.subject.next({
          width: e.target.innerWidth,
          height: e.target.innerHeight
        });
      });

    const terms$ = this.subject.pipe(
      map(e => e.width),
      debounceTime(1000)
    );

    this.subscription = terms$
      .subscribe(
        w => {
          this.onResizeEnd$.emit();
        }

      );
  }


}