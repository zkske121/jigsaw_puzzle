const fs = require('fs');
const Month = require('./date/month.json');
const Day = require('./date/day.json');
const Week = require('./date/week.json');
const a = require('./component/a.json');
const b = require('./component/b.json');
const c = require('./component/c.json');
const d = require('./component/d.json');
const e = require('./component/e.json');
const f = require('./component/f.json');
const g = require('./component/g.json');
const h = require('./component/h.json');
const i = require('./component/i.json');
const param = process.argv[2];
const date = param ? new Date(param) : new Date();
const target = getTarget(date);
const COMPONENT_LIST = [a, b, c, d, e, f, g, h, i]
  .map(list => list.filter(v => filterByData(v, target)))
  .sort((a, b) => a.length - b.length);
const cIndexList = new Array(COMPONENT_LIST.length).fill(0);

console.time();
getAllResult();
console.timeEnd();

function getTarget(date) {
  const month = date.getMonth();
  const day = date.getDate() - 1;
  const week = date.getDay();

  return mergeComponent(Month[month], Week[week], Day[day]);
}

function getAllResult() {
  const tmpResultList = [];
  const resultList = [];
  let cIndex = 0;
  let back = false;

  while(cIndex < cIndexList.length) {
    if (back) {
      back = false;
      resetIndexList(cIndex);
      cIndexList[cIndex] = cIndexList[cIndex] + 1;
    }
    let result = tmpResultList[cIndex - 1] || target;
    const currentComponentList = COMPONENT_LIST[cIndex];
    const filterComponentList = currentComponentList.filter(v => filterByData(v, result));
    const currentIndex = cIndexList[cIndex];

    if (filterComponentList.length === 0 || currentIndex >= filterComponentList.length) {
      back = true;
      cIndex--;
      continue;
    }

    tmpResultList[cIndex] = mergeComponent(result, filterComponentList[currentIndex]);
    resultList[cIndex] = filterComponentList[currentIndex];
    cIndex++;
  }
  writeResultFile(resultList);
}

function writeResultFile(resultList) {
  const fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  console.log("find " + fileName + " success!");
  fs.writeFile(
    `./result/${fileName}.json`,
    JSON.stringify(resultList),
    'utf8',
    error => {
      console.log(error);
    }
  );
}

function resetIndexList(index) {
  for(let i = 0; i < cIndexList.length; i++) {
    if (i > index) {
      cIndexList[i] = 0;
    }
  }
}

function merge(a, b) {
  let result = '';
  for(let i = 0; i < a.length; i++) {
    result += a.charAt(i) | b.charAt(i);
  }

  return result;
}

function mergeComponent(source, ...list) {
  return source.map((row, rowIndex) => {
    return list.reduce((result, next) => merge(result, next[rowIndex]), row);
  });
}

function filterByData(data, target) {
  let result = true;

  data.forEach((v, x) => {
    for (let y = 0; y < v.length; y++) {
      if (v.charAt(y) === '1' && target[x].charAt(y) === '1') {
        result = false;
        return;
      }
    }
  });

  return result;
}
