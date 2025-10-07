import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasDashboard } from './categorias-dashboard';

describe('CategoriasDashboard', () => {
  let component: CategoriasDashboard;
  let fixture: ComponentFixture<CategoriasDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
