import React from 'react';

import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer mt-5 py-3">
      <div className="container">
        <div className="row">
          <div className="col-6 text-left">
            <img
              src={`${process.env.PUBLIC_URL}/lobe.png`}
              style={{ height: '2rem' }}
              alt="logo"
            />
            <span className="text-muted ml-3">Lobe Clone</span>
          </div>
          <div className="col-6 text-right">
            <span className="text-muted mr-3">
              <a
                className="anchor-black"
                rel="noreferrer"
                href="https://github.com/shan18/"
                target="_blank"
              >
                GitHub
              </a>
            </span>
            <img
              src={`${process.env.PUBLIC_URL}/github_logo.png`}
              style={{ height: '1.5rem' }}
              alt="github"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
