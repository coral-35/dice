import React, { useState } from 'react';

function App() {
  // サイコロの目を保存するstate
  const [dice, setDice] = useState([1, 1]);
  
  // サイコロを振る関数
  const rollDice = () => {
    // 1から6までのランダムな数字を生成
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    setDice([die1, die2]);
  };

  // サイコロの目の合計を計算
  const total = dice[0] + dice[1];

  // サイコロの目を表示するコンポーネント
  const Die = ({ value }) => {
    return (
      <div className="die">
        {value}
      </div>
    );
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
      
      <style jsx>{`
        .app {
          text-align: center;
          font-family: sans-serif;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          color: #333;
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
      `}</style>
    </div>
  );
}

export default App;