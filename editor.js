import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as joint from 'jointjs';

@Component({
  selector: 'app-workflow-editor',
  templateUrl: './workflow-editor.component.html',
  styleUrls: ['./workflow-editor.component.css'],
  encapsulation: ViewEncapsulation.None // Required for JointJS styles
})
export class WorkflowEditorComponent implements OnInit {
  private graph: joint.dia.Graph;
  private paper: joint.dia.Paper;
  private selectedElement: joint.dia.Element | null = null;

  ngOnInit(): void {
    // Initialize JointJS graph and paper
    this.graph = new joint.dia.Graph();

    this.paper = new joint.dia.Paper({
      el: document.getElementById('paper'),
      width: 800,
      height: 600,
      model: this.graph,
      gridSize: 10,
      drawGrid: true,
      background: { color: '#f8f9fa' },
      interactive: true
    });

    // Handle element selection
    this.paper.on('element:pointerclick', (elementView: joint.dia.ElementView) => {
      if (this.selectedElement) {
        this.selectedElement.attr('body/stroke', elementView.model.attributes.type === 'standard.Circle' ? '#28a745' : '#000');
      }
      this.selectedElement = elementView.model;
      this.selectedElement.attr('body/stroke', '#007bff'); // Highlight selected
    });

    // Handle canvas click to deselect
    this.paper.on('blank:pointerclick', () => {
      if (this.selectedElement) {
        this.selectedElement.attr('body/stroke', this.selectedElement.attributes.type === 'standard.Circle' ? '#28a745' : '#000');
        this.selectedElement = null;
      }
    });

    // Handle "Add" node click to insert a step
    this.paper.on('element:pointerclick', (elementView: joint.dia.ElementView) => {
      if (elementView.model.attributes.type === 'standard.Circle') {
        this.insertStepAtAddNode(elementView.model);
      }
    });

    // Enable dropping steps onto the canvas
    this.paper.$el.on('dragover', (event: JQuery.DragEventBase) => {
      event.preventDefault();
    });

    this.paper.$el.on('drop', (event: JQuery.DragEventBase) => {
      event.preventDefault();
      const originalEvent = event.originalEvent as DragEvent;
      const x = originalEvent.offsetX;
      const y = originalEvent.offsetY;
      this.addStep(x, y);
    });
  }

  // Handle drag start from palette
  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', 'step');
  }

  // Add a new step to the graph
  private addStep(x: number, y: number, insertAfter?: joint.dia.Element): void {
    const step = new joint.shapes.standard.Rectangle({
      position: { x, y },
      size: { width: 100, height: 50 },
      attrs: {
        body: {
          fill: '#e9ecef',
          stroke: '#000',
          strokeWidth: 2
        },
        label: {
          text: 'Step',
          fill: '#000'
        }
      }
    });

    this.graph.addCell(step);

    // If inserting after another step, manage links and "Add" nodes
    if (insertAfter) {
      const incomingLinks = this.graph.getLinks().filter(link => link.get('target').id === insertAfter.id);
      const outgoingLinks = this.graph.getLinks().filter(link => link.get('source').id === insertAfter.id);

      // Remove existing "Add" node after insertAfter
      const addNodeAfter = this.getAddNodeAfter(insertAfter);
      if (addNodeAfter) {
        addNodeAfter.remove();
      }

      // Create new links
      if (incomingLinks.length > 0) {
        incomingLinks.forEach(link => {
          link.set('target', { id: step.id });
        });
      }

      const linkToNext = new joint.shapes.standard.Link({
        source: { id: insertAfter.id },
        target: { id: step.id }
      });
      this.graph.addCell(linkToNext);

      if (outgoingLinks.length > 0) {
        const nextStep = this.graph.getCell(outgoingLinks[0].get('target').id);
        if (nextStep) {
          const linkToNextStep = new joint.shapes.standard.Link({
            source: { id: step.id },
            target: { id: nextStep.id }
          });
          this.graph.addCell(linkToNextStep);
        }
      }

      // Add new "Add" nodes
      this.addAddNodeAfter(insertAfter);
      this.addAddNodeAfter(step);
    } else {
      // If no insertAfter, check for selected element to link
      if (this.selectedElement && this.selectedElement.attributes.type === 'standard.Rectangle') {
        const addNodeAfter = this.getAddNodeAfter(this.selectedElement);
        if (addNodeAfter) {
          addNodeAfter.remove();
        }
        const link = new joint.shapes.standard.Link({
          source: { id: this.selectedElement.id },
          target: { id: непретив step.id }
        });
        this.graph.addCell(link);
        this.addAddNodeAfter(this.selectedElement);
        this.addAddNodeAfter(step);
      } else {
        this.addAddNodeAfter(step);
      }
    }
  }

  // Create an "Add" node after a step
  private addAddNodeAfter(step: joint.dia.Element): void {
    const stepPos = step.position();
    const stepSize = step.size();
    const addNode = new joint.shapes.standard.Circle({
      position: {
        x: stepPos.x + stepSize.width + 50,
        y: stepPos.y + stepSize.height / 2 - 15
      },
      size: { width: 30, height: 30 },
      attrs: {
        body: {
          fill: '#28a745',
          stroke: '#28a745',
          cursor: 'pointer'
        },
        label: {
          text: '+',
          fill: '#fff',
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      z: 10 // Ensure "Add" nodes are above other elements
    });

    // Store reference to the step for easier insertion logic
    addNode.set('parentStepId', step.id);
    this.graph.addCell(addNode);

    // Connect "Add" node to the next step if it exists
    const outgoingLinks = this.graph.getLinks().filter(link => link.get('source').id === step.id);
    if (outgoingLinks.length > 0) {
      const nextStep = this.graph.getCell(outgoingLinks[0].get('target').id);
      if (nextStep && nextStep.attributes.type === 'standard.Rectangle') {
        outgoingLinks[0].set('source', { id: addNode.id });
        const linkToNext = new joint.shapes.standard.Link({
          source: { id: step.id },
          target: { id: addNode.id }
        });
        this.graph.addCell(linkToNext);
      }
    }
  }

  // Get the "Add" node after a step
  private getAddNodeAfter(step: joint.dia.Element): joint.dia.Element | null {
    return this.graph.getCells().find(cell => 
      cell.attributes.type === 'standard.Circle' && 
      cell.get('parentStepId') === step.id
    ) || null;
  }

  // Insert a step when clicking an "Add" node
  private insertStepAtAddNode(addNode: joint.dia.Element): void {
    const parentStepId = addNode.get('parentStepId');
    const parentStep = this.graph.getCell(parentStepId);
    if (!parentStep) return;

    const parentPos = parentStep.position();
    const parentSize = parentStep.size();
    const newStepX = parentPos.x + parentSize.width + 100;
    const newStepY = parentPos.y;

    this.addStep(newStepX, newStepY, parentStep);
  }

  // Delete the selected step
  deleteSelected(): void {
    if (this.selectedElement && this.selectedElement.attributes.type === 'standard.Rectangle') {
      // Remove associated "Add" node
      const addNodeAfter = this.getAddNodeAfter(this.selectedElement);
      if (addNodeAfter) {
        addNodeAfter.remove();
      }

      // Reconnect previous and next steps
      const incomingLinks = this.graph.getLinks().filter(link => link.get('target').id === this.selectedElement!.id);
      const outgoingLinks = this.graph.getLinks().filter(link => link.get('source').id === this.selectedElement!.id);

      if (incomingLinks.length > 0 && outgoingLinks.length > 0) {
        const prevStep = this.graph.getCell(incomingLinks[0].get('source').id);
        const nextStep = this.graph.getCell(outgoingLinks[0].get('target').id);
        if (prevStep && nextStep && prevStep.attributes.type === 'standard.Rectangle') {
          const newLink = new joint.shapes.standard.Link({
            source: { id: prevStep.id },
            target: { id: nextStep.id }
          });
          this.graph.addCell(newLink);
          this.addAddNodeAfter(prevStep);
        }
      }

      this.selectedElement.remove();
      this.selectedElement = null;
    }
  }
}