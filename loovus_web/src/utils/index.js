import _ from 'lodash';
import React from 'react';

export const renderLoadingPage = loadingText => {
  return (
    <div className="row">
      <div className="col-12 text-center">
        <h4 className="heading">{loadingText}</h4>
      </div>
      <div className="col-12 text-center">
        <div className="spinner-grow spinner-grow-md" role="status" />
      </div>
    </div>
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
    <React.Fragment>
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
    </React.Fragment>
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
          <option value="">{options['default']}</option>
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
      <button className={`btn btn-${btnColor}`} type={type} ref={ref} disabled>
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        &nbsp;&nbsp;{loadingText}
      </button>
    );
  } else {
    return (
      <button
        className={`btn btn-${btnColor}`}
        type={type}
        ref={ref}
        onClick={onClick}
      >
        {originalText}
      </button>
    );
  }
};
