import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

const StyledWrapper = styled.div`

    .star {
        font-size: 1.4em;
        color: var(--bg);
        cursor: pointer;
    }

    .star.disabled {
        cursor: unset;
    }

    .star.active {
        color: gold;
    }

    .half-star-container {
        position: relative;

        .star {
            position: relative;
        }

        .star-float {
            position: absolute;
            top: 0;
            left: 0;
        }
        
    }

    .text {
        line-height: 1.6em;
    }
`

const Rating = ({ numStar, disabled, onChange, showText, ...props }) => {

    const [value, setValue] = useState(props.value || 0);
    const [hovering, setHovering] = useState(false);
    const [tempValue, setTempValue] = useState(0);

    useEffect(() => {
        setValue(props.value);
    }, [props.value])

    const handleHover = (val) => {
        if (disabled) return;
        setTempValue(val);
        setHovering(true);
    }

    const handleChange = (val) => {
        if (disabled) return;
        if (onChange) onChange(val);
        else setValue(val);
    }

    const num = numStar || 5;
    const score = hovering ? tempValue : value;

    return (
        <StyledWrapper className='d-flex align-items-center'>
            {
                Array.from(new Array(num)).map((_, i) => {


                    const isActive = score >= (i + 1);
                    const isHalf = score >= (i + 0.5) && score < (i + 1);

                    return (
                        <span key={i} className='half-star-container mr-1' >
                            <i
                                className={`star fa fa-star ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                                onClick={() => handleChange(i + 1)}
                                onMouseOver={() => handleHover(i + 1)}
                                onMouseOut={() => setHovering(false)}
                            />
                            <i
                                className={`star star-float fa fa-star-half ${isHalf || isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                                onClick={() => handleChange(i + 0.5)}
                                onMouseOver={() => handleHover(i + 0.5)}
                                onMouseOut={() => setHovering(false)}
                            />
                        </span>
                    )

                })
            }
            <span className='text-secondary text ml-1'>{score.toFixed(1)}</span>
        </StyledWrapper>
    )
}

export default Rating
