import React, {useCallback} from 'react';
import {DirectoryStore} from 'store/directory';
import {FormattedMessage} from 'react-intl';
import {FormSpy} from 'react-final-form';
// components
import Form, {FieldsHolder} from 'components/ui/Form';
import Field from 'components/ui/Field';
import Icon from 'components/ui/SnomIcons';
// mui
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
// icons
import CancelIcon from '@mui/icons-material/UndoOutlined';


/**
 * Dialog for adding group in directory
 */
export default function GroupDialog(props) {
    const {selectGroup = () => {}} = props;
    // store
    const {openGroupDialog} = DirectoryStore.useState(store => ({
        openGroupDialog: store.openGroupDialog
    }));
    // close group dialog
    const closeDialog = useCallback(() => {
        DirectoryStore.update(store => {
            store.openGroupDialog = false;
        });
    }, []);

    return <Dialog maxWidth='md' open={openGroupDialog} onClose={closeDialog}>
        <Form
            onSubmit={values => {
                DirectoryStore.update(store => {
                    store.newGroups = [...store.newGroups, values.group];
                    store.openGroupDialog = false;
                });
                selectGroup(values.group);
            }}
        >
            {fFormProps => <React.Fragment>
                <DialogContent>
                    <FieldsHolder>
                        <Field
                            variant='filled'
                            name='group'
                            type='text'
                            label={<FormattedMessage id='contact.form.group' />}
                        />
                    </FieldsHolder>
                </DialogContent>
                <DialogActions>
                    <Button color='inherit' startIcon={<CancelIcon />} onClick={closeDialog}>
                        <FormattedMessage id='actions.cancel'/>
                    </Button>
                    <FormSpy subscription={{dirty: true}}>
                        {formSpyProps =>
                            <Button variant='contained' startIcon={<Icon name='add' />} onClick={() => fFormProps.form.submit()} disabled={!formSpyProps.dirty}>
                                <FormattedMessage id='contact.form.actions.group.add'/>
                            </Button>}
                    </FormSpy>
                </DialogActions>
            </React.Fragment>}
        </Form>
    </Dialog>;
}
