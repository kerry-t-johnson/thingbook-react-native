import React from "react";
import { ActivityIndicator, Button, Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import { DataTable, Dialog, Portal } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';
import io from 'socket.io-client';
import { apiEndpoint, fetchJson, formatTime } from "../shared/utils";
import DataSharingAgreement from "./DataSharingAgreement";

export default class DataSharingAgreementPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            agreement: undefined,
            observations: [],
            image_type: undefined,
            metrics: [],
            show_observations: false,
        };
    }

    componentDidMount() {
        const { id } = this.props.route.params;

        fetchJson(this.onAgreementReceived.bind(this), `/api/v1/data-sharing/agreement/${id}`);

        this.ws = io(apiEndpoint(`/data-sharing-agreement/${id}`));

        this.ws.on('sensor-things-observation', (observation) => {
            console.log(`@@ W/S Observation: ${JSON.stringify(observation)}`);

            this.setState((state, props) => {
                const newObservations = [observation, ...state.observations];
                while (newObservations.length > (this.props.maxLength ?? 50)) {
                    newObservations.pop();
                }

                return {
                    observations: newObservations,
                    image_type: 'publish',
                }
            });

            setTimeout(() => {
                this.setState((state, props) => {
                    return { image_type: undefined };
                })
            }, 1500);
        });

        this.ws.on('data-stream-metrics', (metrics) => {
            console.log(`@@ W/S Metrics: ${JSON.stringify(metrics)}`);

            this.setState((state, props) => {
                const newMetrics = [...state.metrics];
                for (let i = 0; i < newMetrics.length; ++i) {
                    if (newMetrics[i].metrics.name === metrics.metrics.name) {
                        newMetrics[i] = metrics;
                        return { metrics: newMetrics };
                    }
                }

                return {
                    metrics: [...newMetrics, metrics]
                }
            });
        });
    }

    onAgreementReceived(data) {
        this.setState({ agreement: data });
    }

    onViewObservations() {
        console.log('onViewObservations');
        this.setState({ show_observations: true });
    }

    onHideObservations() {
        console.log('onHideObservations');
        this.setState({ show_observations: false });
    }

    onGenerateTestData() {
        console.log('onGenerateTestData');

        fetch(apiEndpoint('/api/v1/development/sensor-things-test-data'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.agreement.producer.name,
            })
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
            });
    }


    render() {
        const { agreement, image_type } = this.state;

        const viewObservationsEnabled = this.state.observations.length > 0;
        const generateTestDataEnabled = true;

        if (agreement !== undefined) {

            return (
                <View style={{
                    flexDirection: 'column',
                    flexGrow: 1.0,
                }}>
                    <DataSharingAgreement
                        agreement={agreement}
                        image_type={image_type}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 5,
                            marginBottom: 50,
                        }}>
                        <Icon.Button
                            name='list'
                            mode='contained'
                            disabled={!viewObservationsEnabled}
                            backgroundColor={viewObservationsEnabled ? 'green' : 'grey'}
                            onPress={this.onViewObservations.bind(this)}>
                            Show observations
                             </Icon.Button>
                        <Icon.Button
                            name='play'
                            mode='contained'
                            disabled={!generateTestDataEnabled}
                            backgroundColor={generateTestDataEnabled ? 'green' : 'grey'}
                            onPress={this.onGenerateTestData.bind(this)}>
                            Generate test observations
                             </Icon.Button>
                    </View>
                    <Portal>
                        {this.state.show_observations &&
                            <Dialog
                                visible={this.state.show_observations}
                                style={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                }}>
                                <Dialog.Title
                                    style={{
                                        marginLeft: 10,
                                        marginRight: 10,
                                    }}>
                                    Recent Observations
                                </Dialog.Title>
                                <Dialog.Content
                                    style={{
                                        marginLeft: 0,
                                        marginRight: 0,
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                    }}>
                                    <ScrollView
                                        height={400}>
                                        <DataTable>
                                            <DataTable.Header>
                                                <DataTable.Title>Phenomenon Time</DataTable.Title>
                                                <DataTable.Title>Value</DataTable.Title>
                                            </DataTable.Header>
                                        </DataTable>
                                        {this.state.observations.map((observation, index) =>
                                            <DataTable.Row key={index}>
                                                <DataTable.Cell>{formatTime(observation.observation.phenomenonTime)}</DataTable.Cell>
                                                <DataTable.Cell>{observation.observation.result.toString()}</DataTable.Cell>
                                            </DataTable.Row>
                                        )}
                                    </ScrollView>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={this.onHideObservations.bind(this)} title="Done">Done</Button>
                                </Dialog.Actions>
                            </Dialog>
                        }
                    </Portal>
                </View>
            );
        }
        else {
            return (
                <ActivityIndicator />
            );
        }
    }

}