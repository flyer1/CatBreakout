import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { BaseType, Selection, select, event, mouse, ContainerElement } from 'd3-selection';
import { transition } from 'd3-transition';
import { interpolateZoom } from 'd3-interpolate';
import { ScaleSequential, scaleSequential } from 'd3-scale';
import { interpolateMagma } from 'd3-scale-chromatic';
import { nest } from 'd3-collection';
import { pack, hierarchy, HierarchyCircularNode } from 'd3-hierarchy';

import { SchoolService } from '../services/school.service';

@Component({
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CovidTrackerComponent implements OnInit {

  @ViewChild('tooltip', { static: true }) tooltip: ElementRef;

  /////////////////////////////////////////////////////////////////////////////////////////

  svg: Selection<BaseType, {}, HTMLElement, any>;
  g: Selection<BaseType, {}, HTMLElement, any>;
  node: Selection<any, unknown, any, {}>;

  packer: (data: any) => HierarchyCircularNode<unknown>;

  root: HierarchyCircularNode<unknown>;
  focus: HierarchyCircularNode<unknown>;
  view: [number, number, number];

  colorScale: ScaleSequential<string>;

  width: number;
  height: number;
  data: any;
  hierarchicalData: any;

  // On mouseover the activeNode is defined which later drives the tooltip content.
  activeNode: any;

  /////////////////////////////////////////////////////////////////////////////////////////
  constructor(private schoolService: SchoolService, private renderer: Renderer2) { }

  ngOnInit() {
    this.width = 700;
    this.height = 700;

    this.getData();
    this.createChart();
    this.initTooltip();
  }

  getData() {
    this.hierarchicalData = this.stratifyData();
    this.packer = this.createPackFunction();
    this.root = this.packer(this.hierarchicalData);
    this.focus = this.root;
    console.log({ hierarchicalData: this.hierarchicalData, root: this.root });
  }

  createChart() {
    this.colorScale = scaleSequential(interpolateMagma).domain([8, 0]);

    // this.width = +this.el.nativeElement.offsetWidth;
    this.createSvg();

    console.log(nest().key((d: any) => d.height).entries(this.root.descendants()));

    // Add some shadows
    // this.svg.append('filter')
    //   .attr('id', 'shadow')
    //   .append('feDropShadow')
    //   .attr('flood-opacity', 0.3)
    //   .attr('dx', 0)
    //   .attr('dy', 1);

    // Render the circles from the 4 levels of data (school/cohort/class/student)

    // Generate out the circles - we don't need to position or size them here b/c the zoom function always takes care of that.
    this.node = this.g
      .append('g')
      .selectAll('circle')
      .data(this.root.descendants())
      .join('circle')
      .attr('fill', d => d.children ? this.colorScale(d.height) : 'white')
      .attr('pointer-events', d => !d.children ? 'none' : null)
      .on('mouseover', (node: any, index, group) => {
        select(group[index]).attr('stroke', '#000');
        this.activeNode = node.data;
        console.log(node);

        // const [x, y] = mouse(group[index] as ContainerElement);

        // this.renderer.setStyle(this.tooltip.nativeElement, 'left', node.x + 350 + 'px');
        // this.renderer.setStyle(this.tooltip.nativeElement, 'top', node.y + 'px');
        this.renderer.setStyle(this.tooltip.nativeElement, 'display', 'block');
      })
      // .on('mouseenter', function (node, index, group) {
      // })
      .on('mouseout', function (node: any, index, group) {
        select(group[index]).attr('stroke', null);
      })
      .on('click', d => this.focus !== d && (this.zoom(d), event.stopPropagation()));

    const leaf = this.node.filter((d: any) => !d.children && d.data.data.relationships.length);

    leaf.attr('fill', 'red')
    console.log(leaf)
    // leaf.append('line')
    // this.node = this.g.
    //   selectAll('g')
    //   .data(nest().key((d: any) => d.height).entries(this.root.descendants()))
    //   .join('g')
    //   .attr('filter', `url('#shadow')`)
    //   .selectAll('g')
    //   .data((d: any) => d.values)
    //   .join('g')
    //   .attr('transform', (d: any) => `translate(${d.x + 1},${d.y + 1})`);

    // this.node.append('circle')
    //   .attr('r', (d: any) => d.r)
    //   .attr('fill', (d: any) => this.colorScale(d.height))
    //   .on('click', (d: any) => this.focus !== d && (this.zoom(d), event.stopPropagation()));

    // This gets a bit messy but we need to create a clipping path for ever circle that has text inside.
    // First make sure the id of each circle is the student's id (data.id)
    // const leaf = this.node.filter((d: any) => !d.children);

    // leaf.select('circle')
    //   .attr('id', (d: any) => 'circle-' + d.data.data.id);

    // // Next add a clipPath for every circle and point to the circle that will contain the text
    // leaf.append('clipPath')
    //   .attr('id', (d: any) => 'clip-' + d.data.data.id)
    //   .append('use')
    //   .attr('xlink:href', (d: any) => '#circle-' + d.data.data.id);

    // // Lastly add the text that will make use of the clipPath so we don't have text overflowing all over the place.
    // // So point at the clipPath which in turn knows the path to clip b/c it's referring to the circle. 
    // leaf.append('text')
    //   .attr('clip-path', (d: any) => 'url(#clip-' + d.data.data.id + ')')
    //   .attr('x', 0)
    //   .attr('y', 3)
    //   .text((d: any) => d.data.data.name);

    this.zoomTo([this.root.x, this.root.y, this.root.r * 2]);
  }

  createSvg() {
    this.svg = select(`.data-visualization`)
      .append('svg')
      .attr('class', 'chart')
      .style('font', '10px sans-serif')
      .attr('text-anchor', 'middle')
      // Make the svg responsive according to the parent container's size
      .attr('width', '100%')                               // 100% width means that the svg's width is driven by the container (div)
      .attr('height', this.height)                         // We start with a given height and scale it down in the resize later.
      .attr('preserveAspectRatio', 'xMidYMid meet')        // This is important for responsiveness
      // .attr('viewBox', `0 0 ${this.width} ${this.height}`) // This is important for responsiveness
      .attr('viewBox', `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`) // This is important for responsiveness
      .style('cursor', 'pointer')
      .style('background', 'white')
      .on('click', () => this.zoom(this.root));

    this.g = this.svg.append('g')
      .attr('class', 'main-group');
  }

  zoomTo(v: [number, number, number]) {
    const k = this.width / v[2];
    this.view = v;

    this.node.attr('transform', (d: any) => `translate(${(d.x - v[0]) * k}, ${(d.y - v[1]) * k})`);
    this.node.attr('r', (d: any) => d.r * k);
  }

  zoom(d: HierarchyCircularNode<unknown>) {
    const focus0 = this.focus;

    this.focus = d;

    const t = transition()
      .duration(750)
      .tween('zoom', (d: any) => {
        const i = interpolateZoom(this.view, [this.focus.x, this.focus.y, this.focus.r * 2]);
        return t2 => this.zoomTo(i(t2));
      });
  }

  // #region TOOLTIP
  initTooltip() {
    return;
    this.g.on('touchmove mousemove', _ => {
      // Get the x,y mouse position within the svg.
      const [x, y] = mouse(this.g.node() as ContainerElement);

      this.renderer.setStyle(this.tooltip.nativeElement, 'left', x + 'px');
      this.renderer.setStyle(this.tooltip.nativeElement, 'top', y + 'px');

      if (!this.activeNode) {
        this.renderer.setStyle(this.tooltip.nativeElement, 'display', 'none');
        return;
      }

      this.renderer.setStyle(this.tooltip.nativeElement, 'display', 'block');

    });
  }

  // #endregion

  // #region Data 

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

  // #endregion
}
