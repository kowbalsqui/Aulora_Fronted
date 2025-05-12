import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerariosDetalleComponent } from './itinerarios-detalle.component';

describe('ItinerariosDetalleComponent', () => {
  let component: ItinerariosDetalleComponent;
  let fixture: ComponentFixture<ItinerariosDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItinerariosDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItinerariosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
