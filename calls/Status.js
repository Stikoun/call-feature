import React from 'react';
import {FormattedMessage} from 'react-intl';
import {FormSpy} from 'react-final-form';
// store
import {CallErrors, CallStore} from 'store/call';
// actions
import {handleCall} from 'actions/call';
// ui
import NumberTypeIcon from 'components/ui/NumberTypeIcon';
import CallAvatar from 'components/modules/calls/Avatar';
import CallDuration from 'components/modules/calls/Duration';
import ActionButton from 'components/modules/calls/ActionButton';
import FormError, {FormErrorC} from 'components/ui/FormError';
// mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography' ;
// icons
import AnswerIcon from '@mui/icons-material/PhoneInTalk';
import RejectIcon from '@mui/icons-material/CallEnd';
import HoldIcon from '@mui/icons-material/Pause';
import ResumeIcon from '@mui/icons-material/PlayArrow';


/**
 * Renders call information and actions
 */
export default function CallStatus(props) {
    const {inDialog = false} = props;
    // store
    const {callState, activeCall, callError} = CallStore.useState(store => ({
        callState: store.callState,
        activeCall: store.activeCall,
        callError: store.callError
    }));

    return <React.Fragment>
        <Box sx={{maxWidth: theme => theme.spacing(30), mx: 'auto', my: 3}}>
            <CallAvatar animate={callState === 'alerting'} disabled={['holding', 'closed'].includes(callState)} />
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {['alerting', 'connected', 'calling', 'holding'].includes(callState) && activeCall
                ? <React.Fragment>
                    <Typography color='primary.main'>
                        <FormattedMessage id={`calls.call.${callState}`} />
                    </Typography>
                    {activeCall.startTime && <Typography color='primary.main' sx={{fontSize: theme => theme.spacing(3.75), mb: 2}}>
                        <CallDuration startTime={activeCall.startTime} />
                    </Typography>}
                    {activeCall.remotePartyDisplayName && <Typography color='snomGrey.dark_alt' variant='h4'>
                        {activeCall.remotePartyDisplayName}
                    </Typography>}
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                        {activeCall.remoteContactNumberType > 0
                            && <NumberTypeIcon
                                type={activeCall.remoteContactNumberType}
                                sx={{color: 'snomGrey.midGrey_alt'}}
                            />
                        }
                        <Typography color='snomGrey.dark_alt' variant='h5'>
                            {activeCall.remotePartyDisplayNumber || activeCall.remoteUri}
                        </Typography>
                    </Box>
                    {callError && <FormErrorC
                        formSpyProps={{submitError: `calls.error.${CallErrors[callError]}`}}
                        onHide={() => CallStore.update(store => {store.callError = null;})}
                        sx={{my: 0}}
                    />}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2}}>
                        {callState === 'alerting' && <ActionButton
                            color='secondary' variant='contained'
                            action='answer'
                            onClick={() => handleCall('acceptCall', {callId: activeCall.callId})}
                        >
                            <AnswerIcon />
                        </ActionButton>}
                        {callState === 'connected' && <ActionButton
                            variant='contained'
                            action='hold'
                            onClick={() => handleCall('holdCall', {callId: activeCall.callId})}
                            sx={{background: theme => theme.palette.snomGrey.midGrey_alt}}
                        >
                            <HoldIcon />
                        </ActionButton>}
                        {callState === 'holding' && <ActionButton
                            color='secondary' variant='contained'
                            action='resume'
                            onClick={() => handleCall('resumeCall', {callId: activeCall.callId})}
                        >
                            <ResumeIcon />
                        </ActionButton>
                        }
                        <ActionButton
                            color='error' variant='contained'
                            action={['connected', 'calling', 'holding'].includes(callState) ? 'end' : 'reject'}
                            onClick={() => handleCall(['connected', 'calling', 'holding'].includes(callState) ? 'endCall' : 'rejectCall', {callId: activeCall.callId})}
                        >
                            <RejectIcon />
                        </ActionButton>
                    </Box>
                </React.Fragment>
                : !inDialog && <FormSpy>
                {formSpyProps => <React.Fragment>
                    <Typography color='snomGrey.dark_alt' variant='h5' sx={{mb: 4, wordBreak: 'break-all'}}>
                        {formSpyProps.values.number || <FormattedMessage id='calls.dial.settings.number' />}
                    </Typography>
                    <FormError />
                </React.Fragment>}
            </FormSpy>}
        </Box>
    </React.Fragment>;
}
