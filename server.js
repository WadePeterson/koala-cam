var _ = require('lodash');
var exec = require('child_process').exec;
var express = require('express');
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');

var app = express();

function filterEmptyFile(fileName) {
    return fileName !== 'empty';
}

app.listen(3000, function () {
    fs.readdir('temp', function (err, fileNames) {
        _(fileNames).filter(filterEmptyFile).map(function (fileName) {
            return 'temp/' + fileName;
        }).each(deleteFile).value();

        exec('killall -9 ffmpeg', function () {
            startRecording();
        });
    });
});

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/build'));

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/highlights', function(req,res) {
    fs.readdir('assets/highlights', function (err, fileNames) {
        res.send(_(fileNames)
            .filter(filterEmptyFile)
            .map(function (fileName) {
                return +fileName.match('[0-9]+')[0];
            }).unique().sort().reverse().value());
    });
});

app.post('/highlight', function(req,res) {
    var recording = currentRecording;

    recording.command.on('error', function (err) {
        saveHighlight(recording.path, function (highlightTimestamp) {
            res.send('' + highlightTimestamp);
        });
    }).kill('SIGINT');

    startRecording();
});

app.delete('/highlight/:timestamp', function(req,res) {
    deleteFile('assets/highlights/highlight-' + req.params.timestamp + '.mp4');
    deleteFile('assets/highlights/thumbnail-' + req.params.timestamp + '.jpg');
});

var highlightDuration = 7;
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
                .size('640x?')
                .duration('30:00')
                .on('start', function (commandLine) {
                    console.log('Transcoding started with command: ' + commandLine);
                })
                .on('end', function () {
                    deleteFile(tempRecordingPath);
                    startRecording();
                })
                .save(tempRecordingPath)
        };
    });
}

function saveHighlight(tempRecordingPath, callback) {
    var timeStamp = currentTimeMillis();
    var highlightPath = 'assets/highlights/highlight-' + timeStamp + '.mp4';

    ffmpeg(tempRecordingPath).ffprobe(function(err, metadata) {
        ffmpeg(tempRecordingPath)
            .seekInput(metadata ? Math.max(metadata.streams[0].duration - highlightDuration, 0) : 0)
            .on('error', function (err) {
                console.log('Error saving highlight video: ', err.message);
                deleteFile(tempRecordingPath);
            })
            .on('end', function () {
                deleteFile(tempRecordingPath);

                var thumbnailName = 'thumbnail-' + timeStamp + '.jpg';

                ffmpeg(highlightPath)
                    .on('end', function () {
                        callback(timeStamp);
                    })
                    .on('error', function (err) {
                        console.log('Error saving thumbnail: ', err.message);
                    })
                    .thumbnail({
                        filename: thumbnailName,
                        timestamps: ['50%'],
                        folder: 'assets/highlights/',
                        size: '320x?'
                    });
            })
            .save(highlightPath)
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