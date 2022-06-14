import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SalesleadgerComponent } from "./salesleadger.component";

describe("BuyerComponent", () => {
  let component: SalesleadgerComponent;
  let fixture: ComponentFixture<SalesleadgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesleadgerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesleadgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
