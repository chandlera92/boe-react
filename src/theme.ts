import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';

const defaultTheme = createMuiTheme();

export const theme = responsiveFontSizes(createMuiTheme({
    palette: {
        primary: {
            main: '#2c7bb6'
        }
    },
    overrides: {
        MuiAppBar: {
            root: {
                marginLeft: '240px',
                [defaultTheme.breakpoints.up('md')]: {
                    width: `calc(100% - 240px)`
                },
            }
        },
        MuiDrawer: {
            root: {
                width: 240,
                [defaultTheme.breakpoints.up('md')]: {
                    width: 240,
                    flexShrink: 0
                }
            },

            paper: {
                width: 240,
                [defaultTheme.breakpoints.up('md')]: {
                    width: 240,
                    flexShrink: 0
                }
            }
        },
        MuiCheckbox: {
            root: {
                '&:hover': {
                    backgroundColor: 'inherit'
                }
            }
        }
    }
}));

