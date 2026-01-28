// Datasource with parent update on lazy load
createServerSideDatasource(): IServerSideDatasource {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
      this.dataService.getData(params.request).subscribe({
        next: (response) => {
          const processedData = response.data.map(row => ({
            ...row,
            isWarning: !row.hierarchyRow.nextLevel
          }));

          // Update parent node when children are loaded
          if (params.parentNode?.data) {
            this.updateParentWarning(params.parentNode);
          }

          params.success({
            rowData: processedData,
            rowCount: response.totalCount
          });
        },
        error: () => params.fail()
      });
    }
  };
}

// Update parent node's isWarning flag
updateParentWarning(parentNode: IRowNode): void {
  if (parentNode.data) {
    parentNode.data.isWarning = false;
    
    // Refresh the parent row to reflect changes
    this.gridApi.refreshCells({
      rowNodes: [parentNode],
      force: true
    });
  }
}




// Grid options
gridOptions: GridOptions = {
  onRowGroupOpened: (event: RowGroupOpenedEvent) => this.onRowGroupOpened(event),
  // other options...
};

onRowGroupOpened(event: RowGroupOpenedEvent): void {
  // Only update when expanding (not collapsing)
  if (event.expanded && event.node.data) {
    event.node.data.isWarning = false;
    
    this.gridApi.refreshCells({
      rowNodes: [event.node],
      force: true
    });
  }
}


// Datasource
createServerSideDatasource(): IServerSideDatasource {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
      this.dataService.getData(params.request).subscribe({
        next: (response) => {
          const processedData = response.data.map(row => ({
            ...row,
            isWarning: !row.hierarchyRow.nextLevel
          }));

          params.success({
            rowData: processedData,
            rowCount: response.totalCount
          });

          // Update parent after success
          if (params.parentNode?.data) {
            params.parentNode.data.isWarning = false;
            this.gridApi.refreshCells({
              rowNodes: [params.parentNode],
              force: true
            });
          }
        },
        error: () => params.fail()
      });
    }
  };
}

