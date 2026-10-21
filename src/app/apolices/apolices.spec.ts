import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Apolices } from './apolices';

describe('Apolices', () => {
  let component: Apolices;
  let fixture: ComponentFixture<Apolices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Apolices],
    }).compileComponents();

    fixture = TestBed.createComponent(Apolices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
