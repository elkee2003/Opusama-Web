// This code is what was in the video, but slightly changed so if I really want to make this code work, I have to start from 32:25

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Nouislider from 'nouislider-react';
import 'nouislider/dist/nouislider.css';

let ffmpeg;

const ViewMedia = () => {

  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(40);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFileValue, setVideoFileValue] = useState('');

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const [videoTrimmedUrl, setVideoTrimmedUrl] =  useState('');

  const [videoDuration, setVideoDuration] = useState(0);

  const videoRef = useRef();

  let initialSliderValue = 0;
  
  const handleFileUpload = (e) => {
    let file = e.target.files[0]

    const blobURL = URL.createObjectURL(file);
    setVideoFileValue(file);
    setVideoSrc(blobURL);
  };

  const handlePlay = () =>{
    if(videoRef && videoRef.current){
      videoRef.current.play();
    }
  };

  const handlePauseVideo = () => {
    // if(videoRef && videoRef.current){
    //   videoRef.current.pause();
    // }
  }

  const onUpdateSliderChange = (values, handle)=>{
    setVideoTrimmedUrl('');
    let readValue

    if (handle) {
      readValue= values[handle] || 0;
      if(endTime !== readValue){
        setEndTime(readValue);
      }
    }else {
      readValue = values[handle] || 0;
      if(initialSliderValue !== readValue) {
        initialSliderValue = readValue;
        if(videoRef && videoRef.current){
          videoRef.current.currentTime = readValue;
          setStartTime(readValue);
        }
      }
    }
  }


  const loadScript = (src) =>{
    return new Promise ((onFulfilled, _)=> {
      const script = document.createElement('script');
      let loaded;
      script.async = 'async'
      script.defer = 'defer'
      script.setAttribute('src', src);
      script.onreadystatechange = script.onload = () => {
        if(!loaded) {
          onFulfilled(script);
        }
        loaded = true;
      };
      script.onerror = function () {
        console.log('Script failed to load');
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  };

  useEffect(()=>{
    // load
    loadScript('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js').then(()=>{
      if(typeof window !== 'undefined') {
        ffmpeg = window.FFmpeg.createFFmpeg({
          log:true
        });

        ffmpeg.load();

        setIsScriptLoaded(true);
      }
    })
  }, []);

  useEffect(()=>{
    if(videoRef && videoRef.current){
      const currentVideo = videoRef.current;
      currentVideo.onloadedmetadata = () => {
        setVideoDuration(currentVideo.duration);
        setEndTime(currentVideo.duration)
      }
    }
  }, [videoSrc]);

  const convertToHHMMSS = (val) => {
    const secNum = parseInt(val, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    };

    if (minutes < 10) {
      minutes = '0' + minutes;
    };
    
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    let time;
    if (hours === '00'){
      time = minutes + ':' + seconds;
    }else {
      time = hours + ':' + minutes + ':' + seconds;
    }
    return time;
  };

  let handleTrim = async () => {
    if (isScriptLoaded) {
    }

    const {name} = videoFileValue;
    await ffmpeg.FS('writeFile', name, await window.FFmpeg.fetchFile(videoFileValue));

    const {start, end, filename} = section;
    await ffmpeg.run(
      "-i",
      name,
      "-ss",
      `${convertToHHMMSS(start)}`,
      '-to',
      `${convertToHHMMSS(end)}`,
      "-c:v",
      "copy",
      fileName
    )
  }

  return (
    <div className="selectMContainer">

      <input onChange={handleFileUpload} type='file'/>

      {videoSrc && (
        <>
          <video
            src={videoSrc}
            ref={videoRef}
            onTimeUpdate={handlePauseVideo}
            className='you know'
            controls
          >
          </video>

          <div className='slider'>
            <Nouislider
              behaviour='tap-drag'
              step={1}
              range={{min:0, max:videoDuration || 2}}
              start={[0, videoDuration || 2]}
              connect
              onUpdate={onUpdateSliderChange}
            />
          </div>

          <div className='d'>
            Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration: {convertToHHMMSS(endTime)}
          </div>

          {/* Play Btn */}
          <div className='b'>
            <button 
              className='play'
              onClick={handlePlay}
            >
              Play
            </button>
          </div>

          {/* Pause Btn */}
          <div className='b'>
            <button 
              className='pause'
              onClick={handlePauseVideo}
            >
              Pause
            </button>
          </div>

          {/* Trim Btn */}
          <div className='trim'>
            <button 
              className='pause'
              onClick={handleTrim}
            >
              Trim
            </button>
          </div>
        </>
      )}
      
    </div>
  );
};

export default ViewMedia;