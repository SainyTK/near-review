import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RadialProgress from './RadialProgress';
import { Rate, Typography, Space, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import useProfile from '../states/useProfile';
import placeholderAvatar from '../assets/images/avatar.jpg';

const { Text, Paragraph } = Typography;

const SyledWrapper = styled.div`
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    width: 100%;
    cursor: pointer;

    display: flex;
    align-items: center;

    ${props => !props.isActive && `
        background-color: #f1f1f1;
    `}

    .number {
        margin-right: 12px;
    }

    .product-img {
        height: 100%;
        margin-right: 16px;
        min-width: 100px;
        width: 15%;

        img {
            border-radius: 12px;
            width: 100%;
            min-height: 90px;
        }

    }

    .product-details {
        margin-right: 16px;
        width: 30%;

        @media (max-width: 760px) {
            width: 40%;
        }

        @media (max-width: 640px) {
            width: 50%;
        }

        @media (max-width: 520px) {
            width: 80%;
        }
    }

    .owner {
        width: 15%;

        @media(max-width: 1023px) {
            display: none;
        }
    }

    .product-reviews, .product-purchased {
        width: 15%;
        max-width: 200px;
        margin-right: 16px;

        text-align: right;
    }

    .product-reviews {
        @media(max-width: 640px) {
            display: none;
        }
    }

    .product-purchased {
        @media(max-width: 767px) {
            display: none;
        }
    }

    .product-scores {
        /* width: 15%; */
        max-width: 160px;
        @media(max-width: 520px) {
            display: none;
        }
    }

    .rating {
        .ant-rate-star:not(:last-child) {
            margin-right: 0px;
        }
    }

    .text-secondary {
        color: #cecece;
    }

`

const ProductCard = ({ product, index, hideOwner, hideStat, ...props }) => {

    const { name, imageUrl, location, isActive, reviews, owner } = product;

    const [percent, setPercent] = useState(Math.floor(Math.random() * 20) + 80);

    const { profile } = useProfile(owner);

    const firstname = profile ? profile.firstname : '';
    const lastname = profile ? profile.lastname : '';
    const profileImage = profile ? profile.imageUrl : '';
    const accountId = profile ? profile.accountId : '';

    return (
        <SyledWrapper {...props} isActive={isActive}>
            {index && <h4 className='number'>{index}</h4>}
            <div className='product-img'>
                <img src={imageUrl} />
            </div>
            <div className='product-details'>
                <h3>{name}</h3>
                <Paragraph type='secondary'><i className='fa fa-map-marker'></i> {location}</Paragraph>
                <Rate value={percent / 20} className='rating' disabled allowHalf />
            </div>
            {
                !hideOwner && (
                    <div className='owner'>
                        <h4>Created by</h4>
                        <Space align='start'>
                            <Avatar src={profileImage || placeholderAvatar} />
                            <div>
                                <div><b>{firstname} {lastname}</b></div>
                                <Text type='secondary'>{accountId}</Text>
                            </div>
                        </Space>
                    </div>
                )
            }
            {
                !hideStat && (
                    <>
                        <div className='product-purchased'>
                            <h3>Purchased</h3>
                            <span><Text type='secondary'>Total</Text> <b>{160}</b></span>
                        </div>
                        <div className='product-reviews'>
                            <h3>Reviews</h3>
                            <span><Text type='secondary'>Total</Text> <b>{160}</b></span>
                        </div>
                    </>
                )
            }
            <div className='product-scores'>
                <RadialProgress percent={percent} />
            </div>
        </SyledWrapper>
    )
}

export default ProductCard
