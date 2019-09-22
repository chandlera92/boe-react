import React from 'react';
import {connect} from "react-redux";
import Chart from "../components/Chart";
import ChartItemNavigation from "../components/ChartItemNavigation";
import {ThemeProvider} from '@material-ui/styles';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';

import "./Main.scss";
import {
    AppBar,
    Box,
    CssBaseline,
    IconButton, Snackbar, SnackbarContent,
    Theme,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import {theme} from "../theme";
import {closeErrorSnack, setMobile} from "../actions/chart.action";

const useStyles = (theme: Theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        marginTop: '64px'
    },
    close: {
        padding: theme.spacing(0.5),
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    }
});


class Main extends React.Component<any, any> {

    render() {
        const {maxItemsWarning, closeErrorSnack, classes} = this.props;
        return (

            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={maxItemsWarning}
                    autoHideDuration={5000}
                    onClose={closeErrorSnack}
                    ContentProps={{
                        'aria-describedby': 'too many items',
                    }}
                >
                    <SnackbarContent
                        className={classes.error}
                        aria-describedby="too many items"
                        message={<Box  display={'flex'} alignItems={'center'}><ErrorIcon/><span
                            style={{marginLeft: '0.5rem'}}>You have already selected 4 items.</span></Box>
                        }
                        action={ <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            className={classes.close}
                            onClick={closeErrorSnack}
                        >
                            <CloseIcon/>
                        </IconButton>}
                    />

                </Snackbar>

                <Box display={'flex'}>
                    <AppBar position={'absolute'}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={() => this.props.setMobile(!this.props.mobileOpen)}
                                className={classes.menuButton}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6">
                                Bank of England macroeconomic data 1979-2015
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Box component={'nav'} display={'flex'}>
                        <ChartItemNavigation/>
                    </Box>
                    <main className={classes.content}>
                        <Chart/>
                    </main>
                </Box>

            </ThemeProvider>

        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        categories: state.chart.categories,
        mobileOpen: state.chart.mobileOpen,
        maxItemsWarning: state.chart.maxItemsWarning
    };
};

export default connect(
    mapStateToProps, {setMobile, closeErrorSnack}
)(withStyles(useStyles)(Main));

