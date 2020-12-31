import React from 'react'
import styled from 'styled-components';
import { Button, Col, Row, Space, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import avatarImg from '../assets/images/avatar.jpg';
import { SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const StyledWrapper = styled.div`
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    padding: 20px;
    background-color: white;
    border-radius: 2px;

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
`

const ProfileCard = (props) => {

    const { imageUrl, firstname, lastname, accountId } = props;

    return (
        <StyledWrapper>
            <div className='top'>
                <Row gutter={[10, 10]}>
                    <Col>
                        <Avatar size={56} src={imageUrl || avatarImg} />
                    </Col>
                    <Col>
                        <Title level={5}>{firstname} {lastname}</Title>
                        <Text type='secondary'>{accountId}</Text>
                    </Col>
                </Row>
                <div>
                    <Link to='settingProfile' className='setting-btn'>
                        <Space>
                            <SettingOutlined />
                            <div>Settings</div>
                        </Space>
                    </Link>
                </div>
            </div>
            <div className='detail'>
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
                        <h4>Helpful Scores</h4>
                        <div className='detail-number'>
                            <Space>
                                <Text type='secondary'>Total</Text>
                                <b>{100}</b>
                            </Space>
                        </div>
                    </div>
                    <div>
                        <h4>Win Issues</h4>
                        <div className='detail-number'>
                            <Space>
                                <Text type='secondary'>Total</Text>
                                <b>{100}</b>
                            </Space>
                        </div>
                    </div>
                </Space>
                <Button type='dashed'>More Info</Button>
            </div>
        </StyledWrapper>
    )
}

export default ProfileCard
