interface FlatTreeNode {
  name: string;
  level: number;
  expandable: boolean;
}


import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

interface FlatTreeNode {
  name: string;
  level: number;
  expandable: boolean;
}

function generateJsonPaths(obj: any, currentPath: string = '$'): string[] {
  let paths: string[] = [];

  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newPath = `${currentPath}.${key}`;
        paths = paths.concat(generateJsonPaths(obj[key], newPath));
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const newPath = `${currentPath}[${index}]`;
      paths = paths.concat(generateJsonPaths(item, newPath));
    });
  } else {
    paths.push(currentPath);
  }

  return paths;
}

function convertFlatTreeDataToJson(flatData: FlatTreeNode[]): any {
  const result: any = {};
  flatData.forEach((node, index) => {
    const path = node.level === 0 ? node.name : `[${index}]${node.name}`;
    result[path] = { level: node.level, expandable: node.expandable };
  });
  return result;
}

function compareFlatTreeDataSources(
  dataSource1: MatTreeFlatDataSource<FlatTreeNode, FlatTreeNode>,
  dataSource2: MatTreeFlatDataSource<FlatTreeNode, FlatTreeNode>
): string[] {
  const jsonData1 = convertFlatTreeDataToJson(dataSource1.data);
  const jsonData2 = convertFlatTreeDataToJson(dataSource2.data);

  const paths1 = generateJsonPaths(jsonData1);
  const paths2 = generateJsonPaths(jsonData2);

  const allPaths = new Set([...paths1, ...paths2]);
  const differences: string[] = [];

  allPaths.forEach(path => {
    const value1 = getValueAtJsonPath(jsonData1, path);
    const value2 = getValueAtJsonPath(jsonData2, path);

    if (value1 !== value2) {
      differences.push(`${path} differs: ${JSON.stringify(value1)} vs ${JSON.stringify(value2)}`);
    }
  });

  return differences;
}

function getValueAtJsonPath(obj: any, path: string): any {
  const pathParts = path.replace(/\$/g, '').split('.').reduce((acc: string[], part: string) => {
    const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      acc.push(arrayMatch[1]);
      acc.push(arrayMatch[2]);
    } else {
      acc.push(part);
    }
    return acc;
  }, []);

  return pathParts.reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

// Example usage
const TREE_DATA_1: FlatTreeNode[] = [
  { name: 'Parent 1', level: 0, expandable: true },
  { name: 'Child 1.1', level: 1, expandable: false },
  { name: 'Child 1.2', level: 1, expandable: false },
  { name: 'Parent 2', level: 0, expandable: true },
  { name: 'Child 2.1', level: 1, expandable: false }
];

const TREE_DATA_2: FlatTreeNode[] = [
  { name: 'Parent 1', level: 0, expandable: true },
  { name: 'Child 1.1', level: 1, expandable: false },
  { name: 'Child 1.3', level: 1, expandable: false },
  { name: 'Parent 3', level: 0, expandable: true },
  { name: 'Child 3.1', level: 1, expandable: false }
];

const treeControl1 = new FlatTreeControl<FlatTreeNode>(
  node => node.level,
  node => node.expandable
);

const treeFlattener1 = new MatTreeFlattener(
  node => node,
  node => node.level,
  node => node.expandable,
  node => node.children
);

const dataSource1 = new MatTreeFlatDataSource(treeControl1, treeFlattener1);
dataSource1.data = TREE_DATA_1;

const treeControl2 = new FlatTreeControl<FlatTreeNode>(
  node => node.level,
  node => node.expandable
);

const treeFlattener2 = new MatTreeFlattener(
  node => node,
  node => node.level,
  node => node.expandable,
  node => node.children
);

const dataSource2 = new MatTreeFlatDataSource(treeControl2, treeFlattener2);
dataSource2.data = TREE_DATA_2;

const differences = compareFlatTreeDataSources(dataSource1, dataSource2);
console.log(differences);
