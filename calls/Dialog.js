import React from 'react';
import {FormattedMessage} from 'react-intl';
// store
import {CallStore} from 'store/call';
import {identityNameKey, SettingsStore} from 'store/settings';
// ui
import CallStatus from 'components/modules/calls/Status';
// mui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// icons
import MinimizeIcon from '@mui/icons-material/Output';
import DialogTitle from '@mui/material/DialogTitle';


/**
 * Dialog for incoming call
 */
export default function CallDialog() {
    // store
    const {openDialog, callState, activeCall} = CallStore.useState(store => ({
        openDialog: store.callDialogOpen,
        callState: store.callState,
        activeCall: store.activeCall
    }));
    // get identity name from store
    const identityName = SettingsStore.useState(store => store[`${identityNameKey}_${activeCall?.identity || 'unknown'}`], [activeCall?.identity]);

    return <Dialog open={openDialog} onClose={() => callState === 'alerting' ? {} : CallStore.update(store => {store.callDialogOpen = false;})}
                   maxWidth='xs' fullWidth>
        <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <Box>
                <Typography color='snomGrey.dark_alt' sx={{fontSize: theme => theme.spacing(3.75)}}>
                    <FormattedMessage id={`calls.call.${callState}`} />
                </Typography>
                <Typography color='snomGrey.dark_alt'>
                    {activeCall?.identity && <FormattedMessage id='calls.call.identity' values={{identity: identityName}} />}
                </Typography>
            </Box>
            <IconButton onClick={() => CallStore.update(store => {store.callDialogOpen = false;})}>
                <MinimizeIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent sx={{p: 4}}>
            <CallStatus inDialog />
        </DialogContent>
    </Dialog>;
}
