import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarItinerarioComponent } from './editar-itinerario.component';

describe('EditarItinerarioComponent', () => {
  let component: EditarItinerarioComponent;
  let fixture: ComponentFixture<EditarItinerarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarItinerarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarItinerarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
