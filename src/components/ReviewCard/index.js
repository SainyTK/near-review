import React from 'react'
import styled from 'styled-components'
import Author from './Author';
import { MoreOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Rate, Space, Typography, Dropdown, Menu, Modal, Badge, Tag } from 'antd';
import Gallery from '../Gallery';
import useProfile from '../../states/useProfile'
import BottomAction from './BottomAction';
import { Link } from 'react-router-dom';
import { formatDate } from '../../common/format';
import reviewService from '../../services/reviewService';

const { Text, Title, Paragraph } = Typography;

const StyledWrapper = styled.div`
    background-color: white;
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    padding: 20px;

    .top {
        display: flex;
        align-items: flex-start;

        .review-author {
            flex: 1;
        }
    }


    .plus-icon {
        color: var(--green);
    }

    .minus-icon {
        color: var(--red);
    }

    .date {
        font-size: .9em;
    }

    .opinion-item {
        margin-bottom: 8px;
    }

    .media-container {
        margin-bottom: 10px;
    }

    .more-icon {
        cursor: pointer;
    }
`

const ReviewCard = (props) => {

    const { review, onDelete, onLike } = props;

    const version = props.version || 0;

    const versions = review ? review.versions : [];
    const displayed = review ? review.versions[version] : null;

    const seller = review ? review.seller : '';
    const productId = review ? review.productId : '';
    const orderId = review ? review.orderId : '';
    const customer = review ? review.customer : '';

    const score = displayed ? displayed.score : 0;
    const content = displayed ? displayed.content : '';
    const pros = displayed ? displayed.pros : [];
    const cons = displayed ? displayed.cons : [];
    const images = displayed ? displayed.images : [];

    const reviewedAt = displayed ? displayed.updatedAt : 0;
    const deletedAt = displayed ? displayed.deletedAt : 0;
    const cancelledAt = displayed ? displayed.cancelledAt : 0;

    const { profile } = useProfile(customer);

    const openDeleteModal = () => {
        Modal.confirm({
            title: 'Delete a review',
            content: 'Are you sure to delete this review ?',
            onCancel: () => { },
            onOk: async () => {
                await reviewService.deleteReview(orderId);
                onDelete && onDelete();
            }
        })
    }

    const menu = (
        <Menu style={{ minWidth: 140 }}>
            <Menu.Item key="0">
                <Link to={`/products/${seller}/${productId}/review/${orderId}`}><Text>Edit</Text></Link>
            </Menu.Item>
            <Menu.Item key="1" onClick={openDeleteModal}>
                <Text>Delete</Text>
            </Menu.Item>
        </Menu>
    );

    const renderBadge = () => {
        if (versions.length - 1 === version) {
            return null;
        } else {
            let tag = null;
            if (deletedAt > 0) {
                tag = <Tag>Deleted</Tag>
            } else if (cancelledAt > 0) {
                tag = <Tag color='red'>Cancelled</Tag>
            } else {
                tag = <Tag color='orange'>Updated</Tag>
            }

            return (
                <Link to={`/reviews/${orderId}/track`}>
                    {tag}
                </Link>
            )
        }
    }

    const renderContent = () => {

        return (
            <div>
                <div className='rating-container'>
                    <Space>
                        <Rate value={score} allowHalf disabled />
                        <Text type='secondary' className='date'>{formatDate(reviewedAt)}</Text>
                        {renderBadge()}
                    </Space>
                </div>
                <div>
                    {
                        (deletedAt > 0) ? (
                            <>
                                <Paragraph>This review has been deleted since {formatDate(deletedAt)}</Paragraph>
                            </>
                        ) : (
                                <>
                                    <Text>{content}</Text>
                                </>
                            )
                    }
                </div>
                <div>
                    <Title level={5}>Pros & Cons</Title>
                    <div>
                        {
                            pros && pros.map((pro, index) => (
                                <div className='opinion-item' key={index}>
                                    <Space>
                                        <PlusCircleOutlined className='plus-icon' />
                                        <Text>{pro}</Text>
                                    </Space>
                                </div>
                            ))
                        }
                    </div>
                    <div>
                        {
                            cons && cons.map((con, index) => (
                                <div className='opinion-item' key={index}>
                                    <Space>
                                        <MinusCircleOutlined className='minus-icon' />
                                        <Text>{con}</Text>
                                    </Space>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    images && images.length > 0 && (
                        <div className='media-container'>
                            <Title level={5}>Medias</Title>
                            <Gallery images={images} />
                        </div>
                    )
                }
                <BottomAction
                    review={review}
                    onLike={onLike}
                />
            </div>
        )
    }

    return (
        <StyledWrapper>
            <div className='top'>
                <Author className='review-author' {...profile} />
                {window.accountId === customer && deletedAt === 0 && (
                    <Dropdown overlay={menu}>
                        <MoreOutlined className='more-icon' />
                    </Dropdown>
                )}
            </div>
            {renderContent()}
        </StyledWrapper>
    )
}

export default ReviewCard
