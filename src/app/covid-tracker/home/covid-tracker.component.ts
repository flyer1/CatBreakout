import { Component, OnInit } from '@angular/core';
import { BaseType, Selection, select } from 'd3-selection';
import { ScaleSequential, scaleSequential } from 'd3-scale';
import { interpolateMagma } from 'd3-scale-chromatic';
import { nest } from 'd3-collection';

import { pack, hierarchy, HierarchyCircularNode } from 'd3-hierarchy';
import { SchoolService } from '../services/school.service';

@Component({
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.scss']
})
export class CovidTrackerComponent implements OnInit {

  svg: Selection<BaseType, {}, HTMLElement, any>;
  g: Selection<BaseType, {}, HTMLElement, any>;
  packer: (data: any) => HierarchyCircularNode<unknown>;
  root: HierarchyCircularNode<unknown>;
  colorScale: ScaleSequential<string>;

  width: number;
  height: number;
  data: any;
  hierarchicalData: any;

  //////////////////////////////////////////////////////
  constructor(private schoolService: SchoolService) { }

  ngOnInit() {
    this.width = 700;
    this.height = 700;

    this.getData();
    this.createChart();
  }

  getData() {
    this.hierarchicalData = this.stratifyData();
    this.packer = this.createPackFunction();
    this.root = this.packer(this.hierarchicalData);
    console.log({ hierarchicalData: this.hierarchicalData, root: this.root });
  }

  createChart() {
    // this.clearSvg();

    this.colorScale = scaleSequential(interpolateMagma).domain([8, 0]);

    // this.width = +this.el.nativeElement.offsetWidth;
    this.createSvg();

    console.log(nest().key((d: any) => d.height).entries(this.root.descendants()));

    const node = this.g.
      selectAll('g')
      .data(nest().key((d: any) => d.height).entries(this.root.descendants()))
      .join('g')
      // .attr('filter', shadow)
      .attr('class', 'test')
      .selectAll('g')
      .data((d: any) => d.values)
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x + 1},${d.y + 1})`);

    node.append('circle')
      .attr('r', (d: any) => d.r)
      .attr('fill', (d: any) => this.colorScale(d.height));

    // this.initChartFunctions();
    // this.renderChart();

    // this.resize();
  }

  createSvg() {
    this.svg = select(`.data-visualization`)
      .append('svg')
      .attr('class', 'chart')
      .style('font', '10px sans-serif')
      .attr('text-anchor', 'middle')
      // Make the svg responsive according to the parent container's size
      .attr('width', '100%')                              // 100% width means that the svg's width is driven by the container (div)
      .attr('height', this.height)                             // We start with a given height and scale it down in the resize later.
      .attr('preserveAspectRatio', 'xMidYMid meet')       // This is important for responsiveness
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);         // This is important for responsiveness

    this.g = this.svg.append('g')
      .attr('class', 'main-group');
    //   .attr('transform', `translate(${leftOffset}, ${topOffset})`);
  }

  initChartFunctions() {
    // scaleSequential([8,0], interpolateMagma)
    const packer = pack().size([this.width, this.height]).padding(3);
    const h = hierarchy
    // packer(h);

  }

  /** Return the function that takes in our raw data and returns back a hierarchical structure that has all of the information required to drive the visualization */
  createPackFunction() {
    return (sourceData: any) => pack()
      .size([this.width, this.height])
      .padding(3)
      (hierarchy(sourceData)
        .sum(d => d.value)
        .sort((a: any, b: any) => b.name - a.name));
  }



  renderChart() { }

  stratifyData() {
    const result = {
      name: 'school',
      data: this.schoolService.school,
      children: []
    }

    this.schoolService.school.cohorts.forEach(cohort => {
      result.children.push({
        name: 'cohorts',
        data: cohort,
        children: cohort.classes.map(cls => {
          return {
            name: 'class',
            data: cls,
            children: cls.students.map(student => {
              return {
                name: 'student',
                data: student,
                value: 1
              };
            })
          };
        })
      });
    });

    return result;
  }
}
