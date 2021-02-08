import React from 'react'
import styled from 'styled-components'
import useProfile from '../states/useProfile'
import UserAvatar from './ReviewCard/UserAvatar'

const StyledWrapper = styled.div`
    display: flex;

    .avatar-container {
        margin-right: 8px;
    }

    .content-container {
        flex: 1;
    }

    .agree {
        color: var(--green);
    }

    .disagree {
        color: var(--red);
    }
`

const VoteContent = ({ vote }) => {

    const voter = vote ? vote.voter : null;
    const value = vote ? vote.value : 0;
    const message = vote ? vote.message : '';
    const agree = vote ? vote.agree : null;

    const { profile } = useProfile(voter);
    const firstname = profile ? profile.firstname || '' : '';
    const lastname = profile ? profile.lastname || '' : '';
    const displayName = (firstname.length <= 0 || lastname.length <= 0) ? voter : `${firstname} ${lastname}`;

    const agreeText = agree ? 'agree' : 'disagree';

    return (
        <StyledWrapper>
            <div className='avatar-container'>
                <UserAvatar accountId={voter} />
            </div>
            <div className='content-container'>
                <div><b>{displayName} voted <span className={agreeText}>{agreeText}</span> with {value} Ⓝ</b></div>
                <pre>{message}</pre>
            </div>
        </StyledWrapper>
    )
}

export default VoteContent
