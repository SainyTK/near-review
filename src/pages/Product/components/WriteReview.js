import React, { useState } from 'react'
import styled from 'styled-components'
import svgReviewing from '../../../assets/images/reviewing.svg';
import { Button, Rate, Modal } from 'antd';
import useVisibility from '../../../hooks/useVisibility';
import OrderCard from './OrderCard';
import { useHistory, useParams } from 'react-router-dom';

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

const WriteReview = ({ orders, ...props }) => {

    const numOrders = orders ? orders.length : 0;
    const disabled = !orders || numOrders <= 0 || !window.accountId;

    const history = useHistory();
    const params = useParams();

    const modal = useVisibility();
    const [selected, setSelected] = useState(0);

    const handleWriteReview = () => {
        const order = orders[selected]
        history.push(`/products/${params.search}/review?orderId=${order.orderId}`);
    }

    const renderActionText = () => {
        if (!window.accountId) {
            return "Please login";
        } else if (!orders || numOrders <= 0) {
            return "Please purchase a product"
        } else {
            return  `Write ${numOrders > 1 ? `(${numOrders})` : ``} `;
        }
    }

    return (
        <StyledWrapper className={props.className} style={props.style}>
            <div className='card-text'>
                <h4>Write Your Review</h4>
                <div className='rating-container'>
                    <Rate value={4.5} />
                </div>
                <Button
                    onClick={modal.show}
                    type='primary'
                    disabled={disabled}
                >
                    {renderActionText()}
                </Button>
            </div>
            <div className='svg-img'>
                <img src={svgReviewing} />
            </div>
            <Modal
                title="Select an order"
                onOk={handleWriteReview}
                visible={modal.visible}
                onCancel={modal.hide}
            >
                {
                    orders && orders.map((o, index) => (
                        <div key={index} style={{ marginBottom: 18 }}>
                            <OrderCard
                                order={o}
                                type='write-review'
                                selected={index === selected}
                                onClick={() => setSelected(index)}
                            />
                        </div>
                    ))
                }
            </Modal>
        </StyledWrapper>
    )
}

export default WriteReview
