import React, {useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
// store
import {DirectoryStore} from 'store/directory';
// actions
import {getGroups} from 'actions/directory';
// ui
import Field, {FField} from 'components/ui/Field';
import Icon from 'components/ui/SnomIcons';
// components
import GroupDialog from 'components/modules/directory/GroupDialog';
// mui
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';


/**
 * Select field with available groups and option to add new groups
 */
export default function GroupField(props) {
    const {name, addMode = false, multiple = false, ...rest_of_props} = props;
    // store
    const {groups, newGroups} = DirectoryStore.useState(store => ({
        groups: store.groups,
        newGroups: store.newGroups
    }));

    /**
     * Manage fetching of contact groups
     */
    useEffect(() => {
        if (groups.length === 0) {
            getGroups();
        }
    }, []);

    return <FField name={name}>
        {fieldProps => <React.Fragment>
            <Field
                type='select'
                multiple={multiple}
                label={<FormattedMessage id='contact.form.groupTagsList' />}
                fieldProps={fieldProps}
                {...rest_of_props}
            >
                {(!addMode && !multiple) && <MenuItem value=''>
                    <em><FormattedMessage id='select.none' /></em>
                </MenuItem>}
                {/* Display available groups and new groups added by user */}
                {[...groups, ...newGroups].sort().map(group => <MenuItem key={group} value={group}>
                    {group}
                </MenuItem>)}
            </Field>
            {addMode && <React.Fragment>
                <IconButton
                    color='secondary' sx={{justifySelf: 'left', alignSelf: 'center'}}
                    onClick={() => {
                        DirectoryStore.update(store => {
                            store.openGroupDialog = true;
                        });
                    }}
                >
                    <Icon name='add' />
                </IconButton>
                <GroupDialog selectGroup={group => fieldProps.input.onChange([...(fieldProps.input.value || []), group])} />
            </React.Fragment>}
        </React.Fragment>}
    </FField>;
}
