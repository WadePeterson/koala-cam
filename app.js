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
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
    res.sendfile('index.html');
});

app.get('/highlights', function(req,res) {
    fs.readdir('public/highlights', function (err, fileNames) {

    });
});

app.post('/savehighlight', function(req,res) {
    currentCommand.kill('SIGINT');
    startRecording();

    // Respond with highlight link??? something?
    res.end();
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
            .save('public/highlights/highlight-' + currentTimeMillis() + '.mp4')
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