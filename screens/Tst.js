import React, { useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const TestUpload = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const handlePickDocument = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
      setSelectedVideo(document);
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleUploadVideo = async () => {
    if (!selectedVideo) {
        Alert.alert('Error', 'Please select a video file first.');
        return;
    }

    const formData = new FormData();
    formData.append('video', selectedVideo.uri);

    try {
        const apiUrl = 'http://192.168.1.19:5000/upload';

        const response = await Promise.race([
            fetch(apiUrl, {
                method: 'POST',
                body: formData
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 90000) // Set timeout to 90 seconds
            )
        ]);
        
        if (response.ok) {
            console.log(selectedVideo.uri)
            console.log('upload success',response)
            const data = await response.json();
            setUploadResult(data);
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        Alert.alert('Error', error.message);
    }
};

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pick Video" onPress={handlePickDocument} />
      <Button title="Upload Video" onPress={handleUploadVideo} />
      {uploadResult && (
        <View>
          <Text>Upload Result:</Text>
          <Text>{JSON.stringify(uploadResult)}</Text>
        </View>
      )}
    </View>
  );
};

export default TestUpload;