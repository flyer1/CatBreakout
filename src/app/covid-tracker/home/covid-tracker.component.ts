import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { SchoolService } from '../services/school.service';

@Component({
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CovidTrackerComponent implements OnInit {

  @ViewChild('tooltip', { static: true }) tooltip: ElementRef;

  /////////////////////////////////////////////////////////////////////////////////////////

  data: any;

  /////////////////////////////////////////////////////////////////////////////////////////
  constructor(private schoolService: SchoolService) { }

  ngOnInit() {
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

  generateSchool() { }
}
