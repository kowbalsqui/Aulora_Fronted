import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloDetalleComponent } from './modulo-detalle.component';

describe('ModuloDetalleComponent', () => {
  let component: ModuloDetalleComponent;
  let fixture: ComponentFixture<ModuloDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
