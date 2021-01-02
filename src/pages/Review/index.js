import { Button, Input, Rate, Space, Typography, Upload, Modal, Row, Col, notification } from 'antd';
import React, { useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useQuery from '../../hooks/useQuery';
import useProductOf from '../../states/useProductOf';
import { PlusOutlined } from '@ant-design/icons';
import MultiInput from './components/MultiInput';
import ipfs from '../../ipfs';
import reviewService from '../../services/reviewService';

const StyledWrapper = styled.div`
    padding: 20px 10%;

    .input-item {
        margin-bottom: 10px;
        display: flex;

        input.with-btn {
            flex: 1;
            margin-right: 8px;
        }
    }

    .action {
        display: flex;
        justify-content: flex-end;
    }

    .content {
    }
`

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const ReviewPage = () => {

    const params = useParams();
    const query = useQuery();

    const history = useHistory();
    const { search } = params;
    const [seller, productId] = search.split('-');
    const orderId = query.get('orderId');

    const productState = useProductOf(seller, productId);
    const { product } = productState;

    const [score, setScore] = useState(5);
    const [pros, setPros] = useState(['']);
    const [cons, setCons] = useState(['']);
    const [content, setContent] = useState('');
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [preview, setPreview] = useState({
        visible: false,
        image: '',
        title: '',
    })

    const handlePost = async () => {
        setLoading(true);
        try {
            let images = [];
            if (fileList.length > 0) {
                const promises = fileList.map((item) => ipfs.uploadImage(item.file));
                const hashList = await Promise.all(promises);
                images = hashList.map(hash => ipfs.hashToUrl(hash));
            }

            const data = {
                score,
                pros,
                cons,
                content,
                images
            };

            const res = await ipfs.uploadObject(data);
            const result = reviewService.postReview(+orderId, res[0].hash);

            notification['success']({
                message: 'Success',
                description: 'Post review successfully'
            });

            history.replace(`/products/${search}`);
        } catch (e) {
            notification['error']({
                message: 'Failed',
                description: e.message
            })
        }
        setLoading(false);
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreview({
            image: file.url || file.preview,
            visible: true,
            title: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    }


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const render = () => {
        if (productState.isLoading) {
            return <div>Loading...</div>
        } else if (productState.isError) {
            return <div>There is an error</div>
        } else {

            return (
                <div>
                    <Typography.Title level={3}>Review on <Link to={`/products/${search}`}>{product.name}</Link></Typography.Title>
                    <Row>
                        <Col md={24} lg={12}>
                            <div className='content'>
                                <div style={{ marginBottom: 10 }}>
                                    <Typography.Title level={4}>Rating</Typography.Title>
                                    <div>
                                        <Rate
                                            value={score}
                                            onChange={v => setScore(v)}
                                            allowHalf
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <Typography.Title level={4}>Pros</Typography.Title>
                                    <MultiInput value={pros} onChange={v => setPros(v)} placeholder='Tell about something you love' />
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <Typography.Title level={4}>Cons</Typography.Title>
                                    <MultiInput value={cons} onChange={v => setCons(v)} placeholder="Tell about something you don't like" />
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <Typography.Title level={4}>Your Reviews</Typography.Title>
                                    <Input.TextArea
                                        rows={5}
                                        placeholder='Describe your experience'
                                        onChange={e => setContent(e.target.value)}
                                    />
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <Typography.Title level={4}>Photos</Typography.Title>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        beforeUpload={file => {
                                            getBase64(file).then(url => {
                                                setFileList(fileList => {
                                                    return [...fileList, { ...file, file, name: file.name, url }]
                                                })
                                            });
                                            return false
                                        }}
                                        onRemove={file => {
                                            const index = fileList.indexOf(file);
                                            const newFileList = fileList.slice();
                                            newFileList.splice(index, 1);
                                            setFileList([...newFileList]);
                                        }}
                                        onPreview={handlePreview}
                                    >
                                        {fileList.length >= 8 ? null : uploadButton}
                                    </Upload>
                                </div>
                                <div className='action'>
                                    <Space>
                                        <Button onClick={() => history.push(`/products/${search}`)}>Cancel</Button>
                                        <Button type='primary' onClick={handlePost} loading={loading}>Post</Button>
                                    </Space>
                                </div>
                                <Modal
                                    visible={preview.visible}
                                    title={preview.title}
                                    footer={null}
                                    onCancel={() => setPreview({ ...preview, visible: false })}
                                >
                                    <img style={{ width: '100%' }} src={preview.image} />
                                </Modal>
                            </div>
                        </Col>
                        <Col md={0} lg={12}>

                        </Col>
                    </Row>
                </div>


            )
        }
    }

    return (
        <StyledWrapper>
            {render()}
        </StyledWrapper>
    )
}

export default ReviewPage
