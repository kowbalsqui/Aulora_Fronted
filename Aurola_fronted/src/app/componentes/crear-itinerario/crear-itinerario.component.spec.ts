import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearItinerarioComponent } from './crear-itinerario.component';

describe('CrearItinerarioComponent', () => {
  let component: CrearItinerarioComponent;
  let fixture: ComponentFixture<CrearItinerarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearItinerarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearItinerarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
