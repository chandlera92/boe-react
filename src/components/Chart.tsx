import React from 'react';
import {connect} from "react-redux";
import {differenceWith, isEqual} from 'lodash';

import * as d3 from 'd3';
import {withFauxDOM} from 'react-faux-dom'
import {Button, Checkbox, Typography, withStyles} from "@material-ui/core";
import {ChartNavigationItem, dataPoint, removeActiveCategory, setCheckedCategory} from "../actions/chart.action";
import Box from "@material-ui/core/Box";

import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

const useStyles = () => ({
    checkBoxSize: {
        fontSize: '2rem'
    }
});


class Chart extends React.Component<any, any> {


    componentDidMount(): void {
        this.renderChart()
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {


        const activeCategoryChanged = differenceWith(this.props.activeCategories, prevProps.activeCategories, isEqual);
        const checkedCategoryChanged = this.props.checkedCategory.id !== prevProps.checkedCategory.id || this.props.checkedCategory.data.id !== prevProps.checkedCategory.data.id;

        // Will run indefinitely unless we check if prev props / current props are different from one another before proceeding..
        if (!activeCategoryChanged.length && !checkedCategoryChanged) {
            return;
        }

        const faux = this.props.connectFauxDOM('svg', 'chart');
        let svg = d3.select(faux);

        if (activeCategoryChanged.length) {
            this.updateChart(svg, activeCategoryChanged[0]);
        }

        if (checkedCategoryChanged) {
            this.updateYAxis(svg);
        }

        for (let category of this.props.activeCategories) {
            svg.select(`.chart__data[id="${category.id}"]`)
                .attr('class', this.buildClassList('chart__data', category));
        }

        this.props.animateFauxDOM(1250)
    }

    private margin: { top: number, right: number, bottom: number, left: number } = {
        top: 40,
        right: 100,
        bottom: 30,
        left: 70
    };
    private height: number = 540 - this.margin.top - this.margin.bottom;
    private width: number = 1280 - this.margin.left - this.margin.right;

    chartLineClass = 'chart__line';
    chartMarkerClass = 'chart__marker';

    x = d3.scalePoint().range([0, this.width]);
    y = d3.scaleLinear().rangeRound([this.height, 0]);

    lineData = d3.line()
    // @ts-ignore
        .x((d: dataPoint) => this.x(d.year))
        .y((d: dataPoint) => this.y(d.value))
        .curve(d3.curveMonotoneX);

    updateYAxis(svg: any) {
        const active = this.props.checkedCategory.active;
        const points = this.props.checkedCategory.data.points;

        let yDomain = active ? [this.getMin(points), this.getMax(points)] : [0, 1];

        this.y
            .domain(yDomain)
            .nice();

        svg.select(".y.axis")
            .transition()
            .duration(750)
            // @ts-ignore
            .call(d3.axisLeft(this.y));
    }


    // This updates the line data and circles.
    updateChart(svg: any, item: ChartNavigationItem) {
        let yDomain = [this.getMin(item.data.points), this.getMax(item.data.points)];

        this.y
            .domain(yDomain)
            .nice();


        let selector = svg.select(`.chart__data[id="${item.id}"]`);

        let line = selector
            .select('.chart__line')
            .data([item.data.points]);

        line.exit().remove();

        line
            .transition()
            .duration(1250)
            .attr("d", this.lineData);


        let lY = this.y;

        let circles = selector
            .selectAll('.chart__marker')
            .data(item.data.points);

        circles.exit().remove();

        circles.transition()
            .duration(1250)
            .attr("cy", (d: dataPoint | any) => lY(d.value));

    }

    buildClassList(base: string, item: ChartNavigationItem) {
        let baseClass = `${base}`;

        if (item.active) {
            baseClass = `${baseClass} ${base}--active`;
        }

        if (item.id === this.props.checkedCategory.id) {
            baseClass = `${baseClass} ${base}--checked`;
        }

        return baseClass
    }


    renderChart() {
        const div = this.props.connectFauxDOM('svg', 'chart');
        const points = this.props.checkedCategory.data.points;

        let svg = d3
            .select(div)
            .attr("viewBox", "0 0 1220 520")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .append("g")
            .attr("transform", `translate(${this.margin.left},20)`);

        this.y
            .domain([this.getMin(points), this.getMax(points)])
            .nice();

        this.x
            .domain(points.map((d: any) => d.year));

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(this.y));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${this.height})`)
            .call(d3.axisBottom(this.x));

        for (let item of this.props.activeCategories) {
            this.y
                .domain([this.getMin(item.data.points), this.getMax(item.data.points)])
                .nice();


            svg.append("g")
                .attr("class", 'chart__data')
                .attr('id', item.id);

            let selector = svg.select(`.chart__data[id="${item.id}"]`)
                .attr('class', this.buildClassList('chart__data', item));


            selector
                .selectAll(`.${this.chartLineClass}`)
                .data([item.data.points])
                .enter()
                .append('path')
                .attr('d', this.lineData)
                .attr('stroke', item.color)
                .attr('fill', 'none')
                .attr('class', 'chart__line');

            let lX = this.x;
            let lY = this.y;

            selector
                .selectAll(`.${this.chartMarkerClass}`)
                .data(item.data.points)
                .enter()
                .append("circle")
                .attr("r", 7)
                // @ts-ignore
                .attr("cx", function (d: dataPoint) {
                    return lX(JSON.stringify(d.year))
                })
                .attr("cy", function (d: dataPoint) {
                    // @ts-ignore
                    return lY(d.value)
                })
                .attr("stroke", "#fff")
                .attr("stroke-width", "2px")
                .attr("fill", item.color)
                .attr('class', 'chart__marker');

        }


    }


    getMin(data: any) {
        let minDataPoint = d3.min(data, function (d: any) {
            if (d.value < 0) {
                return d.value * 100 / 90
            } else {
                return d.value / 100 * 90
            }
        });


        return minDataPoint;
    }

    getMax(data: any): any {
        let maxDataPoint = d3.max(data, function (d: any) {
            if (d.value < 0) {
                return d.value * 100 / 110
            } else {
                return d.value / 100 * 110
            }
        });

        return maxDataPoint;
    }

    checkNavigation = (item: ChartNavigationItem) => {
        if (item.id !== this.props.checkedCategory.id) {
            this.props.setCheckedCategory(item)
        }
    };

    renderChartHeader() {
        return (
            <Box>
                <Box mb={1}>
                    <Typography variant={'subtitle1'} align={'center'}>
                        {this.props.checkedCategory.data.header}
                    </Typography>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography variant='body2'>{this.props.checkedCategory.data.unit}</Typography>
                    <Typography variant='body2'>{this.props.checkedCategory.data.title}</Typography>
                </Box>
            </Box>
        )
    }


    render() {
        return (
            <div className="chart__wrapper">
                <div className={`chart__container`}>
                    {this.renderChartHeader()}
                    <div className="chart__graphic">
                        {this.props.chart}
                    </div>
                </div>
                <div className="chart__navigation">
                    {this.props.activeCategories.map((item: ChartNavigationItem) => {
                        return (
                            <div key={item.id}
                                 className={`chart__navigation__item ${item.active ? 'chart__navigation__item--active' : 'chart__navigation__item--disabled'}`}>
                                <Box mb={1} alignSelf={'flex-end'}>
                                    <Button onClick={() => this.props.removeActiveCategory(item.data)}>
                                        Remove
                                    </Button>
                                </Box>

                                <div className="chart__navigation__item__content">
                                    <div className="chart__navigation__item__content--header">
                                        <Typography variant='subtitle2'>{item.data.section}</Typography>
                                    </div>
                                    <div className="chart__navigation__item__content--title">
                                        <Typography variant='body2'> {item.data.header}</Typography>
                                    </div>
                                    <div className="chart__navigation__item__content--graphic">
                                        <svg height="50px" width="100%">
                                            <line className="chart__navigation__item__content--graphic-line"
                                                  stroke={item.color} x1="25%" y1="50%" x2="75%" y2="50%"/>
                                            <circle className="chart__navigation__item__content--graphic-circle"
                                                    fill={item.color} cx="50%" cy="50%" r="10"/>
                                        </svg>
                                    </div>
                                    <div className="chart__navigation__checkbox">
                                        <Checkbox
                                            style={{color: item.color}}
                                            className={`chart__checkIcon--${item.colorClass}`}
                                            disabled={!item.active}
                                            icon={<CheckBoxOutlineBlankIcon fontSize={'large'}/>}
                                            checkedIcon={<CheckBoxIcon fontSize={'large'}/>}
                                            edge={false}
                                            checked={this.props.checkedCategory.id === item.id && this.props.checkedCategory.active === true}
                                            onChange={() => item.active ? this.checkNavigation(item) : null}
                                        />
                                    </div>
                                </div>


                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        categories: state.chart.categories,
        checkedCategory: state.chart.checkedCategory,
        activeCategories: state.chart.activeCategories
    };
};

export default withFauxDOM(connect(
    mapStateToProps, {removeActiveCategory, setCheckedCategory}
)(withStyles(useStyles)(Chart)));
