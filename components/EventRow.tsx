import * as React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useAppState } from '../state/AppState';
import { Text, View } from './Themed';

export const EventRow = observer(({id}: {id: number}) => {
    const { testState } = useAppState();

    const { models } = testState;
    const eventModel = models.getEvent(id);

    if (eventModel === null) {
        return null;
    }

    const marketMain = eventModel.marketsWithWebsiteMain !== null ? eventModel.marketsWithWebsiteMain[0] ?? null : null;

    return (
        <View style={styles.container}>
            <View style={styles.eventName}>
                <Text numberOfLines={1}>{eventModel.name}</Text>
            </View>
            {marketMain !== null ? (
                <View style={styles.selections}>
                    {
                        marketMain.selectionsIds.map(selectionId => {
                            const selectionModel = models.getSelectionAndLoad(marketMain.id, selectionId);

                            if (selectionModel === null) {
                                return null;
                            }

                            const selectionForView = selectionModel.forView();

                            if (selectionForView === null) {
                                return null;
                            }

                            selectionForView.priceChange
                            return (
                                <View style={{...styles.singleSelection, ...priceChangeWrapper(selectionForView.priceChange)}}>
                                    <Text style={{ color: '#055ca9', fontWeight: '700' }}>{selectionForView.displayPrice}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            ) : null}
        </View>
    )

});

const priceChangeWrapper = (direction: 'up' | 'down' | null) => {
    if (direction === 'up') {
        return {
            backgroundColor: '#00ff00'
        }
    }
    if (direction === 'down') {
        return {
            backgroundColor: '#ff0000'
        }
    }
    return {}
}


const styles = StyleSheet.create({
    container: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#e8ebef',
        borderBottomWidth: 1,
    },
    eventName: {
        maxWidth: '60%',
    },
    selections: {
        minWidth: '30%',
        marginLeft: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    singleSelection: {
        width: 50,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#e8ebef',
        borderBottomWidth: 1,
        borderBottomColor: '#e8ebef',
    },
});
