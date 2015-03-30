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

var server = app.listen(3000, function () {
    var capture = ffmpeg('default')
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
        .duration('0:05')
        .save('camera-recording.mp4');
});