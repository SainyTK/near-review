import React from 'react';
import styled from 'styled-components';

const colorMap = {
    primary: {
        border: '#00C7D8',
        font: '#00C7D8',
        bg: '#DEFCFF',
        hover: {
            border: '#89E4FF',
            font: '#FFF',
            bg: '#89E4FF',
        }
    },
    secondary: {
        border: 'white',
        font: 'var(--text-main)',
        bg: 'white',
        hover: {
            border: 'var(--text-secondary)',
            font: 'white',
            bg: 'var(--text-secondary)',
        }
    },
    danger: {

    },
    disabled: {
        border: '#cecece',
        font: '#bbb',
        bg: '#EBEBEB',
        hover: {
            border: '#cecece',
            font: '#bbb',
            bg: '#EBEBEB',
        }
    }
}

const StyledWrapper = styled.button`

    outline: none;
    transition: all .4s;

    ${props => `
        color: ${colorMap[props.theme].font};
        background-color: ${colorMap[props.theme].bg};
        border: 1px solid ${colorMap[props.theme].border};

        &:hover {
            color: ${colorMap[props.theme].hover.font};
            background-color: ${colorMap[props.theme].hover.bg};
            border: 1px solid ${colorMap[props.theme].hover.border};
        }

    `}

    border-radius: 4px;
    min-width: 100px;
    cursor: pointer;
    padding: 2px 16px;

    &[disabled] {
        cursor: unset;
    }

    &[focus] {
        outline: none;
    }

`


const Button = (props) => {

    const theme = props.disabled ? 'disabled' : props.theme;

    return (
        <StyledWrapper theme={theme || 'primary'} {...props}>
            {props.children}
        </StyledWrapper>
    )
}

export default Button;
