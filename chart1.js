import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as joint from 'jointjs';

@Component({
  selector: 'app-workflow-chart',
  templateUrl: './workflow-chart.component.html',
  styleUrls: ['./workflow-chart.component.scss']
})
export class WorkflowChartComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;

  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;

  ngAfterViewInit(): void {
    // Initialize the graph
    this.graph = new joint.dia.Graph();

    // Initialize the paper with interactivity enabled
    this.paper = new joint.dia.Paper({
      el: this.canvas.nativeElement,
      model: this.graph,
      width: 800,
      height: 400,
      gridSize: 10,
      drawGrid: true,
      interactive: true // Enable dragging and interaction
    });

    // Create the workflow chart
    this.createWorkflowChart();

    // Add click and hover event handlers
    this.setupEventHandlers();
  }

  private createWorkflowChart(): void {
    // Define shapes for the workflow steps
    const start = new joint.shapes.standard.Circle({
      position: { x: 50, y: 50 },
      size: { width: 60, height: 60 },
      attrs: {
        body: { fill: '#28a745', 'data-type': 'start' },
        label: { text: 'Start', fill: '#fff' }
      },
      id: 'start'
    });

    const step1 = new joint.shapes.standard.Rectangle({
      position: { x: 200, y: 50 },
      size: { width: 100, height: 60 },
      attrs: {
        body: { fill: '#007bff', 'data-type': 'step1' },
        label: { text: 'Step 1', fill: '#fff' }
      },
      id: 'step1'
    });

    const step2 = new joint.shapes.standard.Rectangle({
      position: { x: 350, y: 50 },
      size: { width: 100, height: 60 },
      attrs: {
        body: { fill: '#007bff', 'data-type': 'step2' },
        label: { text: 'Step 2', fill: '#fff' }
      },
      id: 'step2'
    });

    const end = new joint.shapes.standard.Circle({
      position: { x: 500, y: 50 },
      size: { width: 60, height: 60 },
      attrs: {
        body: { fill: '#dc3545', 'data-type': 'end' },
        label: { text: 'End', fill: '#fff' }
      },
      id: 'end'
    });

    // Define links between steps
    const link1 = new joint.shapes.standard.Link({
      source: { id: start.id },
      target: { id: step1.id },
      attrs: {
        '.connection': { stroke: '#333', 'stroke-width': 2 },
        '.marker-target': { fill: '#333', d: 'M 10 0 L 0 5 L 10 10 z' }
      },
      id: 'link1'
    });

    const link2 = new joint.shapes.standard.Link({
      source: { id: step1.id },
      target: { id: step2.id },
      attrs: {
        '.connection': { stroke: '#333', 'stroke-width': 2 },
        '.marker-target': { fill: '#333', d: 'M 10 0 L 0 5 L 10 10 z' }
      },
      id: 'link2'
    });

    const link3 = new joint.shapes.standard.Link({
      source: { id: step2.id },
      target: { id: end.id },
      attrs: {
        '.connection': { stroke: '#333', 'stroke-width': 2 },
        '.marker-target': { fill: '#333', d: 'M 10 0 L 0 5 L 10 10 z' }
      },
      id: 'link3'
    });

    // Add elements and links to the graph
    this.graph.addCells([start, step1, step2, end, link1, link2, link3]);
  }

  private setupEventHandlers(): void {
    // Handle element clicks (nodes)
    this.paper.on('element:pointerclick', (elementView: joint.dia.ElementView) => {
      const element = elementView.model;
      const type = element.attr('body/data-type');
      alert(`Clicked on ${type} (ID: ${element.id})`);
      console.log('Element clicked:', element.attributes);
    });

    // Handle link clicks
    this.paper.on('link:pointerclick', (linkView: joint.dia.LinkView) => {
      const link = linkView.model;
      alert(`Clicked on link (ID: ${link.id}) from ${link.get('source').id} to ${link.get('target').id}`);
      console.log('Link clicked:', link.attributes);
    });

    // Handle hover effects for elements
    this.paper.on('element:mouseenter', (elementView: joint.dia.ElementView) => {
      elementView.model.attr('body/stroke', '#ffd700'); // Yellow border on hover
      elementView.model.attr('body/strokeWidth', 3);
    });

    this.paper.on('element:mouseleave', (elementView: joint.dia.ElementView) => {
      elementView.model.attr('body/stroke', null); // Remove border
      elementView.model.attr('body/strokeWidth', null);
    });

    // Handle hover effects for links
    this.paper.on('link:mouseenter', (linkView: joint.dia.LinkView) => {
      linkView.model.attr('.connection/stroke', '#ffd700'); // Yellow link on hover
      linkView.model.attr('.connection/stroke-width', 4);
    });

    this.paper.on('link:mouseleave', (linkView: joint.dia.LinkView) => {
      linkView.model.attr('.connection/stroke', '#333'); // Reset link color
      linkView.model.attr('.connection/stroke-width', 2);
    });
  }
}