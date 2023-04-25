import React from 'react';
// mui
import Box from '@mui/material/Box';
// icons
import PersonIcon from '@mui/icons-material/Person';


/**
 * Animated call avatar that indicates ringing
 */
export default function CallAvatar(props) {
    const {animate = true, disabled = false} = props;

    return <Box sx={{
        // 1:1 ratio
        position: 'relative', paddingTop: '100%',
        // gradient border box
        '& > div': {
            position: 'absolute', inset: '0',
            ...(disabled ? {backgroundColor: 'snomGrey.midGrey_alt'} : {backgroundImage: theme => theme.palette.gradients.blueGradient}),
            boxShadow: theme => theme.snomShadows[4],
            border: '4px solid transparent', borderRadius: '50%',
            backgroundOrigin: 'border-box',
            // animation
            '&:nth-of-type(1), &:nth-of-type(2)': {
                opacity: '0', // hide before animation starts
                animationName: animate ? 'incoming' : 'none',
                animationDuration: theme => `${theme.transitions.duration.complex * 3}ms`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                // enlarging circle animation that disappears how it grows in size
                '@keyframes incoming': {
                    '0%': {
                        transform: 'scale(0.7)',
                        opacity: '1'
                    },
                    '80%, 100%': {
                        transform: 'scale(1)',
                        opacity: '0'
                    }
                }
            },
            '&:nth-of-type(2)': {
                // start the second animation after delay
                animationDelay: theme => `${theme.transitions.duration.complex * 2}ms`
            }
        }
    }}>
        <Box />
        <Box />
        <Box sx={{m: 4}}>
            <PersonIcon sx={{
                color: 'snomGrey.midGrey_alt',
                display: 'block',
                // full-size
                width: '100%', height: '100%'
            }} />
        </Box>
    </Box>;
}
