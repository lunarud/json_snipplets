npm install jointjs lodash jquery backbone @types/lodash @types/jquery @types/backbone

// angular.json (Add jointjs to scripts)
{
  // ...
  "projects": {
    "your-app-name": {
      // ...
      "architect": {
        "build": {
          // ...
          "scripts": [
            "node_modules/lodash/lodash.min.js",
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/backbone/backbone-min.js",
            "node_modules/jointjs/dist/joint.min.js"
          ],
          // ...
        },
        // ...
      }
    }
  }
}

// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FlowchartComponent } from './flowchart/flowchart.component';

@NgModule({
  declarations: [
    AppComponent,
    FlowchartComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// flowchart.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as joint from 'jointjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-flowchart',
  template: '<div #placeholder></div>',
  styleUrls: ['./flowchart.component.css']
})
export class FlowchartComponent implements OnInit, AfterViewInit {
  @ViewChild('placeholder', { static: false }) placeholder: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.createFlowchart();
  }

  createFlowchart(): void {
    const graph = new joint.dia.Graph();

    const paper = new joint.dia.Paper({
      el: this.placeholder.nativeElement,
      model: graph,
      width: 800,
      height: 600,
      gridSize: 1,
      background: { color: 'rgba(0, 255, 0, 0.3)' }
    });

    const rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
      body: {
        fill: 'lightblue'
      },
      label: {
        text: 'Start',
        fill: 'black'
      }
    });

    const rect2 = new joint.shapes.standard.Rectangle();
    rect2.position(100, 150);
    rect2.resize(100, 40);
    rect2.attr({
      body: {
        fill: 'lightgreen'
      },
      label: {
        text: 'Process',
        fill: 'black'
      }
    });

    const circle = new joint.shapes.standard.Circle();
    circle.position(300, 100);
    circle.resize(50, 50);
    circle.attr({
      body: {
        fill: 'yellow'
      },
      label: {
        text: 'Decision',
        fill: 'black'
      }
    });

    const link = new joint.shapes.standard.Link();
    link.source(rect);
    link.target(circle);
    link.attr({
      line: {
        stroke: 'black',
        strokeWidth: 2
      }
    });

    const link2 = new joint.shapes.standard.Link();
    link2.source(circle);
    link2.target(rect2);
    link2.attr({
      line: {
        stroke: 'black',
        strokeWidth: 2
      }
    });

    graph.addCells([rect, rect2, circle, link, link2]);
  }
}

// flowchart.component.css
:host {
  display: block;
}

div {
  width: 800px;
  height: 600px;
}
