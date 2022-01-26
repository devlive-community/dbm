import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[watchDom]'
})
export class DomChangedDirective implements OnInit {
  constructor(private elRef: ElementRef) {
  }

  ngOnInit() {
    this.registerDomChangedEvent(this.elRef.nativeElement);
  }

  registerDomChangedEvent(el) {
    const observer = new MutationObserver(list => {
      const evt =
        new CustomEvent('dom-changed', {detail: list, bubbles: true});
      el.dispatchEvent(evt);
    });
    const attributes = true;
    const childList = true;
    const subtree = true;
    observer.observe(el, {attributes, childList, subtree});
  }
}
