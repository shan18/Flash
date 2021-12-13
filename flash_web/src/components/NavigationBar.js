import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setNavLinks } from '../actions';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.navItems = [
      { name: 'Training', id: 'training' },
      { name: 'Inference', id: 'inference' },
      { name: 'Playground', id: 'playground' },
      { name: 'About', id: 'about' },
    ];

    this.state = {
      expanded: false,
    };
  }

  toggleNavbar = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  closeNavbar = () => {
    this.setState({ expanded: false });
  };

  componentDidMount() {
    this.props.setNavLinks(this.navItems);
  }

  renderNavItem({ name, id }) {
    return (
      <Nav.Link
        as={Link}
        className={
          this.props.history.location.pathname.substring(1) === id
            ? 'active'
            : ''
        }
        to={`/${id}`}
        onClick={this.closeNavbar}
        key={id}
      >
        {name}
      </Nav.Link>
    );
  }

  render() {
    return (
      <Navbar
        expand="md"
        variant="dark"
        expanded={this.state.expanded}
        fixed={this.props.isHome ? 'top' : ''}
        style={{ backgroundColor: 'black' }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={this.closeNavbar}>
            <Image
              src={`${process.env.PUBLIC_URL}/flash.svg`}
              style={{ height: '2rem' }}
              className="mr-2"
              alt="flash logo"
            />{' '}
            F L A S H
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="navbar-navigation"
            onClick={this.toggleNavbar}
          />
          <Navbar.Collapse id="navbar-navigation">
            <Nav className="ml-auto">
              {this.navItems.map(item => this.renderNavItem(item))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

const mapStateToProps = ({ isHome }) => {
  return { isHome };
};

export default connect(mapStateToProps, { setNavLinks })(
  withRouter(NavigationBar)
);
