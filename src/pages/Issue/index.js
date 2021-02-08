import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom'
import { Button, Col, notification, Row, Select, Typography } from 'antd';
import useProfile from '../../states/useProfile';
import useProductOf from '../../states/useProductOf';
import useIssues from '../../states/useIssues';
import useOrders from '../../states/useOrders';
import IssueCard from '../../components/IssueCard';
import VoteContent from '../../components/VoteContent';
import winSvg from '../../assets/images/win.svg';
import loseSvg from '../../assets/images/lose.svg';
import issueService from '../../services/issueService';
import useBalance from '../../states/useBalance';

const StyledWrapper = styled.div`
    padding: 20px 10%;

    .review-item {
        margin-bottom: 12px;
    }

    .div {
        text-align: center;
        width: 100%;
    }

    .vote-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .issue-card {
        margin-bottom: 10px;
    }

    .result-card  {
        padding: 20px;
        background-color: white;
        box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
    }

    .result-vector {
        width: 100%;
    }

`

const FILTER_OPTIONS = [
    { label: 'All', value: 'all' },
    { label: 'Agree', value: 'agree' },
    { label: 'Disagree', value: 'disagree' }
]

const IssuePage = () => {

    const params = useParams();
    const { issueId } = params;

    const { issues, ...issuesState } = useIssues();
    const issue = issues ? issues[issueId] : null;
    const issuer = issue ? issue.issuer : null;
    const voteYesList = issue ? issue.voteYesList : [];
    const voteNoList = issue ? issue.voteNoList : [];
    const voteYesMap = issue ? issue.voteYesMap : {};
    const voteNoMap = issue ? issue.voteNoMap : {};
    const totalYes = issue ? issue.totalYes : 0;
    const totalNo = issue ? issue.totalNo : 0;
    const deadline = issue ? issue.deadline : 0;
    const voteYes = voteYesMap[accountId] ? voteYesMap[accountId].value : 0
    const voteNo = voteNoMap[accountId] ? voteNoMap[accountId].value : 0

    const { orders } = useOrders();
    const order = (orders && issue) && orders[issue.targetId];
    const seller = order ? order.seller : null;
    const productId = order ? order.productId : null;

    const rewardOrder = (orders && issue) && orders[issue.additionalReward];
    const additionalReward = rewardOrder ? rewardOrder.reviewValue : 0;

    const { product } = useProductOf(seller, productId);
    const productName = product ? product.name : '';

    const { profile } = useProfile(issuer);
    const firstname = profile ? profile.firstname : null;
    const lastname = profile ? profile.lastname : null;
    const displayName = (firstname && lastname) ? `${firstname} ${lastname}` : issuer;

    const balanceState = useBalance(window.accountId);

    const [now, setNow] = useState(new Date().valueOf());
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);

    let displayVote = [...voteYesList, ...voteNoList];
    if (filter === 'agree')
        displayVote = voteYesList;
    else if (filter === 'disagree')
        displayVote = voteNoList;

    const closed = now > deadline;
    const issueResult = totalYes > totalNo ? `Issuer won the issue. The review has been unused` : `Issuer didn't win the issue. The review is still appeared`

    let canGetReward = false;
    let participated = voteYes >= 0 || voteNo >= 0;
    let voteResult = '';
    let reward = 0;

    if (totalYes > totalNo) {
        if (voteYes >= 0) {
            canGetReward = true;
            reward = voteYes + (voteYes / totalYes) * (totalNo + additionalReward);
            voteResult = 'You won the issue';
        } else if (voteNo >= 0) {
            voteResult = 'You lose the issue';
        }
    } else if (totalYes < totalNo) {
        if (voteNo >= 0) {
            canGetReward = true;
            reward = voteNo + (voteNo / totalNo) * (totalYes + additionalReward);
            voteResult = 'You won the issue';
        } else if (voteYes >= 0) {
            voteResult = 'You lose the issue';
        }
    } else if (participated) {
        canGetReward = true;
        reward = voteYes + voteNo + ((voteYes + voteNo) / (totalYes + totalNo)) * (additionalReward);
        voteResult = 'The issue is neutral';
    }

    let gotReward = false;
    // if (voteNoMap[accountId])
    //     gotReward = voteNoMap[accountId].gotReward;
    // else if (voteYesMap[accountId])
    //     gotReward = voteYesMap[accountId].gotReward;


    useEffect(() => {
        const iv = setInterval(() => {
            setNow(new Date().valueOf());
        }, 1000);
        return () => clearInterval(iv);
    })

    const handleGetReward = async () => {
        setLoading(true);
        try {
            await issueService.getReward(issueId);
            issuesState.update();
            balanceState.update();
            notification['success']({
                message: 'Success',
                description: 'Get reward successfully'
            })
        } catch (e) {
            notification['error']({
                message: 'Failed',
                description: e.message
            })
        }
        setLoading(false);
    }

    return (
        <StyledWrapper>
            <Typography.Title level={3}>
                <span>Issues on <Link to={`/products/${seller}/${productId}`}>{productName}</Link></span>
                <span> by <Link to={`/profile/${issuer}`}>{displayName}</Link></span>
            </Typography.Title>
            <Row gutter={[24, 24]}>
                <Col md={24} lg={14}>
                    <div className='issue-card'>
                        <IssueCard issue={issue} />
                    </div>
                    <div className='vote-title'>
                        <Typography.Title level={3}>Votes {displayVote.length}</Typography.Title>
                        <Select style={{minWidth: 100}} options={FILTER_OPTIONS} value={filter} onChange={v => setFilter(v)} />
                    </div>
                    <div>
                        {
                            displayVote.map((vote, index) => <VoteContent key={index} vote={vote} />)
                        }
                    </div>
                </Col>
                <Col md={24} lg={10}>
                    {
                        closed && (
                            <div className='result-card'>
                                <Row gutter={[10, 10]}>
                                    <Col span={12}>
                                        <Typography.Title level={3}>Result</Typography.Title>
                                        <p>{issueResult}</p>
                                        {participated && <p>{voteResult}</p>}
                                        {canGetReward && (
                                            <Button
                                                type='primary'
                                                onClick={handleGetReward}
                                                disabled={gotReward}
                                                loading={loading}
                                            >
                                                Get {reward} Ⓝ prizes
                                            </Button>
                                        )}
                                    </Col>
                                    <Col span={12}>
                                        <img className='result-vector' src={(canGetReward || totalYes > totalNo) ? winSvg : loseSvg} />
                                    </Col>
                                </Row>
                            </div>
                        )
                    }
                </Col>
            </Row>

        </StyledWrapper>
    )
}

export default IssuePage