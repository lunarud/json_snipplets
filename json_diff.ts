
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


const jsonPaths = generateJsonPaths(jsonObject);
console.log(jsonPaths);


