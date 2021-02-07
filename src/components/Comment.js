import React from 'react'
import styled from 'styled-components'
import { Typography, Space, Avatar } from 'antd';
import useProfile from '../states/useProfile';
import { formatDate } from '../common/format';
import Author from './ReviewCard/Author';
import UserAvatar from './ReviewCard/UserAvatar';

const StyledWrapper = styled.div`
    display: flex;

    .avatar {
        margin-right: 8px;
    }
    
    .seperator {
        display: flex;
        justify-content: space-between;
    }
`

const Comment = ({ comment, ...props }) => {

    const { owner, message, createdAt } = comment;

    const { profile } = useProfile(owner);
    const firstname = profile ? profile.firstname : null;
    const lastname = profile ? profile.lastname : null;
    const displayName = (firstname && lastname) ? `${firstname} ${lastname}` : owner;

    return (
        <StyledWrapper>
            <UserAvatar accountId={owner} className='avatar'/>
            <div style={{ flex: 1 }}>
                <div className='seperator'>
                    <Typography.Title level={5}>{displayName}</Typography.Title>
                    <Typography.Text type='secondary'>{formatDate(createdAt)}</Typography.Text>
                </div>
                <pre>{message}</pre>
            </div>
        </StyledWrapper>
    )
}

export default Comment
