flowchartCode: string = `st=>start: Start
op1=>operation: Check Inventory
op2=>operation: Check Test1
op3=>operation: Check Test2
e=>end: End

st->op1->op2->op3->e`;


private onNodeClick(nodeId: string, nodeLabel: string): void {
  let message = '';
  switch (nodeId) {
    case 'node_op1':
      message = `Inventory check initiated: ${nodeLabel}`;
      break;
    case 'node_op2':
      message = `Test 1 performed: ${nodeLabel}`;
      break;
    case 'node_op3':
      message = `Test 2 performed: ${nodeLabel}`;
      break;
    default:
      message = `Clicked node: ${nodeLabel} (ID: ${nodeId})`;
  }
  alert(message);
  console.log(message);
}
