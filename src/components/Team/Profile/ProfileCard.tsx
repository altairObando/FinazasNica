import { useAppProvider } from '@/hooks/useAppProvider';
import React from 'react';
import { Card } from 'react-native-paper';
import { ProfileForm } from './ProfileForm';
import { ProfileHeader } from './ProfileHeader';

export const ProfileCard=()=>{
    const { user } = useAppProvider();
    const isOwner = user?.team_code != null;
    return <Card contentStyle={{ padding: 10 }}>
        <ProfileHeader 
            key={ `user-info-${user?.id}` }
            name={`${ user?.name?? ''} ${ user?.surname ?? ''}`.trim() }
            isOwner={ isOwner } />
        <ProfileForm 
            key={ `user-form-${ user?.id }` } 
            userEmail={ user?.email ?? '' } 
            userPhone={ user?.phone ?? ''} />
    </Card>
}