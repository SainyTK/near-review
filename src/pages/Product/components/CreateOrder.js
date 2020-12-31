import React from 'react'
import styled from 'styled-components'
import svgOrder from '../../../assets/images/order.svg';
import { Button, Rate } from 'antd';

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

const CreateOrder = (props) => {
    return (
        <StyledWrapper className={props.className} style={props.style}>
            <div className='card-text'>
                <h4>Create an order</h4>
                <p>Define a product price and create an order for your customer</p>
                <Button onClick={props.onClick}>Create</Button>
            </div>
            <div className='svg-img'>
                <img src={svgOrder} />
            </div>
        </StyledWrapper>
    )
}

export default CreateOrder
