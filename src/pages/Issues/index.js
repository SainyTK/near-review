import React, { useState } from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom'
import { Col, Row, Select, Typography } from 'antd';
import useProductOf from '../../states/useProductOf';
import useQuery from '../../hooks/useQuery';
import useProductIssues from '../../states/useProductIssue';
import IssueCard from '../../components/IssueCard';
import { Loading3QuartersOutlined } from '@ant-design/icons';

const StyledWrapper = styled.div`
    padding: 20px 10%;

    .review-item {
        margin-bottom: 12px;
    }

    .div {
        text-align: center;
        width: 100%;
    }

    .no-style {
        color: unset;
    }

`

const FILTER_OPTIONS = [
    { label: 'All', value: 'all' },
    { label: 'Opening', value: 'opening' },
    { label: 'Closed', value: 'closed' },
    { label: 'Win', value: 'win' }
]

const IssuesPage = () => {

    const seller = useQuery().get('seller')
    const productId = useQuery().get('productId')

    const { product } = useProductOf(seller, productId);
    const productName = product ? product.name : '';

    const { productIssues, isLoading, isError, onlyOpen, onlyClosed, onlyWin } = useProductIssues(seller, productId);
    let issues = productIssues;

    const [filter, setFilter] = useState('all');

    if (filter === 'opening')
        issues = onlyOpen(productIssues)
    else if (filter === 'closed')
        issues = onlyClosed(productIssues);
    else if (filter === 'win')
        issues = onlyWin(productIssues, window.accountId);

    const renderIssues = () => {
        if (isLoading) {
            return <Col span={24}><Loading3QuartersOutlined spin /></Col>
        } else if (isError) {
            return <Col span={24}>There is an error</Col>
        } else {
            return issues.map((issue, index) => (
                <Col key={index} span={24}>
                    <IssueCard issue={issue} />
                </Col>
            ))
        }
    }

    return (
        <StyledWrapper>
            <Row gutter={[10, 10]}>
                <Col md={24} lg={16}>
                    <Typography.Title level={3}>
                        <span>Issues on <Link to={`/products/${seller}/${productId}`}>{productName}</Link></span>
                    </Typography.Title>
                </Col>
                <Col md={24} lg={8}>
                    <Select className='select-filter' options={FILTER_OPTIONS} value={filter} onChange={v => setFilter(v)} />
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col md={24} lg={16}>
                    <Row gutter={[10, 10]}>
                        {renderIssues()}
                    </Row>
                </Col>
            </Row>
        </StyledWrapper>
    )
}

export default IssuesPage
