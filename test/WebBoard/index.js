var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());
var http = require('http');
var requestHandlers = require("./requestHandler");
var webBoard = require("./nodeWebBoard");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var httpServer = http.Server(app);

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/fonts", express.static(__dirname + '/fonts'));
app.use(passport.initialize());
app.use(passport.session());

/* Send the index file for "/" */
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
    //requestHandlers.start(res);
});

app.get('/start', function(req, res) {
    //res.sendfile(__dirname + '/www/index.html');
    requestHandlers.start(res);
});

//<ravin>

var users = [{
    id: 1,
    username: 'bob@example.com',
    password: 'secret',
    email: 'bob@example.com',
    role: 'instructor'
}, {
    id: 2,
    username: 'joe@example.com',
    password: 'birthday',
    email: 'joe@example.com',
    role: 'student'
}];

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    findById(id, function(err, user) {
        done(err, user);
    });
});

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            // Find the user by username. If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message. Otherwise, return the
            // authenticated `user`.
            findByUsername(username, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user ' + username
                    });
                }
                if (user.password != password) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            })
        });
    }
));

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/')
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }else if(user.role === 'student'){
                return res.redirect('/studentLogin');
            }
            return res.redirect('/start');
        });
    })(req, res, next);
});

//</ravin>

app.post('/upload', function(req, res) {
    console.log("POST");
    requestHandlers.upload(req, res);
});

app.get('/show', function(req, res) {
    //res.sendfile(__dirname + '/www/index.html');
    requestHandlers.show(req, res);
});

var sessionURL = null;
app.post('/sessionURL', function(req, res) {
    sessionURL = req.body.sessionURL;
    console.log("Saving :" + sessionURL);
    res.writeHead(200);
    res.write("{'success':0}");
    res.end();
});

app.get('/studentLogin', function(req, res) {
    res.sendfile(__dirname + '/student-webboard.html');
});

app.get('/student', function(req, res) {
    //res.sendfile(__dirname + '/www/index.html');
    var getData = new Object();
    getData.sessionURL = sessionURL;
    res.writeHead(200);
    res.write(JSON.stringify(getData));
    res.end();
});

app.get('/dirPath', function(req, res) {
    //res.sendfile(__dirname + '/www/index.html');
    console.log("dirPath");
    requestHandlers.dirPath(req, res);
});

/* WebBoard Calls */
app.post('/addSlide', function(request, response) {
    webBoard.addSlide(request, response);
});

app.post('/startSession', function(request, response) {
    webBoard.startSession(request, response);
});

app.post('/endSession', function(request, response) {
    webBoard.endSession(request, response);
});

app.post('/serverData', function(request, response) {
    console.log("Data From Client" + JSON.stringify(request.body));
    webBoard.serverData(request, response);
});

app.post('/userJoin', function(request, response) {
    webBoard.userJoin(request, response);
});

app.get('/getClientSessionToken', function(request, response) {
    webBoard.getClientSessionToken(request, response);
});

app.post('/serverDataForClient', function(request, response) {
    webBoard.serverDataForClient(request, response);
});


app.listen(3000);
