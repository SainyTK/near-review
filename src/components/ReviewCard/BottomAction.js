import React from 'react'
import styled from 'styled-components'
import { LikeOutlined, CommentOutlined, FlagOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const StyledWrapper = styled.div`
    display: flex;
    justify-content: space-between;

    .like-btn, .comment-btn, .open-issue-btn, .blockchain-btn {
        cursor: pointer;
        transition: .4s ease-in-out;
    }

    .like-icon, .comment-icon {
        color: var(--text-secondary);
    }

    .flag-icon {
        color: var(--green);
    }

    .check-icon {
        color: var(--blue);
    }

    .like-btn:hover {
        * {
            color: var(--blue);
        }
    }

    ${props => props.disableLike && `
        .like-btn:hover {
            * {
                color: var(--text-secondary);
            }
        }

        .like-btn {
            cursor: unset;
        }
    `}

    .comment-btn:hover {
        * {
            color: var(--green);
        }
    }

    .open-issue-btn:hover {
        .open-issue-text {
            color: black;
        }
    }

    .blockchain-btn:hover {
        .blockchain-text {
            color: black;
        }
    }

    ${props => props.isLike && `
        .like-btn {
            * {
                color: var(--blue);
            }
        }
        .like-btn {
            cursor: unset;
        }
    `}

`

const BottomAction = (props) => {

    const { review } = props;
    const likes = review ? review.likes || [] : [];
    const comments = review ? review.comments || [] : [];
    const customer = review ? review.customer : '';

    const isLike = likes.includes(window.accountId);

    const disableLike = !window.accountId || window.accountId === customer;

    return (
        <StyledWrapper isLike={isLike} disableLike={disableLike}>
            <Space>
                <Space className={'like-btn'} onClick={props.onLike}>
                    <LikeOutlined className='like-icon'/>
                    <Text type='secondary'>{likes.length}</Text>
                </Space>
                <Space className={'comment-btn'}>
                    <CommentOutlined className='comment-icon'/>
                    <Text type='secondary'>{comments.length}</Text>
                </Space>
            </Space>
            <Space>
                <Space className={'open-issue-btn'}>
                    <Text type='secondary' className='open-issue-text'>Open Issue</Text>
                    <FlagOutlined className='flag-icon'/>
                </Space>
                <Space className={'blockchain-btn'}>
                    <Text type='secondary' className='blockchain-text'>Blockchain</Text>
                    <CheckSquareOutlined className='check-icon'/>
                </Space>
            </Space>
        </StyledWrapper>
    )
}

export default BottomAction
