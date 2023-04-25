import React, {useMemo, useCallback} from 'react';
import {FormattedMessage} from 'react-intl';
import {FormSpy} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import {FieldArray} from 'react-final-form-arrays';
import {theme} from 'theme';
// store
import {DirectoryStore, NumberTypes, ContactTypes, ContactSources} from 'store/directory';
import {AppStore, setGlobalState} from 'store/app';
// actions
import {saveContact} from 'actions/directory';
// components
import Form, {FieldsHolder} from 'components/ui/Form';
import Field, {FField} from 'components/ui/Field';
import {FormErrorC} from 'components/ui/FormError';
import IdentityField from 'components/ui/IdentityField';
import Icon from 'components/ui/SnomIcons';
import Section from 'components/ui/Section';
import SubmitButton from 'components/ui/SubmitButton';
import NumberTypeIcon from 'components/ui/NumberTypeIcon';
import ContactMenu from 'components/modules/directory/ContactMenu';
import NumberMenu from 'components/modules/directory/NumberMenu';
import DefaultNumberLabel from 'components/modules/directory/DefaultNumberLabel';
import GroupField from 'components/modules/directory/GroupField';
// mui
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
// icons
import CancelIcon from '@mui/icons-material/UndoOutlined';
import RestoreIcon from '@mui/icons-material/RestoreOutlined';


/**
 * Add/Edit dialog for contact in directory
 *
 * DEV NOTE:
 *  - 'preferredNumber' (default number) not used
 * API does not support it
 *  - 'name' not used
 * API have it only as read-only from imports
 *  - 'groupTagsList' create disabled
 * API does not support custom groups
 */
export default function ContactDialog(props) {
    const {directoryTypeInfo} = props;
    // store
    const globalState = AppStore.useState(store => store.state);
    const {selectedContact, identity, openContactDialog} = DirectoryStore.useState(store => ({
        selectedContact: store.selectedContact,
        identity: store.filters.identity,
        openContactDialog: store.openContactDialog
    }));
    // shared field props
    const sharedFieldProps = useMemo(() => ({
        variant: 'filled',
        className: 'full',
        disabled: !directoryTypeInfo.editable
    }), []);
    // initial values for number field
    const initialNumberValues = useMemo(() => (
        {
            type: NumberTypes.indexOf('mobile'),
            uri: '',
            preferredOutgoingCallAccount: identity,
            contactNumberId: null
        }
    ), [identity]);

    // reset selected contact and close dialog
    const closeDialog = useCallback(() => {
        DirectoryStore.update(store => {
            store.selectedContact = null;
            store.newGroups = [];
            store.openContactDialog = false;
        });
    }, []);

    // add/edit contact
    const submitContact = useCallback((values, identity, selectedContact) => {
        // append type and sourceId as local directory is only editable
        const contact = {...values, type: ContactTypes.indexOf('tbookperson'), sourceId: ContactSources.indexOf('tbook')};
        saveContact(contact, identity, selectedContact, directoryTypeInfo.index);
    }, []);

    // initialValues - select only used contact fields in form
    return <Dialog maxWidth='sm' fullWidth open={openContactDialog} onClose={closeDialog}>
        <Form onSubmit={(values) => submitContact(values, identity, selectedContact)}
              initialValues={
                  selectedContact
                      ? Object.fromEntries([
                          'firstname', 'lastname', 'email', 'groupTagsList', 'numbersList', 'id' // 'preferredNumber', 'name'
                      ].map(key => {
                          // process preferredNumber into index
                          if (key === 'preferredNumber') {
                              // finding index of preferredNumber in numbers list
                              return ['preferredNumberIndex', selectedContact.numbersList?.findIndex(number => JSON.stringify(number) === JSON.stringify(selectedContact[key]))];
                          }
                          // make sure to provide arrays, if we don't have value
                          if (['groupTagsList', 'numbersList'].includes(key)) {
                              return [key, selectedContact[key] || []];
                          }
                          // default
                          return [key, selectedContact[key]];
                      }))
                      : {numbersList: [initialNumberValues], groupTagsList: []}
              }
              validate={values => {
                  const errors = {};
                  if (!values.numbersList?.length) {
                      errors['numbersList'] = 'contact.form.number.required';
                  }
                  return errors;
              }}
              keepDirtyOnReinitialize
              mutators={{...arrayMutators}}
        >
            {fFormProps => <React.Fragment>
                <DialogTitle>
                    <FormattedMessage id={`contact.form.${selectedContact ? 'edit' : 'add'}`} />
                </DialogTitle>
                <DialogContent sx={{paddingTop: `${theme.spacing(2.5)} !important`, position: 'relative'}}>
                    {(selectedContact && directoryTypeInfo.editable) && <ContactMenu
                        contact={selectedContact} identity={identity}
                        serverType={directoryTypeInfo.index}
                        sx={{textAlign: 'right', mt: -2.5}}
                    />}
                    <Section title={<FormattedMessage id='contact.form.personal' />}>
                        <FieldsHolder sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'}}}>
                            {['firstname', 'lastname', 'email'].map(name => (
                                <Field
                                    key={name}
                                    name={name}
                                    type='text'
                                    label={<FormattedMessage id={`contact.form.${name}`} />}
                                    {...sharedFieldProps}
                                />
                            ))}
                            <GroupField name='groupTagsList' multiple addMode={false && directoryTypeInfo.editable} {...sharedFieldProps} />
                        </FieldsHolder>
                    </Section>
                    <Section title={<FormattedMessage id='contact.form.numbers' />}>
                        <FieldsHolder>
                            <FField name='preferredNumberIndex'>
                                {fieldProps => <React.Fragment>
                                    <input type='hidden' {...fieldProps.input} />
                                    <FieldArray name='numbersList'>
                                        {({fields, meta: {error, dirtySinceLastSubmit}}) => <React.Fragment>
                                            {directoryTypeInfo.editable && <FormErrorC
                                                formSpyProps={{submitError: error, dirtySinceLastSubmit: dirtySinceLastSubmit}}
                                                sx={{mx: 1}}
                                            />}
                                            {fields.map((number, index) => <React.Fragment key={index}>
                                                <Box sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'auto max-content'
                                                }}>
                                                    <Field
                                                        name={`${number}.uri`}
                                                        type='text'
                                                        label={fieldProps.input.value === index
                                                            ? <DefaultNumberLabel />
                                                            : <FormattedMessage id='contact.form.number' />}
                                                        sx={{
                                                            '.MuiFormLabel-root': {
                                                                overflow: 'visible'
                                                            }
                                                        }}
                                                        {...sharedFieldProps}
                                                    />
                                                    {directoryTypeInfo.editable && <NumberMenu
                                                        numbersList={fields}
                                                        numberIndex={index}
                                                        fFormProps={fFormProps}
                                                        sx={{mt: 3.70}}
                                                    />}
                                                </Box>
                                                <Box sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr'
                                                }}>
                                                    <Field
                                                        name={`${number}.type`}
                                                        type='select'
                                                        label={<FormattedMessage id='contact.form.numbertype' />}
                                                        InputProps={{
                                                            startAdornment: <NumberTypeIcon type={fields.value[index].type} />
                                                        }}
                                                        {...sharedFieldProps}
                                                    >
                                                        {/* Filtering out unspecified number type, therefore using increased index */}
                                                        {NumberTypes.filter(type => type !== 'unspecifiednumbertype').map((type, index) =>
                                                            <MenuItem key={type} value={index + 1}>
                                                                <FormattedMessage id={`contact.number.type.${type}`} />
                                                            </MenuItem>)}
                                                    </Field>
                                                    <IdentityField
                                                        name={`${number}.preferredOutgoingCallAccount`}
                                                        label={<FormattedMessage id='contact.form.preffered_identity' />}
                                                        {...sharedFieldProps}
                                                    >
                                                        <MenuItem value={0}>
                                                            <FormattedMessage id='contact.form.active' />
                                                        </MenuItem>
                                                    </IdentityField>
                                                </Box>
                                                {(fields.length - 1) !== index && <hr />}
                                            </React.Fragment>)}
                                            {directoryTypeInfo.editable && <Box sx={{px: 1}}>
                                                <Button variant='contained' sx={{justifySelf: 'flex-start'}} startIcon={<Icon name='add' />}
                                                        onClick={() => fields.push(initialNumberValues)}
                                                >
                                                    <FormattedMessage id='contact.form.actions.number.add' />
                                                </Button>
                                            </Box>}
                                        </React.Fragment>}
                                    </FieldArray>
                                </React.Fragment>}
                            </FField>
                        </FieldsHolder>
                    </Section>
                </DialogContent>
                <DialogActions>
                    <Button color='inherit' startIcon={<CancelIcon />} onClick={closeDialog}>
                        <FormattedMessage id='actions.cancel'/>
                    </Button>
                    {directoryTypeInfo.editable && <React.Fragment>
                        {selectedContact && <FormSpy subscription={{dirty: true}}>
                            {formSpyProps => <SubmitButton
                                startIcon={<RestoreIcon />}
                                type='reset'
                                disabled={!formSpyProps.dirty}
                                submitting={globalState === 'directory_contact_reseting'}
                                success={globalState === 'directory_contact_reseted'}
                                onClick={() => {
                                    setGlobalState('directory_contact_reseting');
                                    setTimeout(() => {
                                        fFormProps.form.setConfig('keepDirtyOnReinitialize', false);
                                        fFormProps.form.restart();
                                        fFormProps.form.setConfig('keepDirtyOnReinitialize', true);
                                        setGlobalState('directory_contact_reseted');
                                    }, theme.transitions.duration.complex); // let animation begin first
                                }}>
                                <FormattedMessage id='actions.revert' />
                            </SubmitButton>}
                        </FormSpy>}
                        {/* Add or Edit button depending on selectedContact */}
                        <FormSpy subscription={{dirty: true, valid: true}}>
                            {formSpyProps => <SubmitButton
                                startIcon={<Icon name={selectedContact ? 'check' : 'add'} />}
                                disabled={!formSpyProps.dirty || !formSpyProps.valid}
                                submitting={globalState === 'directory_contact_saving'}
                                success={globalState === 'directory_contact_saving_success'}
                                error={globalState === 'directory_contact_saving_failed'}
                                postAnimation={success => {
                                    if (success) {
                                        setGlobalState(null);
                                        DirectoryStore.update(store => {
                                            store.selectedContact = null;
                                            store.openContactDialog = false;
                                        });
                                    }
                                }}
                            >
                                <FormattedMessage id={selectedContact ? 'actions.apply' : 'contact.form.actions.contact.create'} />
                            </SubmitButton>}
                        </FormSpy>
                    </React.Fragment>}
                </DialogActions>
            </React.Fragment>}
        </Form>
    </Dialog>;
}
