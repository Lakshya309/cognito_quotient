import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import {useLayoutEffect} from 'react'
import { Camera } from 'expo-camera';
import { RTCView } from 'expo-av';
import { useNavigation } from '@react-navigation/native'
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

// Import theme colors and sizes
import { COLORS, SIZES } from '../constants/theme';

// Import quiz data
import quizData from '../data/EQquizdata'

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
    const [streamURL, setStreamURL] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
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
        // Start recording logic
    };

    // Function to stop recording
    const stopRecording = async () => {
        setIsRecording(false);
        // Stop recording logic
    };

    // Function to handle saving video and audio recordings
    const saveRecording = async (videoUri, audioUri) => {
        try {
            // Create directory for recordings if it doesn't exist
            const recordingDirectory = `${FileSystem.documentDirectory}recordings`;
            await FileSystem.makeDirectoryAsync(recordingDirectory, { intermediates: true });

            // Generate unique filenames for video and audio recordings
            const timestamp = new Date().getTime();
            const videoFilename = `${timestamp}.mp4`;
            const audioFilename = `${timestamp}.m4a`;

            // Move video recording to the recordings directory
            await FileSystem.moveAsync({
                from: videoUri,
                to: `${recordingDirectory}/${videoFilename}`,
            });

            // Move audio recording to the recordings directory
            await FileSystem.moveAsync({
                from: audioUri,
                to: `${recordingDirectory}/${audioFilename}`,
            });

            // Save recording details to quizData
            quizData[currentQuestionIndex].videoRecording = `${recordingDirectory}/${videoFilename}`;
            quizData[currentQuestionIndex].audioRecording = `${recordingDirectory}/${audioFilename}`;

            // Show success message
            Alert.alert('Recording Saved', 'Your recording has been saved successfully.');

        } catch (error) {
            console.error('Error saving recording:', error);
            Alert.alert('Error', 'Failed to save recording. Please try again.');
        }
    };

    // Function to handle submitting answer
    const submitAnswer = async () => {
        // Placeholder for video and audio recording URIs
        const videoUri = 'placeholder-video-uri';
        const audioUri = 'placeholder-audio-uri';

        // Save recording
        await saveRecording(videoUri, audioUri);
    };

    // Function to handle moving to the next question
    const goToNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Handle quiz completion
            Alert.alert('Quiz Completed', 'You have completed the quiz.');
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

            {/* Conditional rendering for incoming video stream */}
            {!isRecording && streamURL && (
                <View style={styles.videoStream}>
                    <RTCView streamURL={streamURL} style={{ flex: 1 }} />
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
    videoStream: {
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

export default Try