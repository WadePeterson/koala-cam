var express = require('express');
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var app = express();

app.listen(3000, function () {
    deleteTempFiles();
    startRecording();
    setInterval(function(){
        currentCommand.kill('SIGINT');
        startRecording();
    }, 10000);
});

app.get('/', function(req,res) {
    res.sendfile('index.html');
});

app.get('/video.mp4', function(req,res) {
    res.sendfile('camera-recording.mp4');
});

app.get('/record', function (req, res) {

});

var highlightDuration = 2;

var currentCommand;

function startRecording() {
    var tempRecordingName = 'temp/recording-' + currentTimeMillis() + '.mp4';

    currentCommand = ffmpeg('default')
        .inputOptions([
            '-video_device_index 0',
            '-audio_device_index 0'
        ])
        .inputFormat('avfoundation')
        .format('mp4')
        .size('640x480')
        .fps(60)
        .audioCodec('libmp3lame')
        .videoCodec('libx264')
        .duration('30:00')
        .on('start', function(commandLine) {
            console.log('Transcoding started with command: ' + commandLine);
        })
        .on('end', function() {
            deleteTempFile(tempRecordingName);
            console.log('Transcoding ended. What does that mean?!?!?');
        })
        .on('error', function (err) {
            saveHighlight(tempRecordingName);
            console.log('Error or intentional stoppage while transcoding video: ', err.message)
        })
        .save(tempRecordingName);
}

function saveHighlight(tempRecordingName) {
    ffmpeg(tempRecordingName).ffprobe(function(err, metadata) {
        ffmpeg(tempRecordingName)
            .seekInput(Math.max(metadata.streams[0].duration - highlightDuration, 0))
            .on('error', function (err) {
                console.log('Error saving highlight video: ', err.message);
                deleteTempFile(tempRecordingName);
            })
            .on('end', function () {
                deleteTempFile(tempRecordingName);
            })
            .save('highlights/highlight-' + currentTimeMillis() + '.mp4')
    });
}

function deleteTempFile(fileName) {
    try {
        // TODO: Fix this
//        fs.unlink(fileName);
    } catch(err) {
        console.log('Error deleting temp file: ' + err.message);
    }
}

function deleteTempFiles() {
    // TODO: Loop over temp files. Async?
}

function currentTimeMillis() {
    return new Date().getTime();
}