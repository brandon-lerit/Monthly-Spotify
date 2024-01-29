const redirect_uri = "https://brandonlerit.github.io/MonthlySpotify/"
let access_token = '';
let user_id = '';

var app = express()

app.get('/login', function(req, res) {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' + 
        querystring.stringify ({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
    }))
});

app.get('/callback', function(req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state == null) {
        res.redirect('/#' +
          querystring.stringify({
            error: 'state_mismatch'
        }))
    }
    else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content_type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ":" + secret_id).toString('base64'))
            },
            json: true
        };
    }
});

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}
















// $(document).ready(function () {
//     $('authButton').click(function () {
//         authorization();
//     });

//     $('seeSongsButton').click(function () {
//         const songAmount = getSongAmount();
//         getTopTracks(songAmount);
//     });

//     $('createPlaylistButton').click(function () {
//         const songAmount = getSongAmount();
//         createPlaylist(songAmount);
//     });
// });

// function authorization() {
//     const redirect_uri = "https://brandonlerit.github.io/MonthlySpotify/"
//     const client_id = 'b9e5b8b171ec4b19845f06e6c4855ec6'
//     const secret_id = '9132256a9da74ac8bcb265b4d3ac7e09'    
//     const scope = 'user-top-read playlist-modify-public playlist-modify-private';
//     const state = generateRandomString(16);

//     sessionStorage.setItem('spotify_auth_state', state)

//     let url = 'https://accounts.spotify.com/authorize';
//     url += '?response_type=token';
//     url += '&client_id=' + encodeURIComponent(client_id);
//     url += '&scope=' + encodeURIComponent(scope);
//     url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
//     url += '&state=' + encodeURIComponent(state);
//     window.location.href = url;
// }

// function getAccessToken() {
//     const params = getHashParams();
//     access_token = params.access_token;
//     sessionStorage.removeItem('spotify_auth_state');
//     getUserId();
// }

// function getUserId() {
//     $.ajax({
//         url: 'https://api.spotify.com/v1/me',
//         headers: {
//             'Authorization': 'Bearer ' + access_token
//         },
//         success: function(response) {
//             user_id = response.id;
//         },
//         error: (xhr, textStatus, errorThrown) => {
//             ifError(xhr.status);
//         },
//     });
// }

// function getTopTracks(limit) {
//     $('#seeSongsButton').addClass("loading");
//     $.ajax({
//         url: 'https://api.spotify.com/v1/me/top/tracks',
//         data: {
//           limit: limit,
//           time_range: 'short_term',
//         },
//         headers: {
//           'Authorization': 'Bearer ' + access_token,
//         },
//         success: function(response) {
//             $('#track-button').removeClass("loading");
//             playlist_uris = [];
//             $('#results').empty();
//             $('#results-header').html('<h2>Top Tracks</h2>');
//             let resultsHtml = '';
    
//             if (response.items.length === 0) {
//               resultsHtml = '<p>No top tracks found.</p>';
//             } 
//             else {
//               response.items.forEach((item, i) => {
//                 playlist_uris.push(item.uri);
//                 let trackName = item.name;
//                 let artistName = item.artists[0].name;
//                 let url = item.external_urls.spotify;
//                 let image = item.album.images[1].url;
//                 resultsHtml += '<div class="column wide track item"><a href="' + url + '" target="_blank"><img src="' + image + '"></a><h4>' + (i + 1) + '. ' + trackName + ' <br>' + artistName + ' </h4></div>';
//               });
//             }
    
//             $('#results').html(resultsHtml);
    
//             songsdisplayed = true;
//             artistsdisplayed = false;
//             checkWidth();
//           },
//           error: function(xhr, textStatus, errorThrown) {
//             console.log("Error:", error);
//             $('seeSongsButton').removeClass("loading");
//             $('results').html('<p>Error Occured</p>');
//         },
//     });
// }

// function createPlaylist() {
//     $('createPlaylistButton').addClass("loading");
//     $.ajax({
//         url: 'https://api.spotify.com/v1/playlists',
//         type: "POST",
//         headers: {
//             'Authorization': 'Bearer ' + access_token,
//             'Content-Type': 'application/json',
//         },
//         data: JSON.stringify({
//             "name": `${getMonth()}/${getYear()} Top Tracks`,
//             "description": `Top songs from ${getMonth()}/${getYear()}`,
//             "public": true,
//         }),
//         success: function(response) {
//             const playlistId = createPlaylistResponse.id;
//             const songAmount = getSongAmount();

//             getTopTracks(songAmount);

//             $.ajax({
//                 url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//                 type: "POST",
//                 headers: {
//                     'Authorization': 'Bearer ' + access_token,
//                     'Content-Type': 'application/json',
//                 },
//                 data: JSON.stringify({
//                     "uris": playlist_uris,
//                 }),
//                 success: function(response) {
//                     console.log("Tracks added to playlist:", response);
//                     $('#createPlaylistButton').removeClass("loading");
//                 },
//                 error: function(xhr, status, error) {
//                     console.error("Error adding tracks to playlist:", error);
//                     $('#createPlaylistButton').removeClass("loading");
//                 }
//             });
//         },
//         error: function(xhr, status, error) {
//             console.error("Error creating playlist:", error);
//             $('#createPlaylistButton').removeClass("loading");
//         }
//     });
// }

// function getHashParams() {
//     const hashParams = {};
//     const hash = window.location.hash.substring(1);
//     const params = hash.split('&');
//     for (let i = 0; i < params.length; i++) {
//         const param = params[i].split('=');
//         const key = decodeURIComponent(param[0]);
//         const value = decodeURIComponent(param[1]);
//         hashParams[key] = value;
//     }
//     return hashParams;
// }

// function getMonth() {
//     const d = new Date();
//     var month = d.getMonth();
//     return String (month + 1);
// }

// function getYear() {
//     const d = new Date();
//     var year = d.getFullYear();
//     return String (year);
// }

// function getSongAmount() {
//     const songAmount = document.getElementById("numResponses").value;
//     return songAmount;
// }

// function checkWidth() {
//     if (window.innerWidth < 1200) {
//         $('html, body').animate({
//         scrollTop: $("#results-container").offset().top
//         }, 500);
//     }
// }

// function generateRandomString(length) {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let randomString = '';
//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         randomString += characters.charAt(randomIndex);
//     }
//     return randomString;
// }