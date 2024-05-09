import React, { useState, useEffect , useLayoutEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

// Import theme colors and sizes
import { COLORS, SIZES } from '../constants/theme';

// Import quiz data
import quizData from '../data/EQquizdata';

const Try = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions(
          {
           headerShown : false, 
          }
        )
    }, [])
    const [isRecording, setIsRecording] = useState(false);
    const [recordingInstance, setRecordingInstance] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        // Request camera permission
        const requestCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        };

        requestCameraPermission();
    }, []);

    // Function to start recording
    const startRecording = async () => {
        setIsRecording(true);
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Camera permission is required to record video.');
                setIsRecording(false);
                return;
            }
            const recording = new Camera.Recording();
            await recording.prepareToRecordAsync(Camera.Constants.VideoQuality['1080p']);
            await recording.startAsync();
            setRecordingInstance(recording); // Store recording instance to access later
        } catch (error) {
            console.error('Error starting recording:', error);
            setIsRecording(false);
            Alert.alert('Error', 'Failed to start recording. Please try again.');
        }
    };

    // Function to stop recording
    const stopRecording = async () => {
        setIsRecording(false);
        if (recordingInstance) {
            try {
                await recordingInstance.stopAndUnloadAsync();
                const videoUri = recordingInstance.getURI();
                await saveRecording(videoUri);
            } catch (error) {
                console.error('Error stopping recording:', error);
                Alert.alert('Error', 'Failed to stop recording. Please try again.');
            }
        }
    };

    // Function to handle saving video recording
    const saveRecording = async (videoUri) => {
        try {
            const recordingDirectory = `${FileSystem.documentDirectory}recordings`;
            await FileSystem.makeDirectoryAsync(recordingDirectory, { intermediates: true });
            const timestamp = new Date().getTime();
            const videoFilename = `${timestamp}.mp4`;
            await FileSystem.moveAsync({
                from: videoUri,
                to: `${recordingDirectory}/${videoFilename}`,
            });
            // Optionally, you can send the video to a backend here
            Alert.alert('Recording Saved', 'Your recording has been saved successfully.');
        } catch (error) {
            console.error('Error saving recording:', error);
            Alert.alert('Error', 'Failed to save recording. Please try again.');
        }
    };

    // Function to handle moving to the next question
    const goToNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Handle quiz completion
            Alert.alert(
                'Quiz Completed',
                'You have completed the quiz.',
                [
                    {
                        text: 'Results',
                        onPress: () => navigation.navigate('result') // Navigate to Result screen
                    }
                ]
            );
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {/* Quiz content */}
            <View style={styles.quizContent}>
                <Text style={styles.questionText}>{quizData[currentQuestionIndex].question}</Text>
            </View>

            {/* Conditional rendering for camera preview */}
            {isRecording && hasCameraPermission && (
                <View style={styles.cameraPreview}>
                    <Camera style={{ flex: 1 }} type={Camera.Constants.Type.front} />
                </View>
            )}

            {/* Button to start recording */}
            {!isRecording && (
                <TouchableOpacity onPress={startRecording}>
                    <View style={[styles.actionButton, { backgroundColor: COLORS.success }]}>
                        <Text style={styles.buttonText}>Start Recording</Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Button to stop recording and submit answer */}
            {isRecording && (
                <TouchableOpacity onPress={stopRecording}>
                    <View style={[styles.actionButton, { backgroundColor: COLORS.error }]}>
                        <Text style={styles.buttonText}>Stop Recording & Submit</Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Next button to move to the next question */}
            <TouchableOpacity onPress={goToNextQuestion}>
                <View style={styles.nextButton}>
                    <Text style={styles.buttonText}>Next</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SIZES.base * 2,
    },
    quizContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionText: {
        color: COLORS.white,
        fontSize: SIZES.base * 2,
    },
    cameraPreview: {
        flex: 1,
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.base * 2,
        borderRadius: SIZES.base,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SIZES.base * 2,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: SIZES.base * 1.5,
    },
    nextButton: {
        backgroundColor: COLORS.secondary,
        padding: SIZES.base * 2,
        borderRadius: SIZES.base,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SIZES.base * 2,
    },
});

export default Try;
