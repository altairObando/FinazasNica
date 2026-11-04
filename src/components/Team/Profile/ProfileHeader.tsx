import React from 'react';
import { View } from 'react-native';
import { Avatar, Chip, Icon, IconButton, List, Text, useTheme } from 'react-native-paper';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';

type ProfileHeaderProps = {
    name: string,
    isOwner: boolean,
    image?: string | undefined | null,
    onEditPress?: ()=> void,
}

export const ProfileHeader=( { name, isOwner, image, onEditPress }: ProfileHeaderProps)=>{
    const theme = useTheme();
    const onButtonPress =()=>{
        if(typeof onEditPress === 'function')
            onEditPress();
    }
    const renderTitle=({ fontSize }: { fontSize: number }): React.ReactNode | undefined =>{
        return <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'space-between' }}>
            <Text style={{ fontSize: fontSize, fontWeight: 'bold'}} >{ name }</Text>
            <IconButton icon='pencil-outline' onPress={ onButtonPress } mode='contained'/>
        </View>
    }
    const renderAvatar=( props: { color: string, style: Style }): React.ReactNode =>{
        if( !image || image === null )
            return <Avatar.Icon {...props } icon='account-circle-outline' color='#fff' />
        return <Avatar.Image source={{ uri: image! }} style={ props.style } />
    }
    const renderDescription=(): React.ReactNode | undefined=>{
        const description = isOwner ? 'Administrador del Hogar': 'Miembro'
        return <Chip icon={ props => <Icon {...props } source={'information'} color={theme.colors.onPrimary} />}  textStyle={{ fontWeight: 'bold', color: theme.colors.onPrimary }} style={{ backgroundColor: theme.colors.primary }}>
            {description}
        </Chip>
    }

    return <List.Item
        title={ props => renderTitle(props) }
        description={ ()=> renderDescription() }
        left={ renderAvatar }
    />
}