import { Link } from 'react-router-dom';
import { Container, Button } from 'react-floating-action-button';
import { IoHelpSharp } from 'react-icons/io5';

const FloatinHelp = props => {
  return (
    <Container>
      <Link
        to={{
          pathname: '/about',
          state: { targetSection: props.target },
        }}
      >
        <Button
          tooltip="Help"
          styles={{ backgroundColor: '#000000', color: '#ffffff' }}
        >
          <IoHelpSharp size={25} />
        </Button>
      </Link>
    </Container>
  );
};

export default FloatinHelp;
