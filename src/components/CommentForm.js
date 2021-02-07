import React, { useState } from 'react'
import styled from 'styled-components'
import useProfile from '../states/useProfile'
import UserAvatar from './ReviewCard/UserAvatar'
import reviewService from '../services/reviewService';
import ipfs from '../ipfs';
import { notification, Input, Button } from 'antd';
import useReview from '../states/useReview';

const StyledWrapper = styled.div`
    display: flex;

    .avatar {
        margin-right: 8px;
    }

    .comment-field {
        width: 100%;
        margin-bottom: 10px;
    }
`

const CommentForm = ({ targetId }) => {

    const reviewState = useReview(targetId);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await ipfs.uploadObject({ message: comment });
            await reviewService.createComment(+targetId, res[0].hash);
            notification['success']({
                message: 'Success',
                description: 'Post comment successfully'
            });
            reviewState.update();
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <StyledWrapper>
            <UserAvatar className='avatar' accountId={window.accountId} />
            <div style={{ flex: 1 }}>
                <Input.TextArea
                    className='comment-field'
                    placeholder='Say something...'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                />
                <Button onClick={handleSubmit} type='primary' loading={loading}>Submit</Button>
            </div>
        </StyledWrapper>
    )
}

export default CommentForm
