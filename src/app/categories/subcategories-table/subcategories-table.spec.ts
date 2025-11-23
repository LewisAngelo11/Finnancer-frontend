import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriesTable } from './subcategories-table';

describe('SubcategoriesTable', () => {
  let component: SubcategoriesTable;
  let fixture: ComponentFixture<SubcategoriesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoriesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcategoriesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
