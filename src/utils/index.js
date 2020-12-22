import _ from 'lodash';
import React from 'react';

export const renderError = ({ error, touched }) => {
  if (touched && error) {
    return <div className="invalid-feedback">{error}</div>;
  }
};

export const renderTextInput = ({ input, label, type, placeholder, meta }) => {
  const errorClassName = `${meta.touched && meta.error ? 'is-invalid' : ''}`;
  return (
    <React.Fragment>
      {label ? <label>{label}</label> : ''}
      <div className={`input-group ${errorClassName}`}>
        <input
          {...input}
          type={type}
          className="form-control"
          placeholder={placeholder}
          autoComplete="off"
        />
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
  const errorClassName = `${meta.touched && meta.error ? 'is-invalid' : ''}`;
  return (
    <div className={`form-group ${formGroupClassName}`}>
      {label ? <label>{label}</label> : ''}
      <div className={`input-group ${errorClassName}`}>
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

export const renderFormField = ({
  input,
  contentType,
  type,
  placeholder,
  label,
  options,
  formGroupClassName,
  meta,
}) => {
  if (contentType === 'text') {
    return renderTextInputGroup({
      input,
      label,
      type,
      placeholder,
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
