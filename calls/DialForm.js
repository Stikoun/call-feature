import React, {useMemo, useRef} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import validator from 'lib/validator';
import usePressButtonEffect from 'lib/hooks/usePressButtonEffect';
// store
import {identityNameKey, SettingsStore} from 'store/settings';
import {CallStore} from 'store/call';
// actions
import {handleCall} from 'actions/call';
// ui
import PageHeader from 'components/ui/PageHeader';
import Section from 'components/ui/Section';
import Form from 'components/ui/Form';
import Field, {FField} from 'components/ui/Field';
import IdentityField from 'components/ui/IdentityField';
import CallStatus from 'components/modules/calls/Status';
import Keypad from 'components/ui/Keypad';
import PressButton from 'components/ui/PressButton';
// mui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
// icons
import ClearIcon from '@mui/icons-material/Clear';
import CallIcon from '@mui/icons-material/Phone';


/**
 * Render call dial page that allows to make call or manage active calls
 */
export default function CallDial(props) {
    const {formProps, children} = props;
    // input number reference
    const numberRef = useRef();
    // state for simulating click effect on submit call button
    const {pressedState: submitState, setPressedState: setSubmitState} = usePressButtonEffect();
    // intl
    const intl = useIntl();
    // store
    const callState = CallStore.useState(store => store.callState);

    // get first used identity index
    const firstUsedIdentityIndex = SettingsStore.useState(store => {
        return [...new Array(12)].map((_, idx) => idx + 1).find(identity => !!store[`${identityNameKey}_${identity}`]);
    });

    // shared field props
    const sharedFieldProps = useMemo(() => ({
        variant: 'filled',
        className: 'full',
        disabled: !['idling', 'closed'].includes(callState)
    }), [callState]);

    return <Form
        keepDirtyOnReinitialize
        validate={values => {
            const errors = {};
            validator.isNotNull(errors, intl, 'identity', values.identity);
            validator.isNotNull(errors, intl, 'number', values.number);
            return errors;
        }}
        initialValues={{identity: firstUsedIdentityIndex}}
        disabled={sharedFieldProps.disabled}
        onSubmit={values => {
            setSubmitState('hover');
            return handleCall('makeCall', {identity: values.identity, uri: values.number});
        }}
    >
        {fFormProps => children({
            ...formProps,
            fields: <React.Fragment>
                <IdentityField
                    name='identity'
                    label={<FormattedMessage id='calls.dial.settings.identity' />}
                    {...sharedFieldProps}
                />
                <FField name='number'>
                    {fFieldProps => <React.Fragment>
                        <Field
                            fieldProps={fFieldProps}
                            label={<FormattedMessage id='calls.dial.settings.number' />}
                            inputProps={{ref: numberRef}}
                            InputProps={{
                                endAdornment: <InputAdornment position='end' sx={{height: '100%'}}>
                                    <Button
                                        onClick={() => fFieldProps.input.onChange('')}
                                        sx={{
                                            // match radius of parent
                                            borderRadius: '0 10px 10px 0',
                                            backgroundColor: 'snomGrey.sliderGrey', color: 'common.white',
                                            height: '100%', px: 0
                                        }}
                                    >
                                        <ClearIcon />
                                    </Button>
                                </InputAdornment>
                            }}
                            sx={{
                                // remove padding to fit input adornment above
                                '& > .MuiInputBase-root': {
                                    pr: 0
                                }
                            }}
                            {...sharedFieldProps}
                        />
                    </React.Fragment>}
                </FField>
            </React.Fragment>
        })}
    </Form>;
}
