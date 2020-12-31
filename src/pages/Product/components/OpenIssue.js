import React from 'react'
import styled from 'styled-components'
import svgVoting from '../../../assets/images/voting.svg';
import { Button } from 'antd';

const StyledWrapper = styled.div`
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    padding: 20px;
    background-color: white;
    border-radius: 2px;
    position: relative;

    display: flex;

    .card-text {
        margin-right: 8px;
        flex: 1;
    }

    .svg-img {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 10px;
        z-index: 1;


        img {
            width: 120px;
        }
    }

`

const OpenIssue = (props) => {
    return (
        <StyledWrapper className={props.className} style={props.style}>
            <div className='card-text'>
                <h4>5 Issues are being opened</h4>
                <p>Participate in voting to tackle malicious reviews</p>
                <Button>Vote</Button>
            </div>
            <div className='svg-img'>
                <img src={svgVoting} />
            </div>
        </StyledWrapper>
    )
}

export default OpenIssue
