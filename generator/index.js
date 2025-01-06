const fs = require('fs');
const config = require('./config.json');

config.forEach(item => {
  const { name, list } = item;
  let result = [];

  if (list.length !== 8) {
      console.log(['error length:', name].join('-'));
  }
  list.forEach(component => {
    const { row, column } = getNumbers(component);
    result = result.concat(generatorOthers(component, row, column));
  });

  fs.writeFile(
    `../component/${name}.json`,
    JSON.stringify(result),
    'utf8',
    (error) => {
      console.log(error);
    }
  );
});

function generatorOthers(data, row, column) {
  const result = [];
  let i = 0;

  while (i <= row) {
    const newRow = copyByRow(data, i);
    result.push(newRow);
    i++;

    let j = 1;
    while (j <= column) {
      result.push(copyByColumn(newRow, j));
      j++;
    }
  }

  return result;
}

function copyByRow(data, n) {
  const result = data.slice();
  while (n--) {
    const last = result.pop();
    result.unshift(last);
  }

  return result;
}

function copyByColumn(data, n) {
  let left = '';
  while (left.length < n) {
    left += '0';
  }
  return data.map(v => (left + v).slice(0, 6));
}

function getNumbers(data) {
    const rowLen = data.length;
    const columnLen = data[0].length;

    for(let i = 0; i < rowLen; i++) {
      const val = data[i];
      if (val.indexOf('1') > -1) {
        rowLen--;
      }
    }

    for(let j = 0; j < columnLen; j++) {
      const val = data.map(v => v.charAt(j));
      if (val.indexOf('1') > -1) {
        columnLen--;
      }
    }

    return {
        row: rowLen,
        column: columnLen
    }
}