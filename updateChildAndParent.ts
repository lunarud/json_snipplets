// When setting child node data, traverse up to update parent
updateChildAndParent(childNode: IRowNode, childData: any): void {
  // Update child data
  childNode.setData(childData);
  
  // Traverse up and update parent's IsWarning
  let parentNode = childNode.parent;
  while (parentNode && parentNode.data) {
    parentNode.data.IsWarning = false;
    
    // Refresh the parent row to reflect changes
    this.gridApi.refreshCells({ rowNodes: [parentNode], force: true });
    
    parentNode = parentNode.parent;
  }
}

updateParentWarningStatus(childNode: IRowNode): void {
  const parentNode = childNode.parent;
  if (!parentNode?.data) return;

  // Check all siblings (children of parent)
  const allChildrenValid = parentNode.childrenAfterGroup?.every(
    (child: IRowNode) => !child.data?.IsWarning
  );

  if (allChildrenValid) {
    parentNode.data.IsWarning = false;
    this.gridApi.refreshCells({ rowNodes: [parentNode], force: true });
    
    // Recursively update grandparent
    this.updateParentWarningStatus(parentNode);
  }
}

// After applying a transaction update
onCellValueChanged(event: CellValueChangedEvent): void {
  if (event.colDef.field === 'someField') {
    this.updateParentWarningStatus(event.node);
  }
}

// In your component
gridOptions: GridOptions = {
  treeData: true,
  getDataPath: (data: any) => data.hierarchy,
  onRowDataUpdated: () => this.recalculateWarnings()
};

recalculateWarnings(): void {
  this.gridApi.forEachNode((node: IRowNode) => {
    if (node.group && node.childrenAfterGroup?.length) {
      const hasWarningChild = node.childrenAfterGroup.some(
        child => child.data?.IsWarning
      );
      node.data.IsWarning = hasWarningChild;
    }
  });
  this.gridApi.refreshCells({ force: true });
}


// When you set child data, immediately update parent
updateChildData(childNode: IRowNode, newData: any): void {
  // Update the child
  childNode.setData(newData);
  
  // Immediately set parent's IsWarning to false
  const parentNode = childNode.parent;
  if (parentNode?.data) {
    parentNode.data.IsWarning = false;
    this.gridApi.refreshCells({ rowNodes: [parentNode], force: true });
  }
}


onCellValueChanged(event: CellValueChangedEvent): void {
  const parentNode = event.node.parent;
  
  if (parentNode?.data && parentNode.data.IsWarning !== false) {
    parentNode.data.IsWarning = false;
    this.gridApi.refreshCells({ 
      rowNodes: [parentNode], 
      columns: ['IsWarning'],  // optional: refresh only this column
      force: true 
    });
  }
}



setParentWarningFalse(node: IRowNode): void {
  let parent = node.parent;
  
  while (parent?.data) {
    parent.data.IsWarning = false;
    this.gridApi.refreshCells({ rowNodes: [parent], force: true });
    parent = parent.parent;
  }
}

// Usage
onChildDataChanged(childNode: IRowNode): void {
  this.setParentWarningFalse(childNode);
}



