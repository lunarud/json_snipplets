// Transform function
setWarningFlags<T extends { hierarchyRow: { nextLevel: any } }>(data: T[]): (T & { isWarning: boolean })[] {
  return data.map(row => ({
    ...row,
    isWarning: !row.hierarchyRow.nextLevel
  }));
}

// Usage in datasource
const processedData = this.setWarningFlags(response.data);




// In your datasource getRows
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
        },
        error: () => params.fail()
      });
    }
  };
}
