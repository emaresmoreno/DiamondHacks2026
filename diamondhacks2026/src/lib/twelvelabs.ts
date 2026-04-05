// import {addDoc, collection, updateDoc} from 'firebase/firestore';  // Added updateDoc
// import {TwelveLabs} from 'twelvelabs-js';

// import {db} from './firebase';

// const client = new TwelveLabs({apiKey: 'tlk_1KCZESN3FKYG7A2YPJTNZ2EY5X74'});
// const prompt =
//     'Return a JSON object. Provide \'features\': 3 words that describe studying amenities e.g. \'wooden table\', \'whiteboard\', \'bright lights\' and 1 word that describes overall vibe e.g. \'Industrial\', \'hasOutlets\': boolean, \'isAccessible\': boolean, \'focus_score\': number, \'freeTimeOfDay\': if there aren\'t too many people, add the time of day; else if not sure, default to empty string, \'\', \'rating\': from 1-10 on whether this is a good place to focus and has good studying amenities, \'popularity\': from 0.0 to 1.0, how busy the location is, \'sound\': from 0.0 to 1.0, how loud the location is}';

// const handleUploadAndAnalyze =
//     async (videoFile: File, lat: number, lng: number) => {
//   try {
//     // 1. Start Twelve Labs Indexing
//     const task = await client.index.task.create('YOUR_INDEX_ID', {
//       file: videoFile,
//     });
//     console.log('Upload started, Task ID:', task.id);

//     const docRef = await addDoc(collection(db, 'studySpots'), {
//       lat,
//       lon: lng,
//       status: 'analyzing',
//       name: 'New Study Spot',
//       taskId: task.id,
//       createdAt: new Date()
//     });

//     const interval = setInterval(async () => {
//       try {
//         const taskStatus = await client.index.task.retrieve(task.id);
//         console.log(`Current Status: ${taskStatus.status}`);

//         if (taskStatus.status === 'ready') {
//           clearInterval(interval);

//           // 4. Generate the Data
//           // Note: status.video_id is available once the task is 'ready'
//           const asset = await client.assets.create({
//             method: 'url',
//             url: '<YOUR_VIDEO_URL>',
//           });
//           const response = await client.generate.text(
//               taskStatus.video_id!,
//               'Return a JSON object: { "features": , "hasOutlets": boolean, "isAccessible": boolean, "features": string[], "focus_score": number }');

//           // 5. Clean and Parse JSON
//           // LLMs sometimes wrap JSON in markdown code blocks (```json ... ```)
//           const cleanJson = response.data.replace(/```json|```/g, '').trim();
//           const aiData = JSON.parse(cleanJson);

//           // 6. Update Firebase
//           await updateDoc(
//               docRef,
//               {...aiData, status: 'ready', videoId: taskStatus.video_id});

//           console.log('Analysis Complete!');
//         } else if (taskStatus.status === 'failed') {
//           clearInterval(interval);
//           console.error('Twelve Labs task failed');
//         }
//       } catch (pollError) {
//         console.error('Error during polling:', pollError);
//       }
//     }, 5000);

//   } catch (error) {
//     console.error('AI Analysis failed:', error);
//   }
// };