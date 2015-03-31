var express = require('express');
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var _ = require('lodash');
var app = express();

app.listen(3000, function () {
    fs.readdir('temp', function (err, fileNames) {
        _(fileNames).map(function (fileName) {
            return 'temp/' + fileName;
        }).each(deleteFile).value();
    });

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
    var tempRecordingPath = 'temp/recording-' + currentTimeMillis() + '.mp4';

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
            deleteFile(tempRecordingPath);
            console.log('Transcoding ended. What does that mean?!?!?');
        })
        .on('error', function (err) {
            saveHighlight(tempRecordingPath);
            console.log('Error or intentional stoppage while transcoding video: ', err.message)
        })
        .save(tempRecordingPath);
}

function saveHighlight(tempRecordingPath) {
    ffmpeg(tempRecordingPath).ffprobe(function(err, metadata) {
        ffmpeg(tempRecordingPath)
            .seekInput(Math.max(metadata.streams[0].duration - highlightDuration, 0))
            .on('error', function (err) {
                console.log('Error saving highlight video: ', err.message);
                deleteFile(tempRecordingPath);
            })
            .on('end', function () {
                deleteFile(tempRecordingPath);
            })
            .save('highlights/highlight-' + currentTimeMillis() + '.mp4')
    });
}

function deleteFile(filePath) {
    fs.unlink(filePath, function (err) {
        if(err) {
            console.log('Error deleting file: ' + err.message);
        }
    });
}

function currentTimeMillis() {
    return new Date().getTime();
}