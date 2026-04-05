import React, { useState, useRef } from 'react';
import { addDoc, collection, updateDoc } from 'firebase/firestore';  // Added updateDoc
import { TwelveLabs } from 'twelvelabs-js';
import { Input } from "../components/ui/input";

import { db } from '../lib/firebase';

interface VideoInsertionProps {
    lat: number;
    lng: number;
}

const VideoInsertionPage: React.FC<VideoInsertionProps> = ({ lat, lng }) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [query, setQuery] = useState("");

    // Explicitly type your Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);

    const startRecording = async (locationName: string): Promise<void> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = stream;
            }

            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
                const videoFile = new File([blob], "webcam_capture.mp4", { type: 'video/mp4' });

                handleUploadAndAnalyze(videoFile, lat, lng, locationName);

                // Cleanup tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Access denied or hardware error:", err);
        }
    };

    const stopRecording = (): void => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const client = new TwelveLabs({ apiKey: 'tlk_1KCZESN3FKYG7A2YPJTNZ2EY5X74' });
    const prompt =
        'Return a JSON object. Provide \'features\': 4 words that describe studying amenities or vibe of the space in the video e.g. \'wooden table\', \'whiteboard\', \'bright lights\' \'Industrial\', \'hasOutlets\': boolean, \'isAccessible\': boolean, \'focus_score\': number, \'freeTimeOfDay\': if there aren\'t too many people, add the time of day; else if not sure, default to empty string, \'\', \'rating\': from 0-5 on whether this is a good place to focus and has good studying amenities, \'popularity\': from 0.0 to 1.0, how busy the location is, \'sound\': from 0.0 to 1.0, how loud the location is}';
    // const handleUploadAndAnalyze = async (videoFile: File, lat: number, lng: number, locationName: string) => {

    //     try {
    //         const formData = new FormData();
    //         formData.append('file', videoFile);

    //         const uploadRes = await fetch('https://api.twelvelabs.io/v1.3/assets', {
    //             method: 'POST',
    //             headers: { 'x-api-key': 'tlk_1KCZESN3FKYG7A2YPJTNZ2EY5X74' },
    //             body: formData
    //         });

    //         if (!uploadRes.ok) throw new Error('Upload failed');
    //         const asset = await uploadRes.json();
    //         const assetId = asset.id;

    //         // 2. Create the Firebase doc in "analyzing" state
    //         const docRef = await addDoc(collection(db, 'studySpots'), {
    //             lat,
    //             lon: lng,
    //             status: 'analyzing',
    //             name: locationName || 'Unnamed Spot',
    //             assetId: assetId,
    //             createdAt: new Date()
    //         });

    //         // 3. Start Analysis (Fetch version)
    //         // Since streaming via Fetch is complex in the browser, 
    //         // we'll use the standard (non-streaming) 'analyze' endpoint for simplicity.
    //         const analyzeRes = await fetch('https://api.twelvelabs.io/v1.3/analyze', {
    //             method: 'POST',
    //             headers: {
    //                 'x-api-key': 'tlk_1KCZESN3FKYG7A2YPJTNZ2EY5X74',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 video: { type: "asset_id", assetId: assetId },
    //                 prompt: prompt, // Using your existing prompt variable
    //             })
    //         });

    //         if (!analyzeRes.ok) throw new Error('Analysis request failed');
    //         const result = await analyzeRes.json();

    //         // 4. Parse & Update Firebase
    //         // result.data usually contains the text response from Twelve Labs
    //         const fullResponse = result.data || "";

    //         try {
    //             const cleanJson = fullResponse.replace(/```json|```/g, '').trim();
    //             const aiData = JSON.parse(cleanJson);

    //             await updateDoc(docRef, {
    //                 ...aiData,
    //                 id: docRef.id, // Better to use the real Firebase ID
    //                 status: 'ready'
    //             });

    //             console.log('Analysis Complete and Firebase Updated!');
    //         } catch (jsonError) {
    //             console.error("JSON Parse failed. Response was:", fullResponse);
    //             await updateDoc(docRef, { status: 'error', rawResponse: fullResponse });
    //         }

    //     } catch (error) {
    //         console.error('AI Analysis failed:', error);
    //     }
    // };

    const handleUploadAndAnalyze = async (videoFile: File, lat: number, lng: number, locationName: string) => {
        try {
            // 1. Upload the file directly
            const asset = await client.assets.create({
                method: "direct",
                file: videoFile,
            });

            // 2. Start the analysis stream immediately
            const textStream = await client.analyzeStream({
                video: { type: "asset_id", assetId: asset.id ?? "" },
                prompt: prompt,
            });

            // 3. Create the Firebase doc in "analyzing" state
            const docRef = await addDoc(collection(db, 'studySpots'), {
                lat,
                lon: lng,
                status: 'analyzing',
                name: locationName || '',
                id: locationName.toLowerCase().replace(/ /g, ""),
                assetId: asset.id,
                createdAt: new Date()
            });

            // 4. Capture the stream chunks into one string
            let fullResponse = "";
            for await (const chunk of textStream) {
                if ("text" in chunk) {
                    fullResponse += chunk.text;
                    console.log("Chunk received:", chunk.text);
                }
            }

            // 5. Once stream is finished, parse and update Firebase
            // No setInterval or Polling needed!
            try {
                const cleanJson = fullResponse.replace(/```json|```/g, '').trim();
                const aiData = JSON.parse(cleanJson);

                await updateDoc(docRef, {
                    ...aiData,
                    status: 'ready'
                });

                console.log('Analysis Complete and Firebase Updated!');
            } catch (jsonError) {
                console.error("JSON Parse failed. Response was:", fullResponse);
                await updateDoc(docRef, { status: 'error', rawResponse: fullResponse });
            }

        } catch (error) {
            console.error('AI Analysis failed:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div className="flex items-center gap-4">
                <h2>Location</h2>  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Insert Name"
                    className="h-12 text-base bg-card shadow-sm"
                />
            </div>
            <video
                ref={videoPreviewRef}
                autoPlay
                muted
                style={{ width: '100%', maxWidth: '400px', background: '#333', display: 'block', margin: '10px 0' }}
            />
            {/* {!isRecording ? (
                <button onClick={() => startRecording(query)}>Start Camera</button>
            ) : (
                <button onClick={stopRecording} style={{ color: 'red' }}>Stop & Save</button>
            )} */}

            <div className="flex justify-center mt-6">
                {!isRecording ? (
                    <button
                        onClick={() => startRecording(query)}
                        disabled={!query.trim()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
                    >
                        {/* Simple Camera Icon (SVG) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
                    >
                        {/* Simple Stop Square (SVG) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <rect x="5" y="5" width="10" height="10" />
                        </svg>
                        Stop & Save
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoInsertionPage;