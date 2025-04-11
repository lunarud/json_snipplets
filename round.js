import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as joint from 'jointjs';

@Component({
  selector: 'app-root',
  template: `
    <div #canvas></div>
  `,
  styles: [`
    #canvas {
      width: 100%;
      height: 400px;
      border: 1px solid #ccc;
    }
  `]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;

  ngAfterViewInit(): void {
    // Define the custom rounded rectangle shape
    joint.dia.Element.define('custom.RoundedRect', {
      attrs: {
        rect: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2,
          rx: 10, // Horizontal radius for rounded corners
          ry: 10, // Vertical radius for rounded corners
          width: 'calc(w)', // Bind to element width
          height: 'calc(h)' // Bind to element height
        },
        text: {
          text: 'Rounded Rect',
          fill: '#333333',
          fontSize: 14,
          textAnchor: 'middle',
          x: 'calc(0.5*w)', // Center text horizontally
          y: 'calc(0.5*h)', // Center text vertically
          textVerticalAnchor: 'middle'
        }
      }
    }, {
      markup: [
        {
          tagName: 'rect',
          selector: 'rect'
        },
        {
          tagName: 'text',
          selector: 'text'
        }
      ]
    });

    // Initialize graph and paper
    const graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
    const paper = new joint.dia.Paper({
      el: this.canvas.nativeElement,
      model: graph,
      width: 600,
      height: 400,
      gridSize: 1,
      cellViewNamespace: joint.shapes,
      background: { color: '#f8f9fa' }
    });

    // Create an instance of the rounded rectangle
    const roundedRect = new joint.shapes.custom.RoundedRect({
      position: { x: 100, y: 100 },
      size: { width: 150, height: 80 },
      attrs: {
        rect: { fill: '#e3f2fd' },
        text: { text: 'My Rounded Rect' }
      }
    });

    // Add to graph
    graph.addCell(roundedRect);
  }
}