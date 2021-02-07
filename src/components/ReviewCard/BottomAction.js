import React from 'react'
import styled from 'styled-components'
import { LikeOutlined, CommentOutlined, FlagOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import useProductsOf from '../../states/useProductsOf';
import useIssues from '../../states/useIssues';

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

    ${props => props.disableOpenIssue && `
        .open-issue-btn:hover {
            .open-issue-text {
                color: var(--text-secondary);
            }
        }

        .open-issue-btn {
            cursor: unset;
        }
    `}

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
    const orderId = review ? review.orderId : 0;
    const likes = review ? review.likes || [] : [];
    const comments = review ? review.comments || [] : [];
    const customer = review ? review.customer : '';

    const isLike = likes.includes(window.accountId);
    const { products } = useProductsOf(window.accountId);
    const { issueMap } = useIssues();

    const disableLike = !window.accountId || window.accountId === customer || (products && products.length > 0);
    const disableOpenIssue = !window.accountId || (products && products.length > 0);

    const issue = issueMap[orderId];

    const handleLike = () => {
        if (props.onLike && !disableLike)
            props.onLike();
    }

    const handleOpenIssue = () => {
        if (props.onOpenIssue && !disableOpenIssue)
            props.onOpenIssue();
    }

    return (
        <StyledWrapper isLike={isLike} disableLike={disableLike} disableOpenIssue={disableOpenIssue}>
            <Space>
                <Space className={'like-btn'} onClick={handleLike}>
                    <LikeOutlined className='like-icon' />
                    <Text type='secondary'>{likes.length}</Text>
                </Space>
                <Link to={`/reviews/${orderId}/comments`}>
                    <Space className={'comment-btn'}>
                        <CommentOutlined className='comment-icon' />
                        <Text type='secondary'>{comments.length}</Text>
                    </Space>
                </Link>
            </Space>
            <Space>
                {
                    issue ? (
                        <Link to={`/issues/${issue.issueId}`}>
                            <Space className={'open-issue-btn'}>
                                <Text>Vote</Text>
                                <FlagOutlined className='flag-icon' />
                            </Space>
                        </Link>
                    ) : (
                            <Space className={'open-issue-btn'} onClick={handleOpenIssue}>
                                <Text type='secondary' className='open-issue-text'>Open Issue</Text>
                                <FlagOutlined className='flag-icon' />
                            </Space>
                        )
                }
                <Space className={'blockchain-btn'}>
                    <Text type='secondary' className='blockchain-text'>Blockchain</Text>
                    <CheckSquareOutlined className='check-icon' />
                </Space>
            </Space>
        </StyledWrapper>
    )
}

export default BottomAction
