import React from "react";
import Carousel from 'react-native-snap-carousel';
import { fetchJson } from "../shared/utils";
import { Dimensions, View } from "react-native";
import DataSharingAgreement from "./DataSharingAgreement";


export default class DataSharingAgreementCarousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                items: [],
                page: {}
            },
        }
    }

    componentDidMount() {
        fetchJson(this.onAgreements.bind(this), '/api/v1/data-sharing/agreement');
    }

    onAgreements(results) {
        this.setState({ data: results });
    }

    renderItem({ item, index }) {
        const windowWidth = Dimensions.get('window').width;
        return (
            <DataSharingAgreement
                key={index}
                agreement={item}
                link
                navigation={this.props.navigation} />
        );
    }

    render() {
        const windowWidth = Dimensions.get('window').width;
        const { items } = this.state.data;

        if (items.length > 0) {

            return (
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={items}
                    renderItem={this.renderItem.bind(this)}
                    itemWidth={windowWidth}
                    sliderWidth={windowWidth}
                    loop={true}
                    autoplay={true}
                    onPress={() => console.log('foo')}
                    style={{
                        flexGrow: 1.0,
                    }}
                />
            );

        }
        else {
            return null;
        }
    }
}
