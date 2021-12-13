import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';

import {
  setInferenceDownloadUrl,
  clearInferenceDownloadUrl,
} from '../../actions';
import { renderSubmitButton } from '../../utils';

class DownloadForm extends React.Component {
  state = {
    haltPytorch: false,
    haltOnnx: false,
  };

  downloadFile = async url => {
    const response = await fetch(url);
    const blob = await response.blob();
    let objectUrl = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = objectUrl;
    a.download = url.split('/').at(-1);
    a.click();
  };

  onDownloadClick = format => {
    this.props.setInferenceDownloadUrl({ token: this.props.token, format });
  };

  componentDidUpdate = async () => {
    if (this.props.downloadUrlPytorch && !this.state.haltPytorch) {
      this.setState({ haltPytorch: true });
      await this.downloadFile(this.props.downloadUrlPytorch);
      this.props.clearInferenceDownloadUrl('pytorch');
      this.setState({ haltPytorch: false });
    }

    if (this.props.downloadUrlOnnx && !this.state.haltOnnx) {
      this.setState({ haltOnnx: true });
      await this.downloadFile(this.props.downloadUrlOnnx);
      this.props.clearInferenceDownloadUrl('onnx');
      this.setState({ haltOnnx: false });
    }
  };

  render() {
    return (
      <Row className="mb-5">
        <Col xs={6} className="text-right">
          {renderSubmitButton({
            loading: this.props.downloadUrlPytorch,
            originalText: 'Download as PyTorch',
            loadingText: 'Downloading...',
            btnColor: 'dark',
            size: 'sm',
            onClick: () => this.onDownloadClick('pytorch'),
          })}
        </Col>
        <Col xs={6} className="text-left">
          {renderSubmitButton({
            loading: this.props.downloadUrlOnnx,
            originalText: 'Download as ONNX',
            loadingText: 'Downloading...',
            btnColor: 'dark',
            size: 'sm',
            onClick: () => this.onDownloadClick('onnx'),
          })}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({
  inference: { token, downloadUrlPytorch, downloadUrlOnnx },
}) => {
  return { token, downloadUrlPytorch, downloadUrlOnnx };
};

export default connect(mapStateToProps, {
  setInferenceDownloadUrl,
  clearInferenceDownloadUrl,
})(DownloadForm);
