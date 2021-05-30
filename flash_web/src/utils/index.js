import _ from 'lodash';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

export const renderLoadingPage = loadingText => {
  return (
    <Row>
      <Col className="text-center">
        <h4 className="heading">{loadingText}</h4>
      </Col>
      <Col className="text-center">
        <Spinner animation="grow" size="md" role="status" />
      </Col>
    </Row>
  );
};

export const convertFileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const removeFileBase64Header = image => {
  return image.replace('data:', '').replace(/^.+,/, '');
};

/* Form utility functions */

const setErrorClass = ({ touched, error }) => {
  return `${touched && error ? 'is-invalid' : ''}`;
};

export const renderError = ({ error, touched }) => {
  if (touched && error) {
    return <div className="invalid-feedback">{error}</div>;
  }
};

export const renderTextInput = ({
  input,
  label,
  type,
  placeholder,
  textAppend,
  enableAppendSumbit,
  readOnly,
  meta,
}) => {
  return (
    <>
      {label ? <Form.Label>{label}</Form.Label> : ''}
      <InputGroup className={setErrorClass(meta)}>
        <Form.Control
          {...input}
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          readOnly={readOnly}
        />
        {textAppend ? (
          <div className="input-group-append">
            {enableAppendSumbit ? (
              <Button type="submit" variant="danger">
                {textAppend}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="danger"
                onClick={event => event.preventDefault}
              >
                {textAppend}
              </Button>
            )}
          </div>
        ) : (
          ''
        )}
      </InputGroup>
      {renderError(meta)}
    </>
  );
};

export const renderTextInputGroup = ({
  input,
  label,
  type,
  placeholder,
  textAppend,
  enableAppendSumbit,
  readOnly,
  formGroupClassName,
  meta,
}) => {
  return (
    <Form.Group className={formGroupClassName}>
      {renderTextInput({
        input,
        label,
        type,
        placeholder,
        textAppend,
        enableAppendSumbit,
        readOnly,
        meta,
      })}
    </Form.Group>
  );
};

export const renderDropdownInputGroup = ({
  input,
  label,
  options,
  formGroupClassName,
  meta,
}) => {
  return (
    <Form.Group className={formGroupClassName}>
      {label ? <Form.Label>{label}</Form.Label> : ''}
      <InputGroup className={setErrorClass(meta)}>
        <Form.Control as="select" {...input} className="custom-select">
          {options.default ? <option value="">{options.default}</option> : ''}
          {_.map(options, (value, key) => {
            if (key !== 'default') {
              return (
                <option key={key} value={key}>
                  {value}
                </option>
              );
            }
            return '';
          })}
        </Form.Control>
      </InputGroup>
      {renderError(meta)}
    </Form.Group>
  );
};

export const renderFileInputGroup = ({
  input,
  label,
  acceptFileFormat,
  multiple,
  formGroupClassName,
  meta,
}) => {
  let isMultiple = multiple ? multiple : false;
  return (
    <Form.Group className={formGroupClassName}>
      <div className={`custom-file ${setErrorClass(meta)}`}>
        <Form.Label className="custom-file-label text-left">{label}</Form.Label>
        <input
          {..._.omit(input, 'value')}
          type="file"
          className="custom-file-input"
          multiple={isMultiple}
          accept={acceptFileFormat}
        />
      </div>
      {renderError(meta)}
    </Form.Group>
  );
};

export const renderSwitchInputGroup = ({
  input,
  label,
  formGroupClassName,
  meta,
}) => {
  return (
    <Form.Group className={formGroupClassName}>
      <div className={`custom-control custom-switch ${setErrorClass(meta)}`}>
        <input
          {...input}
          type="checkbox"
          className="custom-control-input"
          id="custom-switch-input"
        />
        <Form.Label
          className="custom-control-label"
          htmlFor="custom-switch-input"
        >
          {label}
        </Form.Label>
      </div>
      {renderError(meta)}
    </Form.Group>
  );
};

export const renderFormField = ({
  input,
  contentType,
  type,
  placeholder,
  label,
  options,
  acceptFileFormat,
  multiple,
  textAppend,
  enableAppendSumbit,
  isFixed: readOnly,
  formGroupClassName,
  meta,
}) => {
  if (contentType === 'text') {
    return renderTextInputGroup({
      input,
      label,
      type,
      placeholder,
      textAppend,
      enableAppendSumbit,
      readOnly,
      formGroupClassName,
      meta,
    });
  } else if (contentType === 'dropdown') {
    return renderDropdownInputGroup({
      input,
      label,
      options,
      formGroupClassName,
      meta,
    });
  } else if (contentType === 'file') {
    return renderFileInputGroup({
      input,
      label,
      acceptFileFormat,
      multiple,
      formGroupClassName,
      meta,
    });
  } else if (contentType === 'switch') {
    return renderSwitchInputGroup({
      input,
      label,
      formGroupClassName,
      meta,
    });
  }
  return '';
};

export const renderSubmitButton = ({
  loading,
  originalText,
  loadingText,
  onClick,
  btnColor,
  type,
  ref,
}) => {
  if (!type) {
    type = 'submit';
  }
  if (!btnColor) {
    btnColor = 'primary';
  }
  if (loading) {
    return (
      <Button variant={btnColor} type={type} ref={ref} disabled>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        ></Spinner>
        &nbsp;&nbsp;{loadingText}
      </Button>
    );
  } else {
    return (
      <Button variant={btnColor} type={type} ref={ref} onClick={onClick}>
        {originalText}
      </Button>
    );
  }
};
