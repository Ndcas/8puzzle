import React from 'react';
import '../styles/header.css'; 

const CTU_LOGO = 'https://www.ctu.edu.vn/images/upload/logo.png';

const CICT_LOGO = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSml8Rxo3MX3HSecqWuczzz-GTkuFazmL356A&s';

function Header() {
  return (
    <header className="header">

      <div className="header-top">

        <div className="header-identity">
          <span className="header-univ">Đại học Cần Thơ</span>
          <span className="header-school"> Trường Công nghệ Thông tin &amp; Truyền thông </span>
          <span className="header-dept">Khoa Công nghệ Phần mềm</span>
        </div>

        <div className="header-logos">
          <img
            src={CTU_LOGO}
            alt="Logo Đại học Cần Thơ"
            className="header-logo-img logo-ctu"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="logo-divider" />

          <img
            src={CICT_LOGO}
            alt="Logo Trường CNTT & TT – Đại học Cần Thơ"
            className="header-logo-img logo-cit"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>

      <div className="header-divider" />

      <div className="header-title-band">
        <h1>8 Puzzle Search Algorithm Visualizer</h1>
        <p className="header-subtitle">Trực quan hóa giải thuật tìm kiếm</p>
      </div>

      <div className="header-accent-bar" />

    </header>
  );
}

export default Header;