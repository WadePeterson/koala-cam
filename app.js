var express = require('express');
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var _ = require('lodash');
var app = express();
var exec = require('child_process').exec;

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
    res.sendFile(__dirname + '/index.html');
});

app.get('/highlights', function(req,res) {
    fs.readdir('public/highlights', function (err, fileNames) {

    });
});

app.post('/savehighlight', function(req,res) {
    var recording = currentRecording;

    recording.command.on('error', function (err) {
        saveHighlight(recording.path, function (highlightPath) {
            res.send(highlightPath);
        });
    }).kill('SIGINT');

    startRecording();
});

var highlightDuration = 10;
var currentRecording = {};

function startRecording() {
    exec('ffmpeg -f avfoundation -list_devices true -i ""', function (err, stdout) {
        var webcamRegex = /\[([0-9]+)\] HD Pro Webcam/g;
        var videoDeviceIndex = (webcamRegex.exec(err.message) || [])[1] || 0;
        var audioDeviceIndex = (webcamRegex.exec(err.message) || [])[1] || 0;

        var tempRecordingPath = 'temp/recording-' + currentTimeMillis() + '.mov';

        currentRecording = {
            path: tempRecordingPath,
            command: ffmpeg('default')
                .inputOptions([
                    '-video_device_index ' + videoDeviceIndex,
                    '-audio_device_index ' + audioDeviceIndex
                ])
                .inputFormat('avfoundation')
                .fps(60)
                .size('640x480')
                .duration('30:00')
                .on('start', function (commandLine) {
                    console.log('Transcoding started with command: ' + commandLine);
                })
                .on('end', function () {
                    deleteFile(tempRecordingPath);
                    console.log('Transcoding ended. What does that mean?!?!?');
                })
                .save(tempRecordingPath)
        };
    });
}

function saveHighlight(tempRecordingPath, callback) {
    ffmpeg(tempRecordingPath).ffprobe(function(err, metadata) {
        var highlightPath = 'highlights/highlight-' + currentTimeMillis() + '.mp4';
        ffmpeg(tempRecordingPath)
            .seekInput(Math.max(metadata.streams[0].duration - highlightDuration, 0))
            .on('error', function (err) {
                console.log('Error saving highlight video: ', err.message);
                deleteFile(tempRecordingPath);
            })
            .on('end', function () {
                deleteFile(tempRecordingPath);
                callback(highlightPath);
            })
            .save('public/' + highlightPath)
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