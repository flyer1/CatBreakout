import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseType, Selection, select } from 'd3-selection';
import { ScaleSequential, scaleSequential, scaleLinear } from 'd3-scale';
import { interpolateMagma, interpolateGnBu, interpolateYlGn, interpolateSinebow, interpolateOrRd, interpolateBuPu, interpolateInferno, interpolateCubehelixDefault, interpolateRainbow } from 'd3-scale-chromatic';
import { nest } from 'd3-collection';
import { interpolateHcl } from 'd3-interpolate';

import { pack, hierarchy, HierarchyCircularNode } from 'd3-hierarchy';
import { SchoolService } from '../services/school.service';

@Component({
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.scss'],
  encapsulation: ViewEncapsulation.None
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
    // this.colorScale = scaleLinear()
    //   .domain([0, 5])
    //   .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    //   .interpolate(interpolateHcl)
    // this.colorScale = scaleSequential(interpolateRainbow).domain([5, 0]);

    // this.width = +this.el.nativeElement.offsetWidth;
    this.createSvg();

    console.log(nest().key((d: any) => d.height).entries(this.root.descendants()));

    // Add some shadows
    this.svg.append('filter')
      .attr('id', 'shadow')
      .append('feDropShadow')
      .attr('flood-opacity', 0.3)
      .attr('dx', 0)
      .attr('dy', 1);

    // Render the circles from the 4 levels of data (school/cohort/class/student)
    const node = this.g.
      selectAll('g')
      .data(nest().key((d: any) => d.height).entries(this.root.descendants()))
      .join('g')
      .attr('filter', `url('#shadow')`)
      .attr('class', 'test')
      .selectAll('g')
      .data((d: any) => d.values)
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x + 1},${d.y + 1})`);

    node.append('circle')
      .attr('r', (d: any) => d.r)
      .attr('fill', (d: any) => this.colorScale(d.height));


    // This gets a bit messy but we need to create a clipping path for ever circle that has text inside.
    // First make sure the id of each circle is the student's id (data.id)
    const leaf = node.filter((d: any) => !d.children);

    leaf.select('circle')
      .attr('id', (d: any) => 'circle-' + d.data.data.id);

    // Next add a clipPath for every circle and point to the circle that will contain the text
    leaf.append('clipPath')
      .attr('id', (d: any) => 'clip-' + d.data.data.id)
      .append('use')
      .attr('xlink:href', (d: any) => '#circle-' + d.data.data.id);

    // Lastly add the text that will make use of the clipPath so we don't have text overflowing all over the place.
    // So point at the clipPath which in turn knows the path to clip b/c it's referring to the circle. 
    leaf.append('text')
      .attr('clip-path', (d: any) => 'url(#clip-' + d.data.data.id + ')')
      .attr('x', 0)
      .attr('y', 3)
      .text((d: any) => d.data.data.name);
      
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

  /** Return the function that takes in our raw data and returns back a hierarchical structure that has all of the information required to drive the visualization */
  createPackFunction() {
    return (sourceData: any) => pack()
      .size([this.width, this.height])
      .padding(3)
      (hierarchy(sourceData)
        .sum(d => d.value)
        .sort((a: any, b: any) => b.name - a.name));
  }

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
