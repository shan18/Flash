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

export const renderFormField = ({
  input,
  contentType,
  type,
  placeholder,
  label,
  formGroupClassName,
  meta,
}) => {
  if (contentType === 'textarea') {
    type = 'textarea';
  }
  if (contentType === 'text') {
    return renderTextInputGroup({
      input,
      label,
      type,
      placeholder,
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
