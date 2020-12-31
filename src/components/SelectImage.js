import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`

    .placeholder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        background-color: var(--bg);
        cursor: pointer;

        width: 100px;
        height: 100px;
        border-radius: 8px;

        ${props => props.disabled && `
            cursor: unset;
        `}
    }

    .avatar-img {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        cursor: pointer;

        ${props => props.disabled && `
            cursor: unset;
        `}
    }

`

const ImagePlaceholder = () => (
    <div className='placeholder'>
        <i className='fa fa-image text-secondary'></i>
        <span className='text-secondary'>Select file</span>
    </div>
)

const SelectImage = ({ value, onChange, disabled, type, ...props }) => {

    const [display, setDisplay] = useState(value);

    useEffect(() => {
        if (value) {
            setDisplay(value);
        }
    }, [value]);

    const handleChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const url = URL.createObjectURL(file);
            setDisplay(url);

            onChange && onChange(file);
        }
    }

    const renderDisplay = () => {
        if (props.children)
            return props.children;
        else   
            return display ? <img className='avatar-img' src={display} /> : <ImagePlaceholder />
    }

    return (
        <StyledWrapper disabled={disabled} {...props}>
            <label htmlFor='select-file'>
                {renderDisplay()}
            </label>
            <input id='select-file' type='file' hidden onChange={handleChange} accept='image/*' disabled={disabled} />
        </StyledWrapper>
    );


}

export default SelectImage
