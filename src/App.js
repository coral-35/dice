import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

function App() {
  // サイコロの目を保存するstate
  const [dice, setDice] = useState([1, 1]);
  // サイコロの合計履歴を保存するstate（2～12の各合計値の出現回数）
  const [history, setHistory] = useState({
    2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0
  });
  // 振った合計回数
  const [totalRolls, setTotalRolls] = useState(0);
  
  // サイコロを振る関数
  const rollDice = () => {
    // 1から6までのランダムな数字を生成
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    setDice([die1, die2]);
    
    // 合計を計算して履歴を更新
    const total = die1 + die2;
    setHistory(prevHistory => ({
      ...prevHistory,
      [total]: prevHistory[total] + 1
    }));
    
    // 合計回数を更新
    setTotalRolls(prev => prev + 1);
  };

  // サイコロの目の合計を計算
  const total = dice[0] + dice[1];

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

  return (
    <div className="app">
      <h1>サイコロアプリ</h1>
      
      <div className="dice-container">
        <Die value={dice[0]} />
        <Die value={dice[1]} />
      </div>
      
      <div className="total">
        合計: {total}
      </div>
      
      <button onClick={rollDice}>サイコロを振る</button>
      
      <div className="history-container">
        <h2>合計値の履歴（合計{totalRolls}回）</h2>
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
                {Object.keys(history).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>回数</td>
                {Object.keys(history).map(key => (
                  <td key={key}>{history[key]}</td>
                ))}
              </tr>
              <tr>
                <td>確率</td>
                {Object.keys(history).map(key => (
                  <td key={key}>
                    {totalRolls > 0 ? ((history[key] / totalRolls) * 100).toFixed(1) + '%' : '0%'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <style jsx>{`
        .app {
          text-align: center;
          font-family: sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          color: #333;
        }
        
        h2 {
          color: #555;
          margin-top: 30px;
        }
        
        .dice-container {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        
        .die {
          width: 80px;
          height: 80px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          margin: 0 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 32px;
          font-weight: bold;
        }
        
        .total {
          font-size: 24px;
          margin-bottom: 20px;
        }
        
        button {
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        
        button:hover {
          background-color: #45a049;
        }
        
        .history-container {
          margin-top: 40px;
        }
        
        .chart-container {
          margin-top: 20px;
          height: 350px;
          width: 100%;
        }
        
        .custom-tooltip {
          background-color: white;
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }
        
        .stats-table {
          margin-top: 30px;
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 14px;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        
        th {
          background-color: #f2f2f2;
        }
        
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}

export default App;