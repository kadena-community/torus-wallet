import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-flow: column;
  width: 100%;
  margin-bottom: ${({ withMarginBottom }) =>
    withMarginBottom ? "25px" : "0px"};
  .ui.fluid.input {
    width: 100%;
  }
`;

const LabelContainer = styled.div`
  margin-bottom: 3px;
  min-height: ${({ withoutLabel }) => (withoutLabel ? "14.95px" : "0px")};
  display: flex;
  position: relative;
  justify-content: space-between;
  width: 100%;
`;

const Label = styled.span`
  color: ${({ disabled, theme: { colors } }) =>
    disabled ? `${colors.white}33` : colors.white};
  font-size: 24px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel + 1}px`}) {
    font-size: 18px;
  }
`;

const Error = styled.div.attrs({ capitalize: true })`
  color: ${({ theme: { colors } }) => colors.error};
  font-size: 14px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  margin-top: 3px;
`;

const ReadOnlyValue = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  color: ${({ theme: { colors } }) => colors.white};
  font-size: 14px;
  width: 100%;
`;

const InputWithLabel = ({
  isRequired = false,
  disabled,
  className,
  containerStyle,
  label,
  labelStyle,
  rightLabelComponent,
  withMarginBottom,
  withoutLabel,
  error,
  children,
  readOnly,
  valueStyle,
  labelContainerStyle,
}) => {
  return (
    <Container
      className={className}
      style={containerStyle}
      withMarginBottom={withMarginBottom}
    >
      <LabelContainer withoutLabel={withoutLabel} style={labelContainerStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            position: "relative",
            marginBottom: 3,
          }}
        >
          <Label disabled={disabled} style={labelStyle}>
            {label}
          </Label>
          {isRequired && (
            <Label style={{ position: "absolute", right: -7, top: -4 }}>
              *
            </Label>
          )}
        </div>
        {rightLabelComponent}
      </LabelContainer>
      {readOnly ? (
        <ReadOnlyValue style={valueStyle}>{children}</ReadOnlyValue>
      ) : (
        children
      )}
      {error && typeof error === "function" ? <Error>{error()}</Error> : null}
      {error && typeof error !== "function" ? <Error>{error}</Error> : null}
    </Container>
  );
};

InputWithLabel.propTypes = {
  label: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  withoutLabel: PropTypes.bool,
};

InputWithLabel.defaultProps = {
  label: "",
  error: "",
  withoutLabel: false,
};

export default InputWithLabel;
