import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import './App.css';

function App() {
  // サイコロの個数を管理するstate
  const [diceCount, setDiceCount] = useState(2);
  // サイコロの目を保存するstate（配列で複数のサイコロに対応）
  const [dice, setDice] = useState([1, 1]);
  // サイコロの合計履歴を保存するstate
  const [history, setHistory] = useState({});
  // 振った合計回数
  const [totalRolls, setTotalRolls] = useState(0);
  
  // 最小値と最大値を計算
  const minValue = diceCount;
  const maxValue = diceCount * 6;
  
  // サイコロの個数が変わったときに履歴を初期化
  useEffect(() => {
    initializeHistory();
    // サイコロ配列も更新
    setDice(Array(diceCount).fill(1));
  }, [diceCount]);
  
  // 履歴の初期化関数
  const initializeHistory = () => {
    const newHistory = {};
    for (let i = minValue; i <= maxValue; i++) {
      newHistory[i] = 0;
    }
    setHistory(newHistory);
    setTotalRolls(0);
  };
  
  // サイコロの個数を変更する関数
  const changeDiceCount = (count) => {
    if (count >= 1 && count <= 5) {
      setDiceCount(count);
    }
  };
  
  // サイコロを振る関数
  const rollDice = () => {
    // 各サイコロで1から6までのランダムな数字を生成
    const newDice = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
    setDice(newDice);
    
    // 合計を計算して履歴を更新
    const total = newDice.reduce((sum, value) => sum + value, 0);
    setHistory(prevHistory => ({
      ...prevHistory,
      [total]: (prevHistory[total] || 0) + 1
    }));
    
    // 合計回数を更新
    setTotalRolls(prev => prev + 1);
  };
  
  // 履歴をリセットする関数
  const resetStats = () => {
    initializeHistory();
  };

  // サイコロの目の合計を計算
  const total = dice.reduce((sum, value) => sum + value, 0);

  // 履歴データをグラフ用に整形
  const historyData = Object.keys(history).map(key => ({
    total: key,
    count: history[key]
  }));

  // サイコロの目を表示するコンポーネント
  const Die = ({ value }) => {
    return (
      <div className="die">
        {value}
      </div>
    );
  };

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalRolls > 0 ? ((data.count / totalRolls) * 100).toFixed(1) : 0;
      
      return (
        <div className="custom-tooltip">
          <p>合計値: {data.total}</p>
          <p>出現回数: {data.count}回</p>
          <p>割合: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // サイコロ数を調整するボタングループ
  const DiceCountSelector = () => {
    return (
      <div className="dice-selector">
        <h3>サイコロの個数</h3>
        <div className="selector-buttons">
          {[1, 2, 3, 4, 5].map((count) => (
            <button 
              key={count}
              className={`selector-button ${diceCount === count ? 'active' : ''}`}
              onClick={() => changeDiceCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <h1>サイコロシミュレーター</h1>
      
      <DiceCountSelector />
      
      <div className="dice-container">
        {dice.map((value, index) => (
          <Die key={index} value={value} />
        ))}
      </div>
      
      <div className="total">
        合計: {total}
      </div>
      
      <div className="controls">
        <button className="roll-button" onClick={rollDice}>サイコロを振る</button>
      </div>
      
      <div className="stats-summary">
        <div className="stats-box">
          <h3>総振り回数</h3>
          <div className="stats-value">{totalRolls}</div>
        </div>
      </div>
      
      <div className="history-container">
        <h2>合計値の履歴</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={historyData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="total" label={{ value: '合計値', position: 'insideBottomRight', offset: -10 }} />
              <YAxis label={{ value: '出現回数', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="回数" fill="#8884d8">
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="stats-table">
          <table>
            <thead>
              <tr>
                <th>合計値</th>
                {Object.keys(history).sort((a, b) => Number(a) - Number(b)).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>回数</td>
                {Object.keys(history).sort((a, b) => Number(a) - Number(b)).map(key => (
                  <td key={key}>{history[key]}</td>
                ))}
              </tr>
              <tr>
                <td>確率</td>
                {Object.keys(history).sort((a, b) => Number(a) - Number(b)).map(key => (
                  <td key={key}>
                    {totalRolls > 0 ? ((history[key] / totalRolls) * 100).toFixed(1) + '%' : '0%'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="reset-container">
          <button className="reset-button" onClick={resetStats}>統計リセット</button>
        </div>
      </div>
    </div>
  );
}

export default App;