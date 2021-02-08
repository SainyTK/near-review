import React from 'react'
import { Modal } from 'antd';
import ReviewCard from './ReviewCard';

const ModalReview = ({ visibility, review }) => {
    return (
        <Modal
            visible={visibility.visible}
            onCancel={visibility.hide}
            footer={null}
            title="Preview review"
            closeIcon={null}
        >
            <ReviewCard review={review} />
        </Modal>
    )
}

export default ModalReview
