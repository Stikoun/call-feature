import React, {useMemo, useCallback, useEffect} from 'react';
import Moment from 'moment/moment';
import {FormattedMessage} from 'react-intl';
// store
import {DirectoryStore, ServerTypes} from 'store/directory';
// actions
import {contactsStream} from 'actions/directory';
import {shouldStreamReconnect} from 'components/ui/Streams';
// components
import NumberTypeIcon from 'components/ui/NumberTypeIcon';
import Pagination from 'components/ui/Pagination';
// modules
import ListPageHeader from 'components/modules/directory/ListPageHeader';
import ContactDialog from 'components/modules/directory/ContactDialog';
// mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
// icons
import ErrorIcon from '@mui/icons-material/ErrorOutlineOutlined';
import RefreshIcon from '@mui/icons-material/RefreshOutlined';


/**
 * Page that allows managing and browsing contacts
 *
 * DEV NOTES:
 * ----------
 *  - no loading & no empty page
 * from getContacts() we don't know if we will receive results from stream
 *  - no pagination limit
 * API don't return information about amount of pages
 *  - no sorting
 * API does not support sorting
 *  - no files
 * API returns local path url and does not support upload
 *  - bad search
 * API does not support diacritics and spaces
 *  - no server type limitation
 * getServerTypes crashes the API
 *  - update problem
 * API does not update model
 */
export default function List(props) {
    const {category_intl_prefix, category} = props;
    // store
    const {state, errorState, contacts, currentPage} = DirectoryStore.useState(store => ({
        state: store.state,
        errorState: store.errorState,
        contacts: store.contacts.filter(contact => contact.page === store.currentPage),
        currentPage: store.currentPage
    }));
    // directory (server) type (e.g. LDAP/tbook)
    const directoryTypeInfo = useMemo(() => ({name: category.directory_type, index: ServerTypes.indexOf(category.directory_type), editable: category.directory_type === 'tbook'}), [category.directory_type]);

    /**
     * Manage contact stream, all fetching is done in DirectoryListFilters
     */
    useEffect(() => {
        switch (state) {
            // turn on ContactsStream used to obtain directory
            case 'initializing':
                const startDate = Moment();
                contactsStream(() => {
                    DirectoryStore.update(store => {
                        store.state = shouldStreamReconnect(startDate) ? 'initializing': 'error';
                        store.contactsStream = null;
                    });
                });
                break;
        }
    }, [state]);
    // on unmount stop the stream and update store
    useEffect(() => {
        return () => {
            DirectoryStore.update(store => {
                if (store.state === 'on') {
                    store.state = 'initializing';
                    if (!process.env.REACT_APP_OFFLINE) {
                        store.contactsStream.cancel();
                        store.contactsStream = null;
                    }
                }
            });
        };
    }, []);

    // set selected contact and open dialog
    const selectContact = useCallback(contact => {
        DirectoryStore.update(store => {
            store.selectedContact = contact;
            store.openContactDialog = true;
        });
    }, []);

    // shared style between table cells
    const sharedTableCellSx= useMemo(() => (
        {px: 2, py: 0}
    ), []);

    return <React.Fragment>
        <ListPageHeader category_intl_prefix={category_intl_prefix} category={category} directoryTypeInfo={directoryTypeInfo} />
        {errorState
            ? <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, my: 5, px: 2}}>
                <ErrorIcon sx={{color: 'error.main', fontSize: 50, flexShrink: '0'}} />
                <Typography variant='subtitle1' sx={{fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1}}>
                    <Box><FormattedMessage id='stream.fetchError' /></Box>
                    <IconButton size='large' onClick={() => DirectoryStore.update(store => {store.errorState = null;})}><RefreshIcon /></IconButton>
                </Typography>
            </Box>
            : <React.Fragment>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['name', 'numbersList', 'groupTagsList'].map(column => <TableCell key={column}>
                                    <FormattedMessage id={`contact.table.${column}`} />
                                </TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map(contact => <TableRow hover key={contact.id} sx={{height: theme => theme.spacing(8)}} onClick={() => selectContact(contact)}>
                                <TableCell sx={sharedTableCellSx}>{[contact.firstname, contact.lastname].filter(Boolean).join(' ') || contact.name}</TableCell>
                                <TableCell sx={sharedTableCellSx}>
                                    {contact.numbersList?.filter(number => !!number?.uri).sort(a => a.uri === contact.preferredNumber?.uri ? -1 : 0).map(number => <Box
                                        key={`${number.uri}-${number.type}`}
                                        sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1}}
                                    >
                                        <NumberTypeIcon type={number.type} sx={{fontSize: '21px'}} />
                                        <Box component='span'>{number.uri}</Box>
                                    </Box>)}
                                </TableCell>
                                <TableCell sx={sharedTableCellSx}>{contact.groupTagsList?.join(', ')}</TableCell>
                            </TableRow>)}
                            {contacts.length < parseInt(process.env.REACT_APP_PAGINATE_BY, 10) && [...new Array(parseInt(process.env.REACT_APP_PAGINATE_BY, 10) - contacts.length)].map((_, idx) => <TableRow key={idx}>
                                {[...new Array(3)].map((_, idx) => <TableCell key={idx} sx={sharedTableCellSx} />)}
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination page={currentPage} setPage={page => DirectoryStore.update(store => {store.currentPage = page;})} />
            </React.Fragment>}
        <ContactDialog directoryTypeInfo={directoryTypeInfo} />
    </React.Fragment>;
}
