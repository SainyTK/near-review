import React from 'react'
import styled from 'styled-components';
import { Button, Col, Rate, Row, Space, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import avatarImg from '../assets/images/avatar.jpg';
import { SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import useProfile from '../states/useProfile';
import RadialProgress from './RadialProgress';
import imagePlaceholder from '../assets/images/avatar.jpg'

const { Title, Text } = Typography;

const StyledWrapper = styled.div`
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    padding: 20px;
    background-color: white;
    border-radius: 2px;

    .product-img {
        width: 100px;
        height: 90px;
        border-radius: 8px;
    }

    .top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .detail {
        display: flex;
        justify-content: space-between;
    }

    .detail-number {
        display: flex;
        justify-content: flex-end;
    }

    .setting-btn {
        color: unset;
    }

    .right {
        display: flex;
        justify-content: flex-start;

        @media (min-width: 769px) {
            justify-content: flex-end;
        }
    }
`

const ProductInfoCard = (props) => {

    const { name, category, location, imageUrl, reviewValue, isActive, owner } = props;
    const { profile } = useProfile(owner);

    const firstname = profile ? profile.firstname : '';
    const lastname = profile ? profile.lastname : '';
    const profileImage = profile ? profile.imageUrl : '';
    const accountId = profile ? profile.accountId : '';

    const score = 4.5;

    return (
        <StyledWrapper>
            <Row gutter={[10, 10]}>
                <Col sm={24} lg={12}>
                    <Space align='start' size='large'>
                        <img className='product-img' src={imageUrl} />
                        <div>
                            <h3>{name}</h3>
                            <div>
                                <Space align='baseline'>
                                    <i className='fa fa-map-marker'></i>
                                    <Text type='secondary'>{location}</Text>
                                </Space>
                            </div>
                            <div>
                                <Space align='baseline'>
                                    <Rate value={score} />
                                    <Text type='secondary'>{score}</Text>
                                </Space>
                            </div>
                        </div>
                    </Space>
                </Col>
                <Col sm={24} lg={12}>
                    <div className='right'>
                        <Button type='primary'>Website</Button>
                    </div>
                </Col>
                <Col sm={24} lg={12}>
                    <h4>Created by</h4>
                    <Link className='no-style' to={`/profile/${accountId}`}>
                        <Space>
                            <Avatar src={profileImage || imagePlaceholder} />
                            <div>
                                <div><b>{firstname} {lastname}</b></div>
                                <Text type='secondary'>{accountId}</Text>
                            </div>
                        </Space>
                    </Link>
                </Col>
                <Col sm={24} lg={12}>
                    <div className='right'>
                        <Space size='large'>
                            <div>
                                <h4>Purchased</h4>
                                <div className='detail-number'>
                                    <Space>
                                        <Text type='secondary'>Total</Text>
                                        <b>{100}</b>
                                    </Space>
                                </div>
                            </div>
                            <div>
                                <h4>Reviews</h4>
                                <div className='detail-number'>
                                    <Space>
                                        <Text type='secondary'>Total</Text>
                                        <b>{100}</b>
                                    </Space>
                                </div>
                            </div>
                            <div>
                                <RadialProgress percent={85} size={100} />
                            </div>
                        </Space>
                    </div>
                </Col>
            </Row>
        </StyledWrapper>
    )
}

export default ProductInfoCard
