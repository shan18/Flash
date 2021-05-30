import _ from 'lodash';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
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
      {label ? <label>{label}</label> : ''}
      <div className={`input-group ${setErrorClass(meta)}`}>
        <input
          {...input}
          type={type}
          className="form-control"
          placeholder={placeholder}
          autoComplete="off"
          readOnly={readOnly}
        />
        {textAppend ? (
          <div className="input-group-append">
            {enableAppendSumbit ? (
              <button className="btn btn-danger">{textAppend}</button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={event => event.preventDefault}
              >
                {textAppend}
              </button>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
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
    <div className={`form-group ${formGroupClassName}`}>
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
    </div>
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
    <div className={`form-group ${formGroupClassName}`}>
      {label ? <label>{label}</label> : ''}
      <div className={`input-group ${setErrorClass(meta)}`}>
        <select {...input} className="form-control custom-select">
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
        </select>
      </div>
      {renderError(meta)}
    </div>
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
    <div className={`form-group ${formGroupClassName}`}>
      <div className={`custom-file ${setErrorClass(meta)}`}>
        <label className="custom-file-label text-left">{label}</label>
        <input
          {..._.omit(input, 'value')}
          type="file"
          className="custom-file-input"
          multiple={isMultiple}
          accept={acceptFileFormat}
        />
      </div>
      {renderError(meta)}
    </div>
  );
};

export const renderSwitchInputGroup = ({
  input,
  label,
  formGroupClassName,
  meta,
}) => {
  return (
    <div className={`form-group ${formGroupClassName}`}>
      <div className={`custom-control custom-switch ${setErrorClass(meta)}`}>
        <input
          {...input}
          type="checkbox"
          className="custom-control-input"
          id="custom-switch-input"
        />
        <label className="custom-control-label" htmlFor="custom-switch-input">
          {label}
        </label>
      </div>
      {renderError(meta)}
    </div>
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
