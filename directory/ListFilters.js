import React, {useMemo, useCallback, useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
// store
import {AppStore} from 'store/app';
import {DirectoryStore} from 'store/directory';
// actions
import {getContacts} from 'actions/directory';
// components
import GroupField from 'components/modules/directory/GroupField';
// ui
import Form, {FieldsHolder} from 'components/ui/Form';
import SearchField from 'components/ui/SearchField';
import IdentityField from 'components/ui/IdentityField';


/**
 * Page Header with directory list filters
 *
 * DEV NOTE:
 *  - 'group' filter not rendered
 * API does not apply it
 */
export default function ListFilters(props) {
    const {directoryTypeInfo} = props;
    // store
    const globalState = AppStore.useState(store => store.state);
    const {state, errorState, search, identity, group, currentPage} = DirectoryStore.useState(store => ({
        state: store.state,
        errorState: store.errorState,
        search: store.filters.search,
        identity: store.filters.identity,
        group: store.filters.group,
        currentPage: store.currentPage
    }));
    // saving filter values to store
    const filterContacts = useCallback(values => {
        DirectoryStore.update(store => {
            store.filters.search = values.search;
            store.filters.identity = values.identity;
            store.filters.group = values.group;
            // reset data and pagination
            store.contacts = [];
            store.currentPage = 1;
        });
    }, []);
    // shared field props
    const sharedFieldProps = useMemo(() => ({
        variant: 'outlined',
        size: 'small',
        disableHelperText: true,
        InputLabelProps: {shrink: undefined}
    }), []);

    /**
     * Manage fetching and re-fetching of contacts
     * 1. useEffect -> used to re-fetch contacts when successfully saving/deleting contact
     * 2. useEffect -> used to re-fetch contacts when filters or pagination change triggers
     */
    useEffect(() => {
        // we have to trigger re-fetch after save to get updated results,
        // because stream does not return updates
        if (['directory_contact_saving_success', 'directory_contact_deleting_success'].includes(globalState) && state === 'on') {
            getContacts(currentPage, identity, search, group, directoryTypeInfo.index);
        }
    }, [globalState]);
    useEffect(() => {
        if (state === 'on' && errorState === null) {
            getContacts(currentPage, identity, search, group, directoryTypeInfo.index);
        }
    }, [currentPage, state, identity, search, group, directoryTypeInfo.index, errorState]);

    /**
     * Clean up filters and data
     */
    useEffect(() => {
        return () => {
            DirectoryStore.update(store => {
                store.filters.search = '';
                store.filters.identity = 1;
                store.filters.group = '';
                // reset data and pagination
                store.contacts = [];
                store.currentPage = 1;
            });
        };
    }, []);

    return <Form onSubmit={values => filterContacts(values)} initialValues={{search: search, identity: identity, group: group}}>
        {fFormProps => <FieldsHolder>
            <SearchField
                label={<FormattedMessage id='contact.filter.search.label' />}
                initialValue={search}
                search={() => fFormProps.form.submit()}
                sx={{mb: {xs: 2}}}
                {...sharedFieldProps}
            />
            {false && <GroupField name='group' onChange={() => fFormProps.form.submit()} {...sharedFieldProps} />}
            {!directoryTypeInfo.editable && <IdentityField
                name='identity' label={<FormattedMessage id='contact.filter.identity.label' />}
                onChange={() => fFormProps.form.submit()}
                {...sharedFieldProps}
            />}
        </FieldsHolder>}
    </Form>;
}
