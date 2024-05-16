import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Result = ({ route }) => {
    const { result } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.resultText}>Result from API:</Text>
            <Text style={styles.result}>{JSON.stringify(result, null, 2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    result: {
        marginTop: 20,
        fontSize: 16,
    },
});

export default Result;