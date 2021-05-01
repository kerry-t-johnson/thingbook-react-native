import React from "react";
import { Link } from "react-router-native";
import AutoHeightImage from 'react-native-auto-height-image';
import { Dimensions, Text, TouchableHighlight, View } from "react-native";

export default class DataSharingAgreement extends React.Component {



    render() {
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Dimensions.get('window').height;
        const { agreement, image_type = undefined, link = false } = this.props;

        const imageURL = agreement.extraImageURLs[image_type] ?? agreement.imageURL;

        return (
            <View
                style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    flexGrow: 1.0,
                }}>
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}>
                    {agreement.name}
                </Text>
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 14,
                    }}>
                    Producer: {agreement.producer.name}
                </Text>
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        flexGrow: 1.0,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <TouchableHighlight
                            style={{
                                flexGrow: 1.0,
                            }}
                            onPress={() => link && this.props.navigation.navigate(
                                'Agreement', {
                                id: agreement._id,
                            })}>
                            <AutoHeightImage
                                source={{ uri: imageURL }}
                                width={windowWidth * .99}
                            />
                        </TouchableHighlight>
                    </View>
                </View>
            </View >
        );
    }
}