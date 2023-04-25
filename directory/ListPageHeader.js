import React from 'react';
import {FormattedMessage} from 'react-intl';
import {DirectoryStore} from 'store/directory';
// ui
import ListFilters from 'components/modules/directory/ListFilters';
import PageHeader from 'components/ui/PageHeader';
// mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// icons
import Icon from 'components/ui/SnomIcons';


/**
 * Page Header with submit of setting lists changed values
 */
export default function ListPageHeader(props) {
    const {category_intl_prefix, category, directoryTypeInfo} = props;

    // todo: prepare import dialog with file field

    return <PageHeader
        category_intl_prefix={category_intl_prefix} category={category} showBorder
        action={<React.Fragment>
            {/* <Button */}
            {/*     startIcon={<Icon name='add' />} */}
            {/*     color='inherit' */}
            {/*     variant='outlined' */}
            {/*     disabled */}
            {/*     onClick={() => { */}
            {/*         DirectoryStore.update(store => { */}
            {/*             store.openContactDialog = true; */}
            {/*         }); */}
            {/*     }}> */}
            {/*     <FormattedMessage id='contact.actions.import' /> */}
            {/* </Button> */}
            {directoryTypeInfo.editable && <Button
                startIcon={<Icon name='add' />}
                color='primary'
                variant='contained'
                onClick={() => {
                    DirectoryStore.update(store => {
                        store.openContactDialog = true;
                    });
                }}>
                <FormattedMessage id='actions.add' />
            </Button>}
        </React.Fragment>}>
        <Box sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
            gap: 1, pb: 2, px: 2
        }}>
            <ListFilters directoryTypeInfo={directoryTypeInfo} />
        </Box>
    </PageHeader>;
}
