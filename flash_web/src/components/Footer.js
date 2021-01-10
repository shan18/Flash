import React from 'react';
import { connect } from 'react-redux';

import '../styles/Footer.css';

const Footer = props => {
  return (
    <>
      {props.isHome ? (
        ''
      ) : (
        <footer className="footer py-3 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-6 text-left">
                <img
                  src={`${process.env.PUBLIC_URL}/flash.svg`}
                  style={{ height: '2rem' }}
                  alt="logo"
                />
                <span className="text-muted ml-3">Flash</span>
              </div>
              <div className="col-6 text-right">
                <span className="text-muted mr-3">
                  <a
                    className="anchor-black"
                    rel="noreferrer"
                    href="https://github.com/shan18/Flash"
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
      )}
    </>
  );
};

const mapStateToProps = ({ isHome }) => {
  return { isHome };
};

export default connect(mapStateToProps)(Footer);
