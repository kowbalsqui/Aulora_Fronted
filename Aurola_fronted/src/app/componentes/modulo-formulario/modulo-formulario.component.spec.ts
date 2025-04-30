import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloFormularioComponent } from './modulo-formulario.component';

describe('ModuloFormularioComponent', () => {
  let component: ModuloFormularioComponent;
  let fixture: ComponentFixture<ModuloFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
