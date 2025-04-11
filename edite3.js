<div class="workflow-editor">
  <!-- Palette for dragging steps -->
  <div class="palette">
    <h3>Palette</h3>
    <div class="step" draggable="true" (dragstart)="onDragStart($event)">Step</div>
  </div>

  <!-- Diagram canvas -->
  <div class="canvas">
    <div id="paper" style="width: 800px; height: 600px; border: 1px solid #ccc;"></div>
  </div>

  <!-- Controls -->
  <div class="controls">
    <button (click)="deleteSelected()">Delete Selected Step</button>
  </div>
</div>