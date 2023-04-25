import React from 'react';
import {FormattedMessage} from 'react-intl';
// store
import {CallStore} from 'store/call';
// ui
import CallDialog from 'components/modules/calls/Dialog';
import CallDuration from 'components/modules/calls/Duration';
// mui
import Chip from '@mui/material/Chip';
// icons
import CallIcon from '@mui/icons-material/Call';
import IncomingCallIcon from '@mui/icons-material/RingVolume';
import HoldIcon from '@mui/icons-material/Pause';


/**
 * Renders dialog that allows answering call and chip with call information
 */
export default function CallNotification() {
    // store
    const {callState, activeCall} = CallStore.useState(store => ({
        callState: store.callState,
        activeCall: store.activeCall
    }));

    return <React.Fragment>
        <Chip
            sx={{
                // expand chip slowly
                width: theme => ['alerting', 'connected', 'holding'].includes(callState) ? theme.spacing(16) : '0px',
                transition: theme => theme.transitions.create(['margin', 'width'],
                    {duration: theme.transitions.duration.complex * 2}),
                // gap between search and chip
                ml: ['alerting', 'connected', 'holding'].includes(callState) ? 2 : 0,
                overflow: 'hidden',
                backgroundColor: 'primary.light', boxShadow: theme => theme.snomShadows[1],
                color: 'primary.main',
                // change default MUI Chip overflow to default CSS value
                '& > .MuiChip-label': {
                    textOverflow: 'clip'
                },
                '& > .MuiChip-icon': {
                    color: 'primary.main',
                    // incoming shake animation, indicating ringing
                    ...(callState === 'alerting' ? {
                        animationName: 'shake',
                        animationDuration: '1s',
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite',
                        transformOrigin: 'center',
                        animationDirection: 'alternate',
                        '@keyframes shake': {
                            '20%': {
                                transform: 'rotate(-15deg)'
                            },
                            '0%, 30%, 60%, 100%': {
                                transform: 'rotate(0deg)'
                            },
                            '80%': {
                                transform: 'rotate(15deg)'
                            }
                        }
                    }: {})
                }
            }}
            icon={callState === 'alerting' ? <IncomingCallIcon /> : callState === 'holding' ? <HoldIcon /> : <CallIcon />}
            label={['connected', 'holding'].includes(callState)
                ? <CallDuration startTime={activeCall?.startTime} />
                : callState === 'alerting'
                    ? <FormattedMessage id='calls.call.incoming' />
                    : <FormattedMessage id='calls.call.ended' />
            }
            onClick={() => CallStore.update(store => {store.callDialogOpen = true;})}
        />
        <CallDialog />
    </React.Fragment>;
}
