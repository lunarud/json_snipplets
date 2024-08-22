
// Example usage
const jsonObject = {"firstName": "John",
  "lastName": "doe",
  "age": 26,
  "address": {
    "streetAddress": "naist street",
    "city": "Nara",
    "postalCode": "630-0192"
  },
  "phoneNumbers": [
    {
      "type": "iPhone",
      "number": "0123-4567-8888"
    },
    {
      "type": "home",
      "number": "0123-4567-8910"
    }
  ]
};
 
// Example usage
const jsonObjectCompare = {"firstName": "John",
  "lastName": "doe",
  "age": 26,
  "address": {
    "streetAddress": "naist street",
    "city": "Nara",
    "postalCode": "630-0192"
  },
  "phoneNumbers": [
    {
      "type": "iPhone",
      "number": "0123-4567-8888"
    },
    {
      "type": "home",
      "number": "0123-4567-8910"
    }
  ]
};
 
 const jsonPaths = generateJsonPaths(jsonObjectCompare);
 console.log(jsonPaths);  
 const result = JSONPath({wrap: false, path:'$.address.streetAddress', json:jsonObject}); 
 console.log("result:" + result); 

} 

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

function compareJsonObjects(obj1: any, obj2: any): string[] {
  const paths1 = generateJsonPaths(obj1);
  const paths2 = generateJsonPaths(obj2);

  const allPaths = new Set([...paths1, ...paths2]);
  const differences: string[] = [];

  allPaths.forEach(path => {
    const value1 = getValueAtJsonPath(obj1, path);
    const value2 = getValueAtJsonPath(obj2, path);

    if (value1 !== value2) {
      differences.push(`${path} differs: ${JSON.stringify(value1)} vs ${JSON.stringify(value2)}`);
    }
  });

  return differences;
}
