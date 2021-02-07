import { Avatar } from 'antd'
import React from 'react'
import useProfile from '../../states/useProfile'
import avatarImg from '../../assets/images/avatar.jpg';

const UserAvatar = ({ accountId, ...props }) => {

    const { profile } = useProfile(accountId);
    const imageUrl = profile ? profile.imageUrl : null;

    return (
        <Avatar src={imageUrl || avatarImg} {...props} />
    )
}

export default UserAvatar
