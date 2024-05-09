import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme'; // Import your theme file

export default function Result() {
    const [modelData, setModelData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://your-flask-api-host/model-data');
            setModelData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.darkNavyBlue }}>
            <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 50, color: COLORS.white }}>Test Results</Text>
            <LinearGradient
                colors={[COLORS.darkNavyBlue, COLORS.navyBlue]}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: SIZES.base * 2,
                    marginVertical: 8,
                }}
            >
                <Text style={{ textAlign: 'center', fontSize: 20, color: COLORS.white }}>Bar Chart - Stuttering</Text>
                <BarChart
                    data={{
                        labels: ['Non-Stuttering', 'Stuttering'],
                        datasets: [
                            {
                                label: 'Stuttering Frequency',
                                data: [modelData?.nonStuttering || 0, modelData?.stuttering || 0],
                            },
                        ],
                    }}
                    width={SIZES.width - SIZES.base * 4}
                    height={200}
                    yAxisLabel="Count"
                    chartConfig={{
                        backgroundGradientFrom: COLORS.darkNavyBlue,
                        backgroundGradientTo: COLORS.navyBlue,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        strokeWidth: 2,
                    }}
                    style={{ marginVertical: 8 }}
                />
            </LinearGradient>

            <LinearGradient
                colors={[COLORS.darkNavyBlue, COLORS.navyBlue]}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: SIZES.base * 2,
                    marginVertical: 8,
                }}
            >
                <Text style={{ textAlign: 'center', fontSize: 20, color: COLORS.white }}>Bar Chart - Confidence</Text>
                <BarChart
                    data={{
                        labels: ['Not Confident', 'Confident'],
                        datasets: [
                            {
                                label: 'Confidence Frequency',
                                data: [modelData?.confidence || 0, modelData?.confidence ? 100 - modelData.confidence : 0],
                            },
                        ],
                    }}
                    width={SIZES.width - SIZES.base * 4}
                    height={200}
                    yAxisLabel="Count"
                    chartConfig={{
                        backgroundGradientFrom: COLORS.darkNavyBlue,
                        backgroundGradientTo: COLORS.navyBlue,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        strokeWidth: 2,
                    }}
                    style={{ marginVertical: 8 }}
                />
            </LinearGradient>

        </View>
    );
}