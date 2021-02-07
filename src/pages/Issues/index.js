import React, { useState } from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom'
import { Col, Row, Typography } from 'antd';
import useProductOf from '../../states/useProductOf';
import useQuery from '../../hooks/useQuery';
import useProductIssues from '../../states/useProductIssue';
import IssueCard from '../../components/IssueCard';
import ModalReview from './components/ModalReview';
import useVisibility from '../../hooks/useVisibility';
import useReview from '../../states/useReview';
import useReviews from '../../states/useReviews';
import ModalVote from './components/ModalVote';

const StyledWrapper = styled.div`
    padding: 20px 10%;

    .review-item {
        margin-bottom: 12px;
    }

    .div {
        text-align: center;
        width: 100%;
    }

`

const IssuesPage = () => {

    const seller = useQuery().get('seller')
    const productId = useQuery().get('productId')

    const { product } = useProductOf(seller, productId);
    const productName = product ? product.name : '';

    const { productIssues, onlyOpen } = useProductIssues(seller, productId);
    const issues = onlyOpen(productIssues);

    const reviewModal = useVisibility();
    const voteModal = useVisibility();
    const { reviews } = useReviews();

    const [selectedReview, setSelectedReview] = useState(-1);
    const [selectedIssue, setSelectedIssue] = useState(-1);
    const [agree, setAgree] = useState(true);

    const handleOpenReview = (orderId) => {
        setSelectedReview(orderId)
        reviewModal.show();
    }

    const handleOpenVote = (issueId, agree) => {
        setSelectedIssue(issueId);
        setAgree(agree);
        voteModal.show();
    }

    return (
        <StyledWrapper>
            <Typography.Title level={3}>
                <span>Issues on <Link to={`/products/${seller}/${productId}`}>{productName}</Link></span>
            </Typography.Title>
            <Row gutter={[24, 24]}>
                <Col md={24} lg={16}>
                    <Row gutter={[10, 10]}>
                        {
                            issues.map((issue, index) => (
                                <Col key={index} span={24}>
                                    <IssueCard
                                        issue={issue}
                                        onVoteYes={() => handleOpenVote(issue.issueId, true)}
                                        onVoteNo={() => handleOpenVote(issue.issueId, false)}
                                        onOpenReview={() => handleOpenReview(issue.targetId)}
                                    />
                                </Col>
                            ))
                        }
                    </Row>
                </Col>
            </Row>
            <ModalReview visibility={reviewModal} review={reviews[selectedReview]}/>
            <ModalVote visibility={voteModal} selectedIssue={selectedIssue} agree={agree}/>
        </StyledWrapper>
    )
}

export default IssuesPage
