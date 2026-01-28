// Model interface
interface RowData {
  id: string;
  parentId: string | null;
  name: string;
  isWarning: boolean;
  // other properties...
}

// Service or component method to update parent warning status
updateParentWarningStatus(flattenedData: RowData[], childId: string): RowData[] {
  const childNode = flattenedData.find(row => row.id === childId);
  if (!childNode || !childNode.parentId) return flattenedData;

  return flattenedData.map(row => {
    if (row.id === childNode.parentId) {
      return { ...row, isWarning: false };
    }
    return row;
  });
}

// If you need to traverse up the entire hierarchy
updateAllAncestorWarnings(flattenedData: RowData[], childId: string): RowData[] {
  const updatedData = [...flattenedData];
  let currentNode = updatedData.find(row => row.id === childId);

  while (currentNode?.parentId) {
    const parentIndex = updatedData.findIndex(row => row.id === currentNode!.parentId);
    if (parentIndex !== -1) {
      updatedData[parentIndex] = { ...updatedData[parentIndex], isWarning: false };
      currentNode = updatedData[parentIndex];
    } else {
      break;
    }
  }

  return updatedData;
}

// In your component, after updating the data:
this.rowData = this.updateParentWarningStatus(this.rowData, childNodeId);
this.gridApi.setRowData(this.rowData);

// Or use transactions for better performance:
this.gridApi.applyTransaction({ update: [updatedParentRow] });


For ag-Grid tree data with getDataPath:


// Component
onCellValueChanged(event: CellValueChangedEvent) {
  if (/* your condition to clear parent warning */) {
    this.clearParentWarning(event.data);
  }
}

clearParentWarning(childData: RowData) {
  const parentId = childData.parentId;
  const parentRow = this.rowData.find(r => r.id === parentId);
  
  if (parentRow) {
    parentRow.isWarning = false;
    this.gridApi.applyTransaction({ update: [parentRow] });
    // Refresh the row to update styling if needed
    this.gridApi.refreshCells({ rowNodes: [this.gridApi.getRowNode(parentId)!] });
  }
}

// Column definitions or grid options
rowClassRules: {
  'warning-row': (params) => params.data?.isWarning === true
}
