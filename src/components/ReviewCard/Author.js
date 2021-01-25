import { Space, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react'
import styled from 'styled-components'
import avatarImg from '../../assets/images/avatar.jpg';
import useProfile from '../../states/useProfile';

const { Text, Title } = Typography;

const StyledWrapper = styled.div`

    .user-name {
        margin: 0;
    }

    .small {
        font-size: .8em;
    }
`

const Author = (props) => {

    const imageUrl = props ? props.imageUrl : null;
    const firstname = props ? props.firstname : '';
    const lastname = props ? props.lastname : '';
    const accountId = props ? props.accountId : '';

    const contributions = {
        reviews: 10,
        likeGiven: 20,
        likeGot: 20,
        winIssue: 20
    }

    return (
        <StyledWrapper className={props.className} style={props.style}>
            <Space align='start'>
                <Avatar className='avatar' src={imageUrl || avatarImg} size={32} />
                <div>
                    <div className='name-panel'>
                        <Space align='baseline'>
                            <Title level={5} className='user-name'>{firstname} {lastname}</Title>
                            <Text type='secondary'>{accountId}</Text>
                        </Space>
                    </div>
                    <div>
                        <Space>
                            <Text type='secondary' className='small'>{contributions.reviews} reviews</Text>
                            <Text type='secondary'> · </Text>
                            <Text type='secondary' className='small'>{contributions.likeGiven} likes give</Text>
                            <Text type='secondary'> · </Text>
                            <Text type='secondary' className='small'>{contributions.likeGot} likes got</Text>
                            <Text type='secondary'> · </Text>
                            <Text type='secondary' className='small'>{contributions.winIssue} win issues</Text>
                        </Space>
                    </div>
                </div>
            </Space>
        </StyledWrapper>
    )
}

export default Author
