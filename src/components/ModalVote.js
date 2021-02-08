import React, { useEffect, useState } from 'react'
import { Input, Modal, notification, Radio, Select } from 'antd';
import styled from 'styled-components'
import useIssues from '..//states/useIssues';
import issueService from '../services/issueService';
import useOrders from '../states/useOrders';
import ipfs from '../ipfs';

const StyledWrapper = styled.div`
    .form-item {
        margin-bottom: 8px;
    }

    .input-amount {
        min-width: 120px;
    }

    .select {
        min-width: 200px;
    }
`

const ModalVote = ({ visibility, selectedIssue, ...props }) => {

    const [selectedOrder, setSelectedOrder] = useState(0);
    const [agree, setAgree] = useState(true);
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { issues, ...issuesState } = useIssues();
    const issue = issues ? issues[selectedIssue] : null;
    const maxVote = issue ? issue.maxVote : 0;

    const { orders, onlyPurchased } = useOrders();
    const target = (issue && orders) ? orders.find(o => o.orderId === issue.targetId) : null;
    const customerOrders = target ? orders.filter(o => o.seller === target.seller && o.productId === target.productId && o.customer === window.accountId) : [];
    const purchasedOrders = onlyPurchased(customerOrders);

    useEffect(() => {
        setAgree(props.agree);
    }, [props.agree]);

    const handleVote = async () => {
        setLoading(true);
        try {
            const res = await ipfs.uploadObject({ message })
            await issueService.vote(issue.issueId, selectedOrder, agree, res[0].hash, amount);
            notification['success']({
                message: 'Success',
                description: 'Vote successfully'
            })
            issuesState.update();
            visibility.hide();
        } catch (e) {
            notification['error']({
                message: 'Failed',
                description: e.message
            })
        }
        setLoading(false);
    }

    return (
        <Modal
            visible={visibility.visible}
            title="Vote Issue"
            onCancel={visibility.hide}
            onOk={handleVote}
            confirmLoading={loading}
        >
            <StyledWrapper>
                <div className='form-item'>
                    <p><b>Order</b></p>
                    <Select
                        className='select'
                        options={[{ label: 'None', value: -1 }, ...purchasedOrders.map((order, index) => ({ label: `id: ${order.orderId}`, value: order.orderId }))]}
                        onChange={val => setSelectedOrder(val)}
                        value={selectedOrder}
                    />
                </div>
                <div className='form-item'>
                    <p>Do you agree with this issue ?</p>
                    <Radio.Group value={agree} onChange={e => setAgree(e.target.value)}>
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                    </Radio.Group>
                </div>
                <div className='form-item'>
                    <p>Value (up to {maxVote} Ⓝ)</p>
                    <Input className='input-amount' value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <div className='form-item'>
                    <p>Message</p>
                    <Input.TextArea rows={3} value={message} onChange={e => setMessage(e.target.value)} />
                </div>
            </StyledWrapper>
        </Modal>
    )
}

export default ModalVote
