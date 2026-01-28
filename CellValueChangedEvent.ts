import { Component } from '@angular/core';
import { GridApi, CellValueChangedEvent, ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-grid-example',
  template: '<ag-grid-angular ... [rowData]="rowData" [columnDefs]="columnDefs" (cellValueChanged)="onCellValueChanged($event)"></ag-grid-angular>',
})
export class GridExampleComponent {
  private gridApi!: GridApi;
  rowData: any[] = []; // Your tree data
  columnDefs: ColDef[] = [
    // Define columns, use aggFunc for automatic aggregation if desired
    { field: 'value', editable: true, aggFunc: 'sum' }, // Using aggFunc 'sum'
    // Other column definitions
  ];

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const childNode = event.node;
    
    // Check if the node has a parent (not the root level)
    if (childNode.parent) {
      // You can manually calculate and update the parent's data property
      // Or rely on ag-grid's automatic aggregation if you use `aggFunc` in column definitions.

      // Manual update method:
      const parentNode = childNode.parent;
      this.updateParentNodeValue(parentNode);
      
      // Refresh the parent row's cell to reflect the change in the UI
      this.gridApi.refreshCells({ rowNodes: [parentNode], force: true });
    }

    // Run any other specific Angular method/logic here
    this.yourAngularMethod();
  }

  updateParentNodeValue(parentNode: any): void {
    // Custom logic to recalculate the parent's value based on its children
    // For example: Summing a 'value' field from all children
    if (parentNode.childrenAfterGroup) {
      const sum = parentNode.childrenAfterGroup.reduce((acc: number, child: any) => acc + (child.data.value || 0), 0);
      parentNode.data.parentValue = sum; // Update the parent's underlying data
    }
  }

  yourAngularMethod(): void {
    console.log('Child node updated, custom Angular method called.');
    // Additional application logic
  }
}
