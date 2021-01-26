import React from 'react'
import styled from 'styled-components'
import Author from './Author';
import { MoreOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Rate, Space, Typography } from 'antd';
import Gallery from '../Gallery';
import useProfile from '../../states/useProfile'
import BottomAction from './BottomAction';

const { Text, Title } = Typography;

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
`

const ReviewCard = (props) => {

    const { review } = props;

    const customer = review ? review.customer : '';
    const score = review ? review.score : 0;
    const content = review ? review.content : '';
    const pros = review ? review.pros : [];
    const cons = review ? review.cons : [];
    const reviewedAt = review ? review.reviewedAt : 0;
    const images = review ? review.images : [];

    const { profile, isLoading } = useProfile(customer);

    const postDate = new Date(reviewedAt).toLocaleDateString('en-EN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <StyledWrapper>
            <div className='top'>
                <Author className='review-author' {...profile} />
                <MoreOutlined />
            </div>
            <div className='rating-container'>
                <Space>
                    <Rate value={score} allowHalf disabled />
                    <Text type='secondary' className='date'>{postDate}</Text>
                </Space>
            </div>
            <div>
                <Text>{content}</Text>
            </div>
            <div>
                <Title level={5}>Pros & Cons</Title>
                <div>
                    {
                        pros.map((pro, index) => (
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
                        cons.map((con, index) => (
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
                images.length > 0 && (
                    <div className='media-container'>
                        <Title level={5}>Medias</Title>
                        <Gallery images={images} />
                    </div>
                )
            }

            <BottomAction
                review={review}
                onLike={props.onLike}
            />
        </StyledWrapper>
    )
}

export default ReviewCard
