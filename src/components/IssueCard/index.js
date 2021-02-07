import { Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatDate } from '../../common/format'
import useProfile from '../../states/useProfile'
import Button from '../Button'
import Author from '../ReviewCard/Author'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

const StyledWrapper = styled.div`
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    width: 100%;

    .top-section, .bottom-action {
        display: flex;
        justify-content: space-between;
    }

    .botton-action {
        align-items: flex-end;
    }

    .vote-up-icon {
        color: var(--green);
    }

    .vote-down-icon {
        color: var(--red);
    }

    .time {
        font-size: .8em;
    }

    .voting {
        cursor: pointer;
    }
`

const IssueCard = ({ issue, onVoteYes, onVoteNo, onOpenReview }) => {

    const { profile } = useProfile(issue.issuer);

    const voteYesList = Object.values(issue.voteYesMap)
    const voteNoList = Object.values(issue.voteNoMap)
    const totalVoteYes = voteYesList.reduce((prev, cur) => prev + Number(cur.value), 0);
    const totalVoteNo = voteNoList.reduce((prev, cur) => prev + Number(cur.value), 0);

    const [now, setNow] = useState(new Date().valueOf());

    let remainTime = '';
    const diff = issue.deadline - now;
    const remainDay = Math.floor(diff / (24 * 60 * 60 * 1000));
    const remainHour =  Math.floor(diff / (60 * 60 * 1000) % 24);
    const remainMinute =  Math.floor(diff / (60 * 1000) % 60);
    const remainSecond =  Math.floor(diff / (1000) % 60);

    if (remainDay > 0)
        remainTime = `${remainDay} day `;
    if (diff >= 60 * 60 * 1000)
        remainTime += `${remainHour} hours `;
    if (diff >= 60 * 1000)
        remainTime += `${remainMinute} minutes `;
    if (diff >= 1000)
        remainTime += `${remainSecond} seconds`;
    else
        remainTime = `0 seconds`;

    useEffect(() => {
        let iv = setInterval(() => {
            setNow(new Date().valueOf());
        }, 1000);

        return () => clearInterval(iv);
    }, [issue]);

    return (
        <StyledWrapper>
            <div className='top-section'>
                <Author {...profile} />
                <Button onClick={onOpenReview}>See review</Button>
            </div>
            <Typography.Text type='secondary' className='time'>Issue opened on {formatDate(issue.createdAt)}</Typography.Text>
            <pre>{issue.voteYesMap[issue.issuer].message}</pre>
            <div className='bottom-action'>
                <Space>
                    <Space className='voting' onClick={onVoteYes}>
                        <ArrowUpOutlined className='vote-up-icon' />
                        <b>{totalVoteYes} Ⓝ </b>
                        <div>agreed ({voteYesList.length} people) </div>
                    </Space>
                    <Space className='voting' onClick={onVoteNo}>
                        <ArrowDownOutlined className='vote-down-icon' />
                        <b>{totalVoteNo} Ⓝ </b>
                        <div>disagreed ({voteNoList.length} people) </div>
                    </Space>
                </Space>
                <div className='time'>
                    Issue will be closed in {remainTime}
                </div>
            </div>
        </StyledWrapper>
    )
}

export default IssueCard
