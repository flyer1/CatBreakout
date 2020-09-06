import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { SchoolService } from '../services/school.service';
import { SchoolOptions, School } from '../models/school.model';

@Component({
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CovidTrackerComponent implements OnInit {

  @ViewChild('tooltip', { static: true }) tooltip: ElementRef;

  /////////////////////////////////////////////////////////////////////////////////////////

  data: any;
  form: FormGroup;

  /////////////////////////////////////////////////////////////////////////////////////////

  get formValue(): SchoolOptions { return this.form.value; }

  /////////////////////////////////////////////////////////////////////////////////////////
  constructor(private schoolService: SchoolService, private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.getData();
  }

  initForm() {
    const options = School.resetSchool();

    this.form = this.fb.group({
      totalStudents: options.totalStudents,
      cohortSize: options.cohortSize,
      classSize: options.classSize,

      relationshipCounts: this.fb.group({
        siblings: options.relationshipCounts.siblings,
        daycare: options.relationshipCounts.daycare,
        extraCurricular: options.relationshipCounts.extraCurricular,
        friend: options.relationshipCounts.friend,
      })
    });
  }

  getData() {
    this.data = this.stratifyData();
  }

  /** Put the data into a nested structure that can later be passed to D3's hierarchy() */
  stratifyData() {
    const result = {
      name: 'school',
      school: this.schoolService.school,
      children: []
    }

    this.schoolService.school.cohorts.forEach(cohort => {
      result.children.push({
        name: 'cohorts',
        cohort: cohort,
        children: cohort.classes.map(cls => {
          return {
            name: 'class',
            cls: cls,
            children: cls.students.map(student => {
              return {
                name: 'student',
                student: student,
                value: 1
              };
            })
          };
        })
      });
    });

    return result;
  }

  generateSchool() {
    this.schoolService.init(this.formValue);
    this.getData();
  }
}
