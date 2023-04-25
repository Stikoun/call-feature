import Box from '@mui/material/Box';
import {FormattedMessage} from 'react-intl';


/**
 * Enhanced number label with chip indicating preferred number
 */
export default function DefaultNumberLabel() {
    return <Box>
        <FormattedMessage id='contact.form.number' />
        <Box sx={{
            display: 'inline-block', ml: 1, px: 1, my: '-2px',
            border: 1, borderColor: 'snomGrey.midGrey_alt', borderRadius: theme => theme.shape.borderRadius,
            color: 'snomGrey.midGrey_alt'
        }}>
            <FormattedMessage id='contact.form.default' />
        </Box>
    </Box>;
}
