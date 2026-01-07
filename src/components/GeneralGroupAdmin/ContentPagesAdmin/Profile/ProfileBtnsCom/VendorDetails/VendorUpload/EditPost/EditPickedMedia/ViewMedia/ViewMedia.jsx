import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Nouislider from "nouislider-react";
import "nouislider/dist/nouislider.css";
import { fetchFile } from "@ffmpeg/util";
import { useUploadContext } from "../../../../../../../../../../../Providers/RealtorProvider/UploadProvider";

let ffmpeg;

const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [hrs, mins, secs].map((v) => v.toString().padStart(2, "0")).join(":");
};

const MAX_TRIM_DURATION = 120; // Maximum trim duration in seconds

const getValidFileUrl = async (uri) => {
    if (uri.startsWith("file://")) {
        const response = await fetch(uri);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }
    return uri;
};

const ViewMedia = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { updateMedia } = useUploadContext();
    const mediaItem = location.state?.mediaItem; // Retrieve media item from navigation state
    const mediaIndex = location.state?.index;
    const videoRef = useRef(null);
    const [sliderValues, setSliderValues] = useState([0, MAX_TRIM_DURATION]);
    const [videoDuration, setVideoDuration] = useState(0);
    const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
    const [isTrimming, setIsTrimming] = useState(false);

    if (!mediaItem) return <div>No media found</div>;

    useEffect(() => {
        const loadFFmpeg = async () => {
            // Check if SharedArrayBuffer is supported
            if (typeof SharedArrayBuffer === "undefined") {
                alert("Video trimming is not supported on your device. You can either: \n1. Use a computer to trim the video on this site. \n2. Trim the video outside the site and upload it.");
                return;
            }

            
            if (!window.FFmpeg) {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js";
                script.onload = async () => {
                    ffmpeg = window.FFmpeg.createFFmpeg({ log: true });
                    await ffmpeg.load();
                    setIsFFmpegLoaded(true);
                };
                document.head.appendChild(script);
            } else {
                ffmpeg = window.FFmpeg.createFFmpeg({ log: true });
                await ffmpeg.load();
                setIsFFmpegLoaded(true);
            }
        };

        loadFFmpeg();
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
                const duration = videoRef.current.duration;
                setVideoDuration(duration);
                setSliderValues([0, Math.min(MAX_TRIM_DURATION, duration)]);
            };
        }
    }, [mediaItem?.uri]);

    const onUpdateSliderChange = (values, handle) => {
        let newValues = [...sliderValues];
        let readValue = parseFloat(values[handle]) || 0;

        if (handle === 0) {
            // Adjusting the start time
            newValues[0] = readValue;
            newValues[1] = Math.min(readValue + MAX_TRIM_DURATION, videoDuration);
            if (videoRef.current) {
                videoRef.current.currentTime = readValue;
            }
        } else {
            // Adjusting the end time, ensuring it doesn't exceed MAX_TRIM_DURATION from start
            newValues[1] = Math.min(newValues[0] + MAX_TRIM_DURATION, videoDuration);
        }

        setSliderValues(newValues);
    };

    const handleTrim = async () => {
        if (!videoDuration) {
            return alert("Video is still loading. Please wait.");
        }

        if (!isFFmpegLoaded || !mediaItem?.uri) {
            return alert("FFmpeg is not loaded or media file is missing.");
        }

        setIsTrimming(true); // Start trimming

        try {
            const videoUri = await getValidFileUrl(mediaItem.uri);
            const videoBlob = await fetch(videoUri).then((res) => res.blob());
            ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoBlob));

            await ffmpeg.run(
                "-i",
                "input.mp4",
                "-ss",
                `${sliderValues[0]}`,
                "-to",
                `${sliderValues[1]}`,
                "-c",
                "copy",
                "output.mp4"
            );

            const data = ffmpeg.FS("readFile", "output.mp4");
            const trimmedBlob = new Blob([data.buffer], { type: "video/mp4" });
            const trimmedUrl = URL.createObjectURL(trimmedBlob);

            // Update the media array with the trimmed video
            const updatedMediaItem = { ...mediaItem, uri: trimmedUrl };
            updateMedia(mediaIndex, updatedMediaItem);

            // Navigate back after updating
            navigate(-1);
        } catch (error) {
            console.error("Trim failed:", error);
            alert("An error occurred while trimming.");
        } finally {
            setIsTrimming(false); // Reset after completion
        }
    };

    return (
        <div className="viewMediaContainer">
            {/* Back Button */}
            <button className="viewMediaBackButton" onClick={() => navigate(-1)}>
                <FaArrowLeft className="viewMediaBackIcon" />
            </button>

            {/* Display Media */}
            {mediaItem.type === "video" ? (
                <div>
                    <div className="mediaWrapper">
                        <video ref={videoRef} src={mediaItem.uri} className="viewMedia" controls />

                        {/* Slider */}
                        <Nouislider
                            behaviour="drag-tap"
                            range={{ min: 0, max: videoDuration || 1 }}
                            start={sliderValues}
                            connect
                            step={0.1}
                            onUpdate={onUpdateSliderChange}
                        />
                    </div>

                    {/* Trim functions */}
                    <div className="trim-function">
                        <p>
                            Start: {formatTime(sliderValues[0])} | End: {formatTime(sliderValues[1])}
                        </p>

                        <button onClick={handleTrim} disabled={!isFFmpegLoaded} className="trim-btn">
                            {isTrimming ? "Trimming..." : "Trim Video"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mediaWrapper">
                    <img src={mediaItem.uri} alt="Selected Media" className="viewMedia" />
                </div>
            )}
        </div>
    );
};

export default ViewMedia;