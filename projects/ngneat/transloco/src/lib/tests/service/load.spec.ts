import { fakeAsync } from '@angular/core/testing';
import { filter, pluck } from 'rxjs/operators';
import { createService, runLoader } from '../transloco.mocks';
import { loadLang } from './utils';

describe('load', () => {
  let service;

  beforeEach(() => (service = createService()));

  it('should trigger loaded event once loaded', fakeAsync(() => {
    const spy = jasmine.createSpy();
    service.events$
      .pipe(
        filter((e: any) => e.type === 'translationLoadSuccess'),
        pluck('payload')
      )
      .subscribe(spy);
    loadLang(service);
    expect(spy).toHaveBeenCalledWith({ lang: 'en', langName: 'en', scope: null });
  }));

  it('should trigger loaded event once loaded - scope', fakeAsync(() => {
    const spy = jasmine.createSpy();
    service.events$
      .pipe(
        filter((e: any) => e.type === 'translationLoadSuccess'),
        pluck('payload')
      )
      .subscribe(spy);
    loadLang(service, 'admin-page/en');
    expect(spy).toHaveBeenCalledWith({ lang: 'admin-page/en', langName: 'en', scope: 'admin-page' });
  }));

  it('should load the translation using the loader', fakeAsync(() => {
    spyOn((service as any).loader, 'getTranslation').and.callThrough();
    service.load('en').subscribe();
    runLoader();
    expect((service as any).loader.getTranslation).toHaveBeenCalledWith('en', { scope: null });
    expect((service as any).translations.size).toEqual(1);
  }));

  it('should load the translation from cache', fakeAsync(() => {
    loadLang(service);
    spyOn((service as any).loader, 'getTranslation').and.callThrough();
    service.load('en');
    expect((service as any).loader.getTranslation).not.toHaveBeenCalled();
  }));
});
