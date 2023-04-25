import React, {useState, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
// store
import {DirectoryStore} from 'store/directory';
// actions
import {deleteContact} from 'actions/directory';
// mui
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
// icons
import IconButton from '@mui/material/IconButton';
import ContactMenuIcon from '@mui/icons-material/MoreVert';
// import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';


/**
 * Directory contact menu which contains actions for selected contact
 */
export default function ContactMenu(props) {
    const {contact, identity, serverType, ...rest_of_props} = props;
    // anchor element for contact menu
    const [menuAnchor, setMenuAnchor] = useState(null);
    // fix style for ListItemIcon
    const sharedListItemIconSx = useMemo(() => ({
        flexShrink: '0',
        display: 'inline-flex',
        marginRight: 1,
        minWidth: '0px !important'
    }), []);

    return <Box {...rest_of_props}>
        <IconButton onClick={event => setMenuAnchor(event.currentTarget)} sx={{color: 'primary.main'}}>
            <ContactMenuIcon />
        </IconButton>
        <Menu
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={() => setMenuAnchor(null)}
        >
            <MenuItem onClick={() => {
                deleteContact(contact, identity, serverType);
                setMenuAnchor(null);
                DirectoryStore.update(store => {
                    store.selectedContact = null;
                    store.openContactDialog = false;
                });
            }}>
                <ListItemIcon sx={sharedListItemIconSx}>
                    <DeleteIcon sx={{color: 'error.main'}} />
                </ListItemIcon>
                <ListItemText sx={{color: 'error.main'}}>
                    <FormattedMessage id='contact.form.actions.contact.delete' />
                </ListItemText>
            </MenuItem>
        </Menu>
    </Box>;
}
