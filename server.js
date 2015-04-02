var _ = require('lodash');
var exec = require('child_process').exec;
var express = require('express');
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var Q = require('q');

var app = express();

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
            }).unique().sort().reverse().map(getHighlight).value());
    });
});

app.put('/highlight', function(req,res) {
    var recording = currentRecording;

    recording.command.on('error', function () {
        saveHighlight(recording.path).then(function (id) {
            res.send(getHighlight(id));
        });
    }).kill('SIGINT');

    startRecording();
});

app.post('/highlight/:id', function(req,res) {
    res.send(getHighlight(req.params.id));
});

app.delete('/highlight/:id', function(req,res) {
    deleteFile('assets/highlights/highlight-' + req.params.id + '.mp4');
    deleteFile('assets/highlights/thumbnail-' + req.params.id + '.jpg');
    res.end();
});

var highlightDuration = 7;
var currentRecording = {};

function startRecording() {
    exec('ffmpeg -f avfoundation -list_devices true -i ""', function (err, stdout) {
        var webcamRegex = /\[([0-9]+)\] HD Pro Webcam/g;
        var videoDeviceIndex = (webcamRegex.exec(err.message) || [])[1] || 0;
        var audioDeviceIndex = (webcamRegex.exec(err.message) || [])[1] || 0;

        var tempRecordingPath = 'temp/recording-' + generateId() + '.mov';

        currentRecording = {
            path: tempRecordingPath,
            command: ffmpeg('default')
                .inputOptions([
                    '-video_device_index ' + videoDeviceIndex,
                    '-audio_device_index ' + audioDeviceIndex
                ])
                .inputFormat('avfoundation')
                .fps(60)
                .size('1000x?')
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

function getHighlight(id) {
    return {
        id: id,
        isHot: false,
        thumbnailUrl: 'highlights/thumbnail-' + id + '.jpg',
        videoUrl: 'highlights/highlight-' + id + '.mp4'
    };
}

function saveHighlight(tempRecordingPath) {
    var id = generateId();

    return getFfmpegMetadata(tempRecordingPath)
        .then(function (ffmpegMetadata) {
            return parseTempVideo(ffmpegMetadata, tempRecordingPath, id);
        })
        .then(function (highlightPath) {
            return createThumbnail(highlightPath, id);
        }).then(function () {
            return id;
        });
}

function parseTempVideo(ffmpegMetadata, tempRecordingPath, id) {
    var highlightPath = 'assets/highlights/highlight-' + id + '.mp4';

    var deferred = Q.defer();
    ffmpeg(tempRecordingPath)
        .seekInput(ffmpegMetadata ? Math.max(ffmpegMetadata.streams[0].duration - highlightDuration, 0) : 0)
        .on('error', function (err) {
            console.log('Error saving highlight video: ', err.message);
            deleteFile(tempRecordingPath);
        })
        .on('end', function () {
            deleteFile(tempRecordingPath);
            deferred.resolve(highlightPath);
        })
        .save(highlightPath)
    return deferred.promise;
}

function getFfmpegMetadata(videoFilePath) {
    var deferred = Q.defer();
    ffmpeg(videoFilePath).ffprobe(function(err, metadata) {
        deferred.resolve(metadata);
    });
    return deferred.promise;
}

function createThumbnail(highlightPath, id) {
    var deferred = Q.defer();
    var thumbnailName = 'thumbnail-' + id + '.jpg';

    ffmpeg(highlightPath)
        .on('end', function () {
            deferred.resolve();
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
    return deferred.promise;
}

function createMetadata(id) {

}

function filterEmptyFile(fileName) {
    return fileName !== 'empty';
}

function deleteFile(filePath) {
    fs.unlink(filePath, function (err) {
        if(err) {
            console.log('Error deleting file: ' + err.message);
        }
    });
}

function generateId() {
    return new Date().getTime();
}