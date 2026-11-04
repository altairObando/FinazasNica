import { JoinWithCode } from '@/components/Account/JoinWithCode';
import { NewTeamForm } from '@/components/Account/NewTeamForm';
import { JoinWithCodeRequest, NewTeamRequest } from '@/interfaces/Profile/Team';
import { teamService } from '@/lib/teamService';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Surface, useTheme } from 'react-native-paper';

type OptionSelected = 'NEW' | 'CODE'

export default function AccountWizard(){
    const theme = useTheme();
    const [ optionSelected, setOptionSelected ] = useState<OptionSelected>('NEW');
    const [ loading, setLoading ] = useState(false);
    const Form = optionSelected === 'NEW' ? NewTeamForm : JoinWithCode;
    
    const onSubmitForm = async( values: NewTeamRequest | JoinWithCodeRequest )=>{
        try {
            if( loading ) return;
            setLoading(true);
            let response = null;

            if( 'teamCode' in values ){
                response = await teamService.joinToTeam( values );
            } else 
                response = await teamService.startTeam( values );
            console.log(response);
            if( response != null ){
                console.log(response);
            }
        } catch (error) {
            console.log('submit', error instanceof Error ? error.message:  'no identificado');
        } finally {
            setLoading(false);
        }
    }

    return <KeyboardAvoidingView 
        style={{ flex: 1, backgroundColor: theme.colors.background }} 
        behavior={ Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={ Platform.OS === 'ios' ? 64 : 0 }>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <Surface style={[ styles.container ]}>                        
                        <View style={[ styles.rowContainer, { backgroundColor: theme.colors.background }]}>
                            <Button icon='plus-circle' mode={ optionSelected === 'NEW' ? 'contained': 'text' } onPress={()=>setOptionSelected('NEW')} disabled={loading}>
                                Crear Nuevo
                            </Button>
                            <Button icon='key' mode={ optionSelected === 'CODE' ? 'contained': 'text' } onPress={()=>setOptionSelected('CODE')} disabled={loading}>
                                Tengo un codigo
                            </Button>
                        </View>        
                        <View style={[ styles.formContainer, { backgroundColor: theme.colors.background }]}>
                            <Form onSubmit={ onSubmitForm } parentLoading={ loading } />
                        </View>
                    </Surface>
                </ScrollView>
            </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
        
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        gap: 10,
    },
    rowContainer : {
        flexDirection: 'row', 
        gap: 20,
        padding: 10,
        borderRadius: 15,
        alignItems: 'center', 
        justifyContent:'space-between'
    },
    formContainer: {
        padding: 10,
        borderRadius: 15,
        gap: 15
    }
})