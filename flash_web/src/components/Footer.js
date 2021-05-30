import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import '../styles/Footer.css';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.developerSocialMedia = [
      { title: 'Website', url: 'https://www.shantanuacharya.com/' },
      {
        title: 'GitHub',
        url: 'https://github.com/shan18',
      },
      {
        title: 'LinkedIn',
        url: 'https://www.linkedin.com/in/shanacharya/',
      },
      {
        title: 'Instagram',
        url: 'https://www.instagram.com/shan_1.0/',
      },
    ];
  }

  renderFooterBrand = () => {
    return (
      <Col
        xs={12}
        md={3}
        className={`text-center ${
          this.props.isMobile ? 'mb-5 mt-3' : 'my-auto'
        }`}
      >
        <Image
          src={`${process.env.PUBLIC_URL}/flash.svg`}
          style={{ height: '5vh' }}
          alt="flash logo"
        />
        <span style={{ fontSize: '2rem' }}>F L A S H</span>
      </Col>
    );
  };

  renderNavItem({ name, id, type }) {
    if (type === 'external') {
      return (
        <Nav.Link
          href={id}
          target="_blank"
          style={{ color: 'white' }}
          key={name}
        >
          {name}
        </Nav.Link>
      );
    }

    return (
      <Nav.Link
        as={Link}
        to={`/${id}`}
        onClick={() => window.scrollTo(0, 0)}
        style={{ color: 'white' }}
        key={id}
      >
        {name}
      </Nav.Link>
    );
  }

  renderNavColumn({ title, items }) {
    return (
      <Col
        xs={12}
        md={2}
        className={this.props.isMobile ? 'mb-5 text-center' : ''}
        key={title}
      >
        <Nav className="flex-column" variant="dark">
          <Nav.Link disabled className="mb-1" style={{ color: 'white' }}>
            <b>{title}</b>
          </Nav.Link>
          {items.map(item => this.renderNavItem(item))}
        </Nav>
      </Col>
    );
  }

  renderNavColums() {
    return [
      {
        title: 'LINKS',
        items: [
          {
            name: 'Code',
            id: 'https://github.com/shan18/Flash',
            type: 'external',
          },
          {
            name: 'Social',
            id: 'https://www.linkedin.com/posts/shanacharya_deeplearning-ai-machinelearning-activity-6756135082655936512-BYV6',
            type: 'external',
          },
        ],
      },
      {
        title: 'FLASH',
        items: this.props.navigationLinks,
      },
      {
        title: 'DEVELOPER',
        items: this.developerSocialMedia.map(({ title, url }) => {
          return { name: title, id: url, type: 'external' };
        }),
      },
    ].map(column => this.renderNavColumn(column));
  }

  render() {
    return (
      <>
        {this.props.isHome ? (
          ''
        ) : (
          <footer className="mt-5">
            <Container>
              <Row>
                {this.renderFooterBrand()}
                <Col />
                {this.props.navigationLinks ? this.renderNavColums() : ''}
              </Row>
            </Container>

            <Container fluid>
              <hr
                className="text-muted"
                style={{ border: '1px solid white', opacity: '0.2' }}
              />
            </Container>

            <Container>
              <Row>
                <Col className="text-center">
                  <p className="text-muted">
                    © 2021 Flash - All Rights Reserved.
                  </p>
                </Col>
              </Row>
            </Container>
          </footer>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ isHome, navigationLinks, isMobile }) => {
  return { isHome, navigationLinks, isMobile };
};

export default connect(mapStateToProps)(Footer);
