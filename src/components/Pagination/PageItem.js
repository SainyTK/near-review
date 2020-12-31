import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  border-radius: 4px;
  padding: 2px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: .4s;
  border: 1px solid white;

  &:hover {
    border: 1px solid var(--primary);
    color: var(--primary);
  }

  ${props => props.active && `
    border: 1px solid var(--primary);
    background-color: var(--primary);
    color: white;

    &:hover {
        border: 1px solid var(--primary);
        color: white;
    }
  `}

  ${props => props.disabled && `
    cursor: not-allowed;
    border: 1px solid #cecece;
    color: #cecece;
    &:hover {
      border: 1px solid #cecece;
      color: #cecece;
    }
  `}

`;

const PageItem = ({ active, disabled, onClick, ...props }) => {

    const handleClick = () => {
        if (!disabled && onClick) onClick();
    }

    return (
        <StyledWrapper {...props} active={active} disabled={disabled} onClick={handleClick}>
            {props.children}
        </StyledWrapper>
    )
}

export default PageItem;