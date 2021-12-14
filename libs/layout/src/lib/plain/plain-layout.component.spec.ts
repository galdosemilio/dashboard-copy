import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { PlainLayout } from './plain-layout.component'

describe('PlainLayout', () => {
  let component: PlainLayout
  let fixture: ComponentFixture<PlainLayout>

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [PlainLayout]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainLayout)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
