import React from 'react';
import {connect} from "react-redux";
import {groupBy, pull, find} from 'lodash';
import {
    Box,
    Checkbox,
    Collapse,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader, Theme, withStyles
} from "@material-ui/core";
import {
    addActiveCategory,
    Category,
    openErrorSnack,
    removeActiveCategory,
    setMobile
} from "../actions/chart.action";
import {ExpandLess, ExpandMore} from "@material-ui/icons";


const useStyles = (theme: Theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    }
});

class ChartItemNavigation extends React.Component<any, any> {

    groupedCategories = groupBy(this.props.categories, 'section');

    state: { openSections: string[] } = {
        openSections: []
    };


    handleNavigationChange = (item: Category) => {
        const {addActiveCategory, removeActiveCategory, openErrorSnack, activeCategories} = this.props;

        let checkIfExists = find(activeCategories, ['data.id', item.id]);

        if (!checkIfExists) {
            find(activeCategories, ['active', false]) ? addActiveCategory(item) : openErrorSnack()

        } else {
            removeActiveCategory(item)
        }
    };

    toggleSectionList(section: string) {
        if (this.state.openSections.includes(section)) {
            this.setState({openSections: pull(this.state.openSections, section)})
        } else {
            let openSections = this.state.openSections;
            openSections.push(section);
            this.setState({openSections: openSections})
        }
    };

    renderListItems = (items: Category[]) => {
        const {classes, activeCategories} = this.props;
        let activeItems = activeCategories.map((category: any) => category.data.id);

        return items.map((item: Category) => {
            let getColor = activeItems.includes(item.id)
                ? find(activeCategories, ['data.id', item.id])
                : find(activeCategories, ['data.id', -1]);

            return (
                <ListItem className={classes.nested} onClick={() => this.handleNavigationChange(item)}
                          button key={item.id}>
                    <ListItemText primary={item.header}/>
                    <ListItemIcon>
                        <Checkbox
                            style={{color: getColor && getColor.active ? getColor.color : 'inherit'}}
                            className={getColor ? `chart__checkIcon--${(getColor.colorClass)}` : ''}
                            edge="end"
                            checked={!!find(activeCategories, ['data.id', item.id])}
                        />
                    </ListItemIcon>
                </ListItem>
            )
        })

    };

    renderLists = (): any => {
        return Object.keys(this.groupedCategories).map((key: any, i: number) => {
            const categoryItems = this.groupedCategories[key];
            const sectionOpen = this.state.openSections.includes(key);

            return (
                <Box key={key}>
                    <ListItem button onClick={() => this.toggleSectionList(key)}>
                        <ListItemText primary={key}/>
                        {sectionOpen ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={sectionOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {this.renderListItems(categoryItems)}
                        </List>
                    </Collapse>
                </Box>
            )

        })
    };


    render() {
        return (
            <React.Fragment>
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        open={this.props.mobileOpen}
                        onClose={() => this.props.setMobile(!this.props.mobileOpen)}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <List>
                            <ListSubheader inset={true} disableSticky={true}>Chart Items</ListSubheader>
                            {this.renderLists()}
                        </List>
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer

                        variant="permanent"
                        open
                    >
                        <List>
                            <ListSubheader inset={true} disableSticky={true}>Chart Items</ListSubheader>
                            {this.renderLists()}
                        </List>
                    </Drawer>
                </Hidden>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        categories: state.chart.categories,
        checkedCategory: state.chart.activeCategory,
        activeCategories: state.chart.activeCategories,
        mobileOpen: state.chart.mobileOpen
    };
};

export default connect(
    mapStateToProps, {addActiveCategory, removeActiveCategory, setMobile, openErrorSnack}
)(withStyles(useStyles)(ChartItemNavigation));

