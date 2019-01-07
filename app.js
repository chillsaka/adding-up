'use strict';
// Node.jsに用意されたモジュールの呼び出し
// fs ファイル操作のモジュール
const fs = require('fs');
// ファイルを一行ずつ読みためのモジュール
const readline = require('readline');

// popu-pref.csvファイルからファイルの読み込みを行うStremを生成
const rs = fs.ReadStream('./popu-pref.csv');
// readlineオブジェクトのinputとして設定し、rlオブジェクトを作成
const rl = readline.createInterface({ 'input': rs, 'output': {}});

// kew: 都道府県 value: 集計データのオブジェクト
const map = new Map();
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefectore = columns[2];
  const popu = parseInt(columns[7]);
  if (year == 2010 || year === 2015) {
    let value = map.get(prefectore);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 += popu;
    }
    if (year === 2015) {
      value.popu15 += popu;
    }
    map.set(prefectore, value);
  }
});
rl.resume();
rl.on('close', () => {
  for (let pair of map) {
    const value = pair[1];
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(map).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].chanfe;
  });
  const rankingStrings = rankingArray.map((pair) => {
    return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
  }) 
  console.log(rankingStrings);
});