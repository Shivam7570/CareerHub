import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveSession, Modality, Blob, LiveServerMessage } from "@google/genai";
import Button from './shared/Button';
import Card from './shared/Card';
import Loader from './shared/Loader';

// Base64 encoding/decoding and audio processing helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const MockInterview: React.FC = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [stage, setStage] = useState<'idle' | 'starting' | 'in_progress' | 'ended'>('idle');
    const [currentQuestion, setCurrentQuestion] = useState('Getting ready...');
    const [liveFeedback, setLiveFeedback] = useState<string[]>([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const sessionPromise = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContext = useRef<AudioContext | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputGainNode = useRef<GainNode | null>(null);
    // FIX: Use a ref for nextStartTime to persist its value across re-renders, ensuring gapless audio playback.
    const nextStartTime = useRef(0);
    // FIX: Add a ref to track active audio sources to handle interruptions correctly.
    const sources = useRef(new Set<AudioBufferSourceNode>());

    const cleanup = () => {
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            mediaStream.current = null;
        }
        if (sessionPromise.current) {
            sessionPromise.current.then(session => session.close());
            sessionPromise.current = null;
        }
        if (scriptProcessor.current) {
            scriptProcessor.current.disconnect();
            scriptProcessor.current = null;
        }
        if (mediaStreamSource.current) {
            mediaStreamSource.current.disconnect();
            mediaStreamSource.current = null;
        }
        // FIX: Stop any playing audio sources on cleanup.
        sources.current.forEach(source => source.stop());
        sources.current.clear();
        inputAudioContext.current?.close();
        outputAudioContext.current?.close();
        
        console.log("Cleanup complete.");
    };

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);

    const handleStart = async () => {
        if (!jobTitle.trim()) {
            setError('Please enter a job title or area of focus.');
            return;
        }
        setStage('starting');
        setError(null);
        setLiveFeedback([]);
        setQuestionCount(0);
        setCurrentQuestion('Getting ready...');
        nextStartTime.current = 0;

        try {
            mediaStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream.current;
            }

            inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            outputGainNode.current = outputAudioContext.current.createGain();
            outputGainNode.current.connect(outputAudioContext.current.destination);

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            sessionPromise.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log('Session opened.');
                        if (!mediaStream.current || !inputAudioContext.current) return;
                        mediaStreamSource.current = inputAudioContext.current.createMediaStreamSource(mediaStream.current);
                        scriptProcessor.current = inputAudioContext.current.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };

                        mediaStreamSource.current.connect(scriptProcessor.current);
                        scriptProcessor.current.connect(inputAudioContext.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle Transcription and Commands
                        if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                            if (text.includes("QUESTION: ")) {
                                const newQuestion = text.split("QUESTION: ")[1];
                                setQuestionCount(prev => prev + 1);
                                setCurrentQuestion(newQuestion);
                            } else if (text.includes("FEEDBACK: ")) {
                                const newFeedback = text.split("FEEDBACK: ")[1];
                                setLiveFeedback(prev => [...prev.slice(-5), newFeedback]);
                            } else if (text.includes("concludes our mock interview")) {
                                setCurrentQuestion(text);
                                handleEnd();
                            }
                        }

                        // Handle Audio Output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContext.current && outputGainNode.current) {
                            nextStartTime.current = Math.max(nextStartTime.current, outputAudioContext.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext.current, 24000, 1);
                            const source = outputAudioContext.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputGainNode.current);
                            // FIX: Track audio sources to manage them, e.g., for interruptions.
                            source.addEventListener('ended', () => {
                                sources.current.delete(source);
                            });
                            source.start(nextStartTime.current);
                            nextStartTime.current += audioBuffer.duration;
                            sources.current.add(source);
                        }
                        
                        // FIX: Handle interruption messages to stop playback and provide a more natural conversation flow.
                        const interrupted = message.serverContent?.interrupted;
                        if (interrupted) {
                            for (const source of sources.current.values()) {
                                source.stop();
                                sources.current.delete(source);
                            }
                            nextStartTime.current = 0;
                        }
                    },
                    onerror: (e) => {
                        console.error('Session error:', e);
                        setError('A connection error occurred during the interview.');
                        handleEnd();
                    },
                    onclose: () => {
                        console.log('Session closed.');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: `You are an expert AI interviewer conducting a mock interview for a '${jobTitle}' role. The interview will have exactly 10 questions. For each turn, follow these steps: 1. State the question clearly, prefixed with "QUESTION: ". 2. Listen to the user's answer. 3. As they respond, provide concise, real-time feedback on their answer, prefixed with "FEEDBACK: ". 4. After they finish answering, wait a moment, then proceed to the next question. 5. After the 10th question and its feedback, conclude the interview by saying "This concludes our mock interview. Great practice!".`
                },
            });

            await sessionPromise.current;
            setStage('in_progress');
        } catch (err: any) {
            console.error("Failed to start interview:", err);
            setError(err.message || 'Could not start the interview. Please check camera/microphone permissions.');
            setStage('idle');
            cleanup();
        }
    };
    
    const handleEnd = () => {
        cleanup();
        setStage('idle');
    };

    if (stage === 'in_progress' || stage === 'starting') {
        return (
            <div className="relative w-full max-w-5xl mx-auto aspect-video bg-slate-950 rounded-lg overflow-hidden shadow-2xl">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full animate-pulse">
                        ● LIVE
                    </div>
                </div>

                <div className="absolute top-4 right-4 text-white bg-black/50 px-3 py-1.5 rounded-lg text-sm font-semibold">
                    Question: {Math.min(questionCount, 10)} / 10
                </div>

                <div className="absolute bottom-20 md:bottom-24 left-4 right-4 text-center">
                    <p className="text-white text-xl md:text-3xl font-bold drop-shadow-lg p-2 bg-black/50 rounded-lg">{currentQuestion}</p>
                </div>
                
                <div className="absolute bottom-4 left-4 w-1/3 max-h-20 overflow-y-auto space-y-1">
                    {liveFeedback.map((fb, i) => (
                        <p key={i} className="text-xs text-amber-300 bg-black/60 p-1 rounded-md shadow-lg animate-fade-in">{fb}</p>
                    ))}
                </div>

                <div className="absolute bottom-4 right-4">
                    <Button onClick={handleEnd} className="bg-red-600 hover:bg-red-500 focus:ring-red-500">
                        End Interview
                    </Button>
                </div>

                {stage === 'starting' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                        <Loader size="lg" />
                        <p className="text-white mt-4 text-lg">Starting Session...</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-16 md:pb-0">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">AI Mock Interview</h2>
                <p className="mt-4 text-lg text-slate-400">
                Practice your interview skills with a live AI. Get real-time feedback on your answers.
                </p>
            </div>

            {error && (
                <Card><div className="p-4 bg-red-900/50 text-red-300 rounded-lg"><p className="font-semibold">Error</p><p>{error}</p></div></Card>
            )}

            <Card>
                <div className="p-6 space-y-4">
                <label htmlFor="job-title" className="block text-sm font-medium text-slate-300">
                    What job title are you interviewing for?
                </label>
                <input
                    type="text"
                    id="job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Senior React Developer, Product Manager"
                />
                <div className="flex justify-end">
                    <Button onClick={handleStart} disabled={isLoading || stage === 'starting'}>
                        {stage === 'starting' ? <><Loader size="sm" /> Starting...</> : 'Start Interview'}
                    </Button>
                </div>
                </div>
            </Card>
        </div>
    );
};

export default MockInterview;