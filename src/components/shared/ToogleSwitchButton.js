import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import CustomButton from "./Button";
import { NetworkContext } from "../../contexts/NetworkContext";

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Button = styled(CustomButton)`
  margin-left: ${({ label1 }) => (!label1 ? "-16px" : "unset")} !important;
  width: 100%;
  color: white;
`;
const selectedStyle = {
  borderRadius: 20,
  margin: "0px",
};
const ToggleSwitchButton = ({
  label1,
  label2,
  onChange,
  containerStyle,
  disabled,
  buttonSize,
  background,
}) => {
  const networkContext = useContext(NetworkContext);

  return (
    <ButtonsContainer style={containerStyle}>
      <Button
        label1={label1}
        disabled={disabled}
        inverted={networkContext.network.label === label1}
        buttonStyle={
          networkContext.network.label !== label1
            ? {
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                width: "50%",
                margin: "0px",
              }
            : selectedStyle
        }
        size={buttonSize}
        border="transparent"
        onClick={() => {
          networkContext.toggleNetwork();
          onChange(label1);
        }}
      >
        {label1}
      </Button>
      <Button
        disabled={disabled}
        inverted={networkContext.network.label === label2}
        buttonStyle={
          networkContext.network.label !== label2
            ? {
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                width: "50%",
                margin: "0px",
              }
            : selectedStyle
        }
        size={buttonSize}
        border="transparent"
        onClick={() => {
          networkContext.toggleNetwork();
          onChange(label2);
        }}
      >
        {label2}
      </Button>
    </ButtonsContainer>
  );
};
ToggleSwitchButton.propTypes = {
  label1: PropTypes.string,
  label2: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
ToggleSwitchButton.defaultProps = {
  label1: "",
  label2: "",
};
export default ToggleSwitchButton;
