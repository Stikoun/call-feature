import React, {useState, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
// mui
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
// icons
import IconButton from '@mui/material/IconButton';
import NumberMenuIcon from '@mui/icons-material/MoreVert';
// import DefaultIcon from '@mui/icons-material/Call';
import DeleteIcon from '@mui/icons-material/Delete';


/**
 * Directory number menu which contains actions for selected number
 */
export default function NumberMenu(props) {
    const {numbersList, numberIndex, fFormProps, ...rest_of_props} = props;
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
        <IconButton onClick={event => setMenuAnchor(event.currentTarget)}>
            <NumberMenuIcon />
        </IconButton>
        <Menu
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={() => setMenuAnchor(null)}
        >
            {/* <MenuItem onClick={() => { */}
            {/*     // set preferred number to selected number index */}
            {/*     fFormProps.form.change('preferredNumberIndex', numberIndex); */}
            {/*     setMenuAnchor(null); */}
            {/* }}> */}
            {/*     <ListItemIcon sx={sharedListItemIconSx}> */}
            {/*         <DefaultIcon /> */}
            {/*     </ListItemIcon> */}
            {/*     <ListItemText> */}
            {/*         <FormattedMessage id='contact.form.actions.number.default' /> */}
            {/*     </ListItemText> */}
            {/* </MenuItem> */}
            <MenuItem onClick={() => {
                numbersList.remove(numberIndex);
                setMenuAnchor(null);
            }}>
                <ListItemIcon sx={sharedListItemIconSx}>
                    <DeleteIcon sx={{color: 'error.main'}} />
                </ListItemIcon>
                <ListItemText sx={{color: 'error.main'}}>
                    <FormattedMessage id='contact.form.actions.number.delete' />
                </ListItemText>
            </MenuItem>
        </Menu>
    </Box>;
}
