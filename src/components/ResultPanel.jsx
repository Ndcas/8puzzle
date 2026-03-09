import React from 'react';
import '../styles/result.css';

function ResultPanel() {
  return (
    <div className="result-panel">
      <h2>Kết quả thuật toán</h2>
      <p><strong>Tên thuật toán</strong><span>IDS</span></p>
      <p><strong>Độ sâu</strong><span>3</span></p>
      <p><strong>Số nút mở rộng</strong><span>25</span></p>
      <p><strong>Thời gian thực thi</strong><span>0.01s</span></p>
    </div>
  );
}

export default ResultPanel;