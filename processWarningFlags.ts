// Model interface
interface RowData {
  id: string;
  parentId: string | null;
  name: string;
  isWarning: boolean;
  // other properties...
}

// Process flattened data to set parent warnings
processWarningFlags(flattenedData: RowData[]): RowData[] {
  // First, find all IDs that are parents (have at least one child)
  const parentIds = new Set<string>(
    flattenedData
      .filter(row => row.parentId != null)
      .map(row => row.parentId!)
  );

  // Update isWarning based on whether the node has children
  return flattenedData.map(row => ({
    ...row,
    isWarning: !parentIds.has(row.id)  // false if parent, true if leaf
  }));
}




// Component
loadData() {
  this.dataService.getTreeData().subscribe(data => {
    // Process warning flags before setting to grid
    this.rowData = this.processWarningFlags(data);
    
    // If grid is already initialized
    if (this.gridApi) {
      this.gridApi.setRowData(this.rowData);
    }
  });
}

onGridReady(params: GridReadyEvent) {
  this.gridApi = params.api;
  
  if (this.rowData?.length) {
    this.gridApi.setRowData(this.rowData);
  }
}

Alternative using a single reduce for better performance with large datasets:
typescriptprocessWarningFlags(flattenedData: RowData[]): RowData[] {
  // Single pass to collect parent IDs
  const parentIds = flattenedData.reduce((acc, row) => {
    if (row.parentId) {
      acc.add(row.parentId);
    }
    return acc;
  }, new Set<string>());

  // Update rows
  return flattenedData.map(row => ({
    ...row,
    isWarning: !parentIds.has(row.id)
  }));
}



