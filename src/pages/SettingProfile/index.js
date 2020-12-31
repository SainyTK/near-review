import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { Divider, Space, Row, Col, Button, DatePicker, Input, notification } from 'antd';
import SelectImage from '../../components/SelectImage';
import ipfs from '../../ipfs';
import Avatar from 'antd/lib/avatar/avatar';
import placeholderImage from '../../assets/images/avatar.jpg';
import userService from '../../services/userService';
import useProfile from '../../states/useProfile';
import moment from 'moment';
import { Link } from 'react-router-dom';

const StyledWrapper = styled.div`
    padding: 20px 20%;

    .main {
        padding: 20px;
        background-color: white;
        box-shadow: 0 0 3px 0 rgba(0,0,0,.15);
    }
    
    .input {
        width: 100%;
        max-width: 300px;
    }

    .select-image {
        margin-right: 16px;
    }

    .bottom-action {
        display: flex;
        justify-content: flex-end;
    }
`

const SettingProfilePage = (props) => {

    const { profile } = useProfile(window.accountId);

    const [user, setUser] = useState({
        firstname: profile ? profile.firstname || '' : '',
        lastname: profile ? profile.lastname || '' : '',
        imageUrl: profile ? profile.imageUrl || '' : '',
        dateOfBirth: profile ? profile.dateOfBirth || 0 : 0,
        city: profile ? profile.city || '' : '',
        job: profile ? profile.job || '' : '',
        biography: profile ? profile.biography || '' : '',
        facebook: profile ? profile.facebook || '' : '',
        instagram: profile ? profile.instagram || '' : '',
        twitter: profile ? profile.twitter || '' : '',
        telegram: profile ? profile.telegram || '' : ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            user.firstname = profile.firstname || user.firstname;
            user.lastname = profile.lastname || user.lastname;
            user.imageUrl = profile.imageUrl || user.imageUrl;
            user.dateOfBirth = profile.dateOfBirth || user.dateOfBirth;
            user.city = profile.city || user.city;
            user.job = profile.job || user.job;
            user.biography = profile.biography || user.biography;
            user.facebook = profile.facebook || user.facebook;
            user.instagram = profile.instagram || user.instagram;
            user.twitter = profile.twitter || user.twitter;
            user.telegram = profile.telegram || user.telegram;
            setUser({ ...user });
        }
    }, [profile]);

    const hasChanged = () => {
        const stateArr = Object.entries(user);
        for (let i = 0; i < stateArr.length; i++) {
            const [key, value] = stateArr[i];
            if (props[key] !== value)
                return true;
        }
        return false;
    }

    const handleChangeImage = (file) => {
        if (file) {
            setUser({ ...user, imageUrl: URL.createObjectURL(file) });
            setImageFile(file);
        }
    }

    const handleConfirm = async () => {
        setLoading(true);
        if (imageFile) {
            const res = await ipfs.uploadImage(imageFile);
            user.imageUrl = ipfs.hashToUrl(res);
        }
        try {
            const dto = { ...user }
            if (user.dateOfBirth)
                dto.dateOfBirth = moment(user.dateOfBirth).toISOString();
            const res = await ipfs.uploadObject(dto);
            console.log(res);
            await userService.updateProfile(res[0].hash);
            notification['success']({
                message: 'Success',
                description: 'Update profile successfully'
            })
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <StyledWrapper>
            <div className='main'>
                <h2>Edit profile</h2>
                <Divider />

                <Row className='row'>
                    <Col span={8}>
                        <b>Avatar</b>
                    </Col>
                    <Col span={16}>
                        <Space align='center'>
                            <SelectImage
                                className='select-image'
                                value={user.imageUrl}
                                onChange={handleChangeImage}
                            >
                                <Avatar size={80} src={user.imageUrl || placeholderImage} />
                            </SelectImage>
                            <label htmlFor='choose-file'>
                                <div className='btn-div'>Choose file</div>
                            </label>
                            <input id='choose-file' type='file' hidden accept='image/*' onChange={e => handleChangeImage(e.target.files[0])} />
                        </Space>
                    </Col>
                </Row>
                <Divider />

                <Row>
                    <Col span={8}>
                        <b>General Info</b>
                    </Col>
                    <Col span={16}>
                        <Row gutter={[16, 16]}>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>First name</b></div>
                                <Input value={user.firstname} className='input' onChange={e => setUser({ ...user, firstname: e.target.value })} />
                            </Col>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>Last name</b></div>
                                <Input value={user.lastname} className='input' onChange={e => setUser({ ...user, lastname: e.target.value })} />
                            </Col>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>Date of birth</b></div>
                                <DatePicker value={user.dateOfBirth ? moment(user.dateOfBirth) : null} className='input date-input' onChange={value => setUser({ ...user, dateOfBirth: value })} />
                            </Col>
                            <Col md={0} lg={12}></Col>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>City</b></div>
                                <Input value={user.city} className='input' onChange={e => setUser({ ...user, city: e.target.value })} />
                            </Col>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>Job</b></div>
                                <Input value={user.job} className='input' onChange={e => setUser({ ...user, job: e.target.value })} />
                            </Col>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>Biography</b></div>
                                <Input.TextArea value={user.biography} rows={5} className='input' onChange={e => setUser({ ...user, biography: e.target.value })} />
                            </Col>
                            <Col md={0} lg={12}></Col>
                        </Row>
                    </Col>
                </Row>
                <Divider />

                <Row>
                    <Col span={8}>
                        <b>Social Media</b>
                    </Col>
                    <Col span={16}>
                        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>Facebook</b></div>
                                <Input value={user.facebook} className='input' onChange={e => setUser({ ...user, facebook: e.target.value })} />
                            </Col>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>Instagram</b></div>
                                <Input value={user.instagram} className='input' onChange={e => setUser({ ...user, instagram: e.target.value })} />
                            </Col>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>Twitter</b></div>
                                <Input value={user.twitter} className='input' onChange={e => setUser({ ...user, twitter: e.target.value })} />
                            </Col>
                            <Col md={24} lg={12}>
                                <div style={{ marginBottom: 8 }}><b>Telegram</b></div>
                                <Input value={user.telegram} className='input' onChange={e => setUser({ ...user, telegram: e.target.value })} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Divider />

                <div className='bottom-action'>
                    <Space>
                        <Link to='/profile'>
                            <Button type='dashed'>Cancel</Button>
                        </Link>
                        <Button type='primary' onClick={handleConfirm} loading={loading} disabled={!hasChanged()}>
                            Update
                        </Button>
                    </Space>
                </div>
            </div>
        </StyledWrapper>
    )
}

export default SettingProfilePage
