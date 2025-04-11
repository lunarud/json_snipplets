<div class="flowchart-container">
  <h2>Interactive Flowchart Demo</h2>
  <div class="input-section">
    <textarea
      [(ngModel)]="flowchartCode"
      (input)="updateFlowchart()"
      placeholder="Enter flowchart code here..."
      rows="10"
      cols="50"
    ></textarea>
  </div>
  <div class="chart-section">
    <div id="flowchart-canvas"></div>
  </div>
</div>

.flowchart-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.input-section {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  font-family: monospace;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chart-section {
  border: 1px solid #e0e0e0;
  padding: 10px;
  min-height: 400px;
}

#flowchart-canvas {
  width: 100%;
  height: 400px;
}



import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as flowchart from 'flowchart.js';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css'],
})
export class FlowchartComponent implements OnInit, AfterViewInit {
  flowchartCode: string = `st=>start: Start|past:>http://www.google.com[blank]
  e=>end: End|future:>http://www.google.com
  op1=>operation: My Operation|past
  op2=>operation: Stuff|current
  sub1=>subroutine: My Subroutine|invalid
  cond=>condition: Yes or No?|approved:>http://www.google.com
  io=>inputoutput: catch something...|future

  st->op1(right)->cond
  cond(yes, right)->io->e
  cond(no)->op2->e`;

  private chart: any;

  ngOnInit(): void {
    // Ensure Raphaël is available globally
    if (!(window as any).Raphael) {
      (window as any).Raphael = require('raphael');
    }
  }

  ngAfterViewInit(): void {
    this.renderFlowchart();
  }

  updateFlowchart(): void {
    this.renderFlowchart();
  }

  private renderFlowchart(): void {
    try {
      // Clear previous chart
      const canvas = document.getElementById('flowchart-canvas');
      if (canvas) {
        canvas.innerHTML = '';
      }

      // Parse and draw the flowchart
      if (this.flowchartCode.trim()) {
        this.chart = flowchart.parse(this.flowchartCode);
        this.chart.drawSVG('flowchart-canvas', {
          'line-width': 2,
          'line-length': 50,
          'text-margin': 10,
          'font-size': 14,
          'font-color': 'black',
          'line-color': 'black',
          'element-color': 'black',
          'fill': '#f0f0f0',
          'yes-text': 'Yes',
          'no-text': 'No',
          'arrow-end': 'block',
          'scale': 1,
        });
      }
    } catch (error) {
      console.error('Error rendering flowchart:', error);
    }
  }
}


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlowchartComponent } from './flowchart/flowchart.component';

@NgModule({
  declarations: [AppComponent, FlowchartComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}



import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import * as flowchart from 'flowchart.js';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css'],
})
export class FlowchartComponent implements OnInit, AfterViewInit, OnDestroy {
  flowchartCode: string = `st=>start: Start|past:>http://www.google.com[blank]
  e=>end: End|future:>http://www.google.com
  op1=>operation: My Operation|past
  op2=>operation: Stuff|current
  sub1=>subroutine: My Subroutine|invalid
  cond=>condition: Yes or No?|approved:>http://www.google.com
  io=>inputoutput: catch something...|future

  st->op1(right)->cond
  cond(yes, right)->io->e
  cond(no)->op2->e`;

  private chart: any;
  private nodeClickHandlers: Map<string, (event: MouseEvent) => void> = new Map();

  ngOnInit(): void {
    // Ensure Raphaël is available globally
    if (!(window as any).Raphael) {
      (window as any).Raphael = require('raphael');
    }
  }

  ngAfterViewInit(): void {
    this.renderFlowchart();
  }

  ngOnDestroy(): void {
    this.cleanupEventListeners();
  }

  updateFlowchart(): void {
    this.renderFlowchart();
  }

  private renderFlowchart(): void {
    try {
      // Clear previous chart and event listeners
      const canvas = document.getElementById('flowchart-canvas');
      if (canvas) {
        canvas.innerHTML = '';
      }
      this.cleanupEventListeners();

      // Parse and draw the flowchart
      if (this.flowchartCode.trim()) {
        this.chart = flowchart.parse(this.flowchartCode);
        this.chart.drawSVG('flowchart-canvas', {
          'line-width': 2,
          'line-length': 50,
          'text-margin': 10,
          'font-size': 14,
          'font-color': 'black',
          'line-color': 'black',
          'element-color': 'black',
          'fill': '#f0f0f0',
          'yes-text': 'Yes',
          'no-text': 'No',
          'arrow-end': 'block',
          'scale': 1,
        });

        // Add click event listeners to nodes
        this.addNodeClickListeners();
      }
    } catch (error) {
      console.error('Error rendering flowchart:', error);
    }
  }

  private addNodeClickListeners(): void {
    // Select all node elements (SVG <g> elements with class 'node')
    const nodes = document.querySelectorAll('#flowchart-canvas .node');
    nodes.forEach((node) => {
      // Get the node ID from the 'id' attribute
      const nodeId = node.getAttribute('id') || 'unknown';
      // Get the label from the text element within the node
      const labelElement = node.querySelector('text');
      const nodeLabel = labelElement ? labelElement.textContent : nodeId;

      // Create a unique handler for this node
      const handler = (event: MouseEvent) => {
        this.onNodeClick(nodeId, nodeLabel || 'Unnamed Node');
        event.stopPropagation(); // Prevent event bubbling
      };

      // Store the handler for cleanup
      this.nodeClickHandlers.set(nodeId, handler);

      // Attach the event listener
      node.addEventListener('click', handler);

      // Optional: Add hover effect via CSS class
      node.classList.add('clickable');
    });
  }

  private cleanupEventListeners(): void {
    // Remove all existing event listeners
    this.nodeClickHandlers.forEach((handler, nodeId) => {
      const node = document.getElementById(nodeId);
      if (node) {
        node.removeEventListener('click', handler);
      }
    });
    this.nodeClickHandlers.clear();
  }

  private onNodeClick(nodeId: string, nodeLabel: string): void {
    // Custom action when a node is clicked
    alert(`Clicked node: ${nodeLabel} (ID: ${nodeId})`);
    console.log(`Node clicked - ID: ${nodeId}, Label: ${nodeLabel}`);
    // You can replace the alert with any custom logic, e.g., opening a modal, updating state, etc.
  }
}


.flowchart-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.input-section {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  font-family: monospace;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chart-section {
  border: 1px solid #e0e0e0;
  padding: 10px;
  min-height: 400px;
}

#flowchart-canvas {
  width: 100%;
  height: 400px;
}

/* Add hover effect for clickable nodes */
.clickable {
  cursor: pointer;
}

.clickable:hover rect,
.clickable:hover circle,
.clickable:hover path {
  fill: #d0e7ff !important; /* Lighter fill on hover */
  transition: fill 0.2s;
}



<div class="click-log">
  <h3>Clicked Nodes</h3>
  <ul>
    <li *ngFor="let click of clickHistory">{{ click }}</li>
  </ul>
</div>


.click-log {
  margin-top: 20px;
}
.click-log ul {
  list-style: none;
  padding: 0;
}
.click-log li {
  padding: 5px 0;
}


clickHistory: string[] = [];

private onNodeClick(nodeId: string, nodeLabel: string): void {
  const message = `Clicked node: ${nodeLabel} (ID: ${nodeId}) at ${new Date().toLocaleTimeString()}`;
  this.clickHistory.push(message);
  console.log(message);
}


selectedNode: { id: string; label: string } | null = null;

private onNodeClick(nodeId: string, nodeLabel: string): void {
  this.selectedNode = { id: nodeId, label: nodeLabel };
}


import { Router } from '@angular/router';

constructor(private router: Router) {}

private onNodeClick(nodeId: string, nodeLabel: string): void {
  this.router.navigate(['/node-details', nodeId], { state: { label: nodeLabel } });
}
