import {FormattedMessage} from 'react-intl';
// mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


/**
 * Renders square button that manages call actions (e.g. accept, hold, resume a call)
 */
export default function ActionButton(props) {
    const {children, action, sx = {}, ...rest_of_props} = props;

    return <Box sx={{width: theme => theme.spacing(10), textAlign: 'center'}}>
        <Button
            sx={{borderRadius: theme => theme.spacing(1.25), minWidth: '0px', p: 2, mb: 1, ...sx}}
            {...rest_of_props}
        >
            {children}
        </Button>
        <Typography>
            <FormattedMessage id={`calls.call.action.${action}`} />
        </Typography>
    </Box>;
}
