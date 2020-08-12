import { Component, OnInit } from '@angular/core';
import { BaseType, Selection, select } from 'd3-selection';
import { scaleSequential } from 'd3-scale';
import { interpolateMagma } from 'd3-scale-chromatic';
import { pack, hierarchy, HierarchyCircularNode } from 'd3-hierarchy';

@Component({
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.scss']
})
export class CovidTrackerComponent implements OnInit {

  svg: Selection<BaseType, {}, HTMLElement, any>;
  g: Selection<BaseType, {}, HTMLElement, any>;
  packer: (data: any) => HierarchyCircularNode<unknown>;
  root: HierarchyCircularNode<unknown>;

  width: number;
  height: number;
  data: any;

  //////////////////////////////////////////////////////
  constructor() { }

  ngOnInit() {
    // this.createChart();
  }

  /*
  createChart() {
    // this.clearSvg();

    // this.width = +this.el.nativeElement.offsetWidth;
    this.createSvg();

    this.packer = this.createPackFunction();
    this.root = this.packer(this.data);

    this.initChartFunctions();
    this.renderChart();

    // this.resize();
  }

  createSvg() {
    const width = 300;
    const height = 300;

    this.svg = select(`.data-visualization`)
      .append('svg')
      .attr('class', 'chart')
      // Make the svg responsive according to the parent container's size
      .attr('width', '100%')                              // 100% width means that the svg's width is driven by the container (div)
      .attr('height', height)                             // We start with a given height and scale it down in the resize later.
      .attr('preserveAspectRatio', 'xMidYMid meet')       // This is important for responsiveness
      .attr('viewBox', `0 0 ${width} ${height}`);         // This is important for responsiveness

    this.g = this.svg.append('g')
      .attr('class', 'main-group');
    //   .attr('transform', `translate(${leftOffset}, ${topOffset})`);
  }

  initChartFunctions() {
    // scaleSequential([8,0], interpolateMagma)
    const packer = pack().size([this.width, this.height]).padding(3);
    const h = hierarchy
    packer(h);

  }

  */ 

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

}
