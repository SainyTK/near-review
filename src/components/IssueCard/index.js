import { Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatDate } from '../../common/format'
import useProfile from '../../states/useProfile'
import Button from '../Button'
import Author from '../ReviewCard/Author'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import useIssues from '../../states/useIssues'
import ModalReview from '../ModalReview';
import useVisibility from '../../hooks/useVisibility';
import useReview from '../../states/useReview';
import useReviews from '../../states/useReviews';
import ModalVote from '../ModalVote';
import { Link } from 'react-router-dom'

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

    .time, .result {
        font-size: .8em;
    }

    .voting {
        cursor: ${props => props.disableVote ? 'unset' : 'pointer'};
    }

    .result.win {
        color:  var(--green);
    }

    .result.lose {
        color:  var(--red);
    }
`

const IssueCard = ({ issue }) => {

    const issueId = issue ? issue.issueId : null;
    const issuer = issue ? issue.issuer : null;
    const targetId = issue ? issue.targetId : null;
    const voteYesList = issue ? issue.voteYesList : [];
    const voteNoList = issue ? issue.voteNoList : [];
    const voteYesMap = issue ? issue.voteYesMap : {};
    const voteNoMap = issue ? issue.voteNoMap : {};
    const deadline = issue ? issue.deadline : 0;
    const totalYes = issue ? issue.totalYes : 0;
    const totalNo = issue ? issue.totalNo : 0;
    const createdAt = issue ? issue.createdAt : 0;
    const message = voteYesMap[issuer] ? voteYesMap[issuer].message : '';

    const { profile } = useProfile(issuer);

    const { reviews } = useReviews();
    const review = reviews ? reviews[targetId] : null;

    const totalVoteYes = voteYesList.reduce((prev, cur) => prev + Number(cur.value), 0);
    const totalVoteNo = voteNoList.reduce((prev, cur) => prev + Number(cur.value), 0);

    const [now, setNow] = useState(new Date().valueOf());

    const reviewModal = useVisibility();
    const voteModal = useVisibility();

    const [agree, setAgree] = useState(true);

    let remainTime = '';
    const diff = deadline - now;
    const remainDay = Math.floor(diff / (24 * 60 * 60 * 1000));
    const remainHour = Math.floor(diff / (60 * 60 * 1000) % 24);
    const remainMinute = Math.floor(diff / (60 * 1000) % 60);
    const remainSecond = Math.floor(diff / (1000) % 60);

    const disableVote = diff <= 0;

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

    const voteYes = voteYesMap[accountId] ? voteYesMap[accountId].value : 0
    const voteNo = voteNoMap[accountId] ? voteNoMap[accountId].value : 0

    let result = '';
    if (totalYes > totalNo) {
        if (voteYes >= 0) result = 'Win';
        else if (voteNo >= 0) result = 'Lose';
    } else if (totalYes < totalNo) {
        if (voteNo >= 0) result = 'Win';
        else if (voteYes >= 0) result = 'Lose';
    } else {
        if (voteYes >= 0 || voteNo >= 0) result = 'Draw';
        else result = 'Closed';
    }

    useEffect(() => {
        let iv = setInterval(() => {
            setNow(new Date().valueOf());
        }, 1000);

        return () => clearInterval(iv);
    }, [issue]);

    const handleVote = (agree) => {
        if (true) {
            if (agree) {
                setAgree(true);
                voteModal.show();
            } else {
                setAgree(false);
                voteModal.show();
            }
        }
    }

    return (
        <div>
            <Link to={`/issues/${issueId}`} className='no-style'>
                <StyledWrapper disableVote={disableVote}>
                    <div className='top-section'>
                        <Author {...profile} />
                        <Button onClick={e => { e.preventDefault(); reviewModal.show(); }}>See review</Button>
                    </div>
                    <Typography.Text type='secondary' className='time'>Issue opened on {formatDate(createdAt)}</Typography.Text>
                    <pre>{message}</pre>
                    <div className='bottom-action'>
                        <Space>
                            <Space className='voting' onClick={(e) => { e.preventDefault(); handleVote(true) }}>
                                <ArrowUpOutlined className='vote-up-icon' />
                                <b>{totalVoteYes} Ⓝ </b>
                                <div>agreed ({voteYesList.length} people) </div>
                            </Space>
                            <Space className='voting' onClick={(e) => { e.preventDefault(); handleVote(false) }}>
                                <ArrowDownOutlined className='vote-down-icon' />
                                <b>{totalVoteNo} Ⓝ </b>
                                <div>disagreed ({voteNoList.length} people) </div>
                            </Space>
                        </Space>
                        {
                            diff > 0 && (
                                <div className='time'>
                                    Issue will be closed in {remainTime}
                                </div>
                            )
                        }
                        {
                            diff <= 0 && (
                                <div className={`result ${result.toLowerCase()}`}>
                                    {result}
                                </div>
                            )
                        }

                    </div>
                </StyledWrapper>
            </Link>
            <>
                <ModalReview visibility={reviewModal} review={review} />
                <ModalVote visibility={voteModal} selectedIssue={issueId} agree={agree} />
            </>
        </div>

    )
}

export default IssueCard
