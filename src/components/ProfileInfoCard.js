import { Space } from 'antd';
import React from 'react'
import styled from 'styled-components';
import { TwitterCircleFilled, FacebookFilled, InstagramFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const StyledWrapper = styled.div`
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    padding: 20px;
    background-color: white;
    border-radius: 2px;

    .no-style {
        color: unset;
    }

    .icon {
        transition: .4s;
        font-size: 18px;
    }

    .fb:hover {
        color: #3b5998;
    }

    .ig:hover {
        color: #C13584;
    }

    .twit:hover {
        color: #1DA1F2;
    }

    .tele:hover {
        color: #0088cc;
    }

`

const ProfileInfoCard = (props) => {

    if (!props.biography && !props.city && !props.job && !props.facebook && !props.instagram && !props.twitter && !props.telegram)
        return null;

    return (
        <StyledWrapper>
            <h4>Biography</h4>
            {
                props.biography && (
                    <div>
                        <p>{props.biography}</p>
                    </div>
                )
            }
            {
                props.city && (
                    <div>
                        <Space align='baseline'>
                            <i className='fa fa-map-marker'></i>
                            <p>{props.city}</p>
                        </Space>
                    </div>
                )
            }
            {
                props.job && (
                    <div>
                        <Space align='baseline'>
                            <i className='fa fa-briefcase'></i>
                            <p>{props.job}</p>
                        </Space>
                    </div>
                )
            }
            {
                (props.facebook || props.instagram || props.twitter || props.telegram) && (
                    <div>
                        <h4>Social Media</h4>
                        <div>
                            <Space size='middle'>
                                {props.facebook && <Link className='no-style' to={props.facebook}><FacebookFilled className='icon fb' /></Link>}
                                {props.instagram && <Link className='no-style' to={props.instagram}><InstagramFilled className='icon ig' /></Link>}
                                {props.twitter && <Link className='no-style' to={props.twitter}><TwitterCircleFilled className='icon twit' /></Link>}
                            </Space>
                        </div>
                    </div>
                )
            }

        </StyledWrapper>
    )
}

export default ProfileInfoCard
