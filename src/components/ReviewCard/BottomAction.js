import React from 'react'
import styled from 'styled-components'
import { LikeOutlined, CommentOutlined, FlagOutlined, CheckOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';

const { Text } = Typography;

const StyledWrapper = styled.div`
    display: flex;
    justify-content: space-between;

    .like-btn {
        cursor: pointer;
        transition: .2s ease-in-out;
        transform: scale(1);
    }
    .like-btn:hover {
        transform: scale(1.2);
        * {
            color: blue;
        }
    }

    .comment-btn {
        cursor: pointer;
        transition: .2s ease-in-out;
        transform: scale(1);
    }
    .comment-btn:hover {
        transform: scale(1.2);
        * {
            color: blue;
        }
    }
`

const BottomAction = (props) => {

    const { review } = props;
    const likes = review ? review.likes : [];

    return (
        <StyledWrapper>
            <Space>
                <Space className={'like-btn'} onClick={props.onLike}>
                    <LikeOutlined />
                    <Text>{likes.length}</Text>
                </Space>
                <Space className={'comment-btn'}>
                    <CommentOutlined />
                    <Text>20</Text>
                </Space>
            </Space>
            <Space>
                <Space className={'open-issue-btn'}>
                    <Text>Open Issue</Text>
                    <FlagOutlined />
                </Space>
                <Space className={'blockchain-btn'}>
                    <Text>Blockchain</Text>
                    <CheckOutlined />
                </Space>
            </Space>
        </StyledWrapper>
    )
}

export default BottomAction
