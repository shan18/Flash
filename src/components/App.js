import React from 'react';

import Footer from './Footer';

import '../styles/App.css';

class App extends React.Component {
  render() {
    return (
      <div className="page-container">
        <div className="content-wrap">
          <h1 className="heading">Lobe Clone</h1>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
