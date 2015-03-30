var express = require('express');
var ffmpeg = require('fluent-ffmpeg');
var app = express();

app.get('/', function(req,res) {
    res.sendfile('index.html');
});

app.get('/video.mp4', function(req,res) {
    res.sendfile('camera-recording.mp4');
});

app.get('/record', function (req, res) {

});

var highlightIndex = 0;
var command;

var startRecording = function() {
    command = ffmpeg('default')
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
        .save('videos/highlights-' + highlightIndex++ + '.mp4');
};

app.listen(3000, function () {
    startRecording();

    setInterval(function(){
        command
            .on('error', function(){})
            .kill('SIGINT');

        startRecording();
    }, 10000);
});