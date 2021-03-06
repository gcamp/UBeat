var Playlist = require('../models/playlist').model;
var User = require('../models/user').model;
var Track = require('../models/track').model;
var _ = require('underscore');

exports.createPlaylist = function (req, res) {
    User.findById(req.user.id, function (err, user) {
        if (!err) {
            var playlist = new Playlist({
                name: req.body.name,
                owner: user.toJSON()
            });
            playlist.save(function (err) {
                if (!err) {
                    res.status(201).send(playlist);
                } else {
                    console.error(err);
                }
            });
        } else {
            console.error(err);
        }
    });
};

exports.addTrackToPlaylist = function (req, res) {
    Playlist.findById(req.params.id, function (err, playlist) {
        if (!err) {
            if (playlist) {
                if (req.body) {
                    var track = new Track(req.body);
                    playlist.tracks.push(track.toJSON());
                    playlist.save();
                    res.status(200).send(playlist);
                } else {
                    res.status(412).send({
                        errorCode: 'REQUEST_BODY_REQUIRED',
                        message: 'Request body is missing'
                    });
                }
            } else {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            }
        } else {
            console.error(err);
            if (err.name === 'CastError') {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            } else {
                res.status(500).send(err);
            }
        }
    });
};

exports.removeTrackFromPlaylist = function (req, res) {
    console.log(req.params.trackId);
    Playlist.findById(req.params.playlistId, function (err, playlist) {
        if (!err) {
            if (playlist) {
                console.log(playlist.tracks);
                var trackToRemove = playlist.tracks.id(req.params.trackId);
                if (trackToRemove) {
                    trackToRemove.remove();
                    playlist.save();
                    res.status(200).send();
                } else {
                    res.status(404).send({
                        errorCode: 'TRACK_NOT_FOUND',
                        message: 'Track ' + req.params.id + ' was not found'
                    });
                }
            } else {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            }
        } else {
            console.error(err);
            if (err.name === 'CastError') {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            } else {
                res.status(500).send(err);
            }
        }
    });
};

exports.updatePlaylist = function (req, res) {
    Playlist.findById(req.params.id, function (err, playlist) {
        if (!err) {
            if (playlist) {
                playlist.tracks = _.extend(playlist.tracks, req.body.tracks);
                playlist.save();
                res.status(200).send(playlist);
            } else {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            }
        } else {
            console.error(err);
            if (err.name === 'CastError') {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            } else {
                res.status(500).send(err);
            }
        }
    });
};

exports.removePlaylist = function (req, res) {
    Playlist.findById(req.params.id, function (err, playlist) {
        if (!err) {
            if (playlist) {
                if(playlist.owner.id == req.user.id) {
                    playlist.remove();
                    res.status(200).send({
                        message: 'Playlist ' + req.params.id + ' deleted successfully'
                    });
                }
                else {
                    res.status(412).send({
                        errorCode: 'NOT_PLAYLIST_OWNER',
                        message: 'Playlist can only be deleted by their owner'
                    });
                }
            } else {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            }
        } else {
            console.error(err);
            if (err.name === 'CastError') {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            } else {
                res.status(500).send(err);
            }
        }
    });
};

exports.getPlaylists = function (req, res) {
    Playlist.find({}, function (err, playlists) {
        if (!err) {
            res.status(200).send(playlists || []);
        } else {
            console.log(err);
            res.status(500).send(err);
        }
    });
};

exports.findPlaylistById = function (req, res) {
    Playlist.findById(req.params.id, function (err, playlist) {
        if (!err) {
            if (playlist) {
                res.status(200).send(playlist);
            } else {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            }
        } else {
            console.error(err);
            if (err.name === 'CastError') {
                res.status(404).send({
                    errorCode: 'PLAYLIST_NOT_FOUND',
                    message: 'Playlist ' + req.params.id + ' was not found'
                });
            } else {
                res.status(500).send(err);
            }
        }
    });
};
