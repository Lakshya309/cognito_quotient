import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

export default function Result() {
    // Generate random values for nonStuttering and Stuttering
    const nonStuttering = getRandomInt(3, 4); // Always greater than 2
    const stuttering = 4 - nonStuttering; // Stuttering is 4 - nonStuttering
    const confidence = getRandomInt(1, 4) * 25; // Generate confidence between 25% and 100%

    // Function to generate random integer between min and max (inclusive)
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0D1B2A', padding: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 50, color: '#FFFFFF' }}>Test Results</Text>
            <LinearGradient
                colors={['#0D1B2A', '#1F3A5B']}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    marginVertical: 8,
                }}
            >
                <Text style={{ textAlign: 'center', fontSize: 20, color: '#FFFFFF' }}>Bar Chart - Stuttering</Text>
                <BarChart
                    data={{
                        labels: ['Non-Stuttering', 'Stuttering'],
                        datasets: [
                            {
                                label: 'Stuttering Frequency',
                                data: [nonStuttering, stuttering],
                            },
                        ],
                    }}
                    width={300}
                    height={200}
                    yAxisLabel="Count"
                    chartConfig={{
                        backgroundGradientFrom: '#0D1B2A',
                        backgroundGradientTo: '#1F3A5B',
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        strokeWidth: 2,
                    }}
                    style={{ marginVertical: 8 }}
                />
            </LinearGradient>

            <LinearGradient
                colors={['#0D1B2A', '#1F3A5B']}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    marginVertical: 8,
                }}
            >
                <Text style={{ textAlign: 'center', fontSize: 20, color: '#FFFFFF' }}>Bar Chart - Confidence</Text>
                <BarChart
                    data={{
                        labels: ['Not Confident', 'Confident'],
                        datasets: [
                            {
                                label: 'Confidence Frequency',
                                data: [confidence, 100 - confidence],
                            },
                        ],
                    }}
                    width={300}
                    height={200}
                    yAxisLabel="Count"
                    chartConfig={{
                        backgroundGradientFrom: '#0D1B2A',
                        backgroundGradientTo: '#1F3A5B',
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        strokeWidth: 2,
                    }}
                    style={{ marginVertical: 8 }}
                />
            </LinearGradient>

        </View>
    );
}
