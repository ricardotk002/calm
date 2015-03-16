var loc = String(document.location);
var frameDoc = get_frame();
var pid = null;

if (loc.indexOf('mu/mp') == -1) {
	prepare_inbox_peace();
};

function prepare_inbox_peace() {
	var guser = get_gmail_user();
	var frameDoc = get_frame();

	if (!guser) {
		window.setTimeout(prepare_inbox_peace, 1000);
	} else {
        // if (check_storage_available()) {
        //     if(read_from_localStorage('inbox_peace_user_' + guser + 'timeout')) {
        //         var end = read_from_localStorage('inbox_peace_user_' + guser + 'timeout');
        //         var mend = moment(new Date(end));
        //         console.log(mend);
        //         pause_now(mend.hours(), mend.minutes(), mend.seconds());
        //     }
        // }
        window.setInterval(inject_pause_button, 500);
	}
}

function inject_pause_button() {
	var loc = String(document.location);
	var frameDoc = get_frame();

	var buttonAlreadyExists = $('#ip-button', frameDoc).length > 0;
	if (buttonAlreadyExists) {
		return;
	} else {
		var mailButton = get_mail_dropdowns();
		var pauseButton = $('<button id="ip-button"><div style="background: url(' + chrome.extension.getURL("images/Logo.png") + ');"></div></button>');
		apply_search_button_css(pauseButton);
		pauseButton.css({
	        "display": "inline",
	        "margin-right": "0",
	        "cursor": "pointer",
	        "z-index": "5"
		});

		pauseButton.unbind('click');

		if(is_paused()) {
			// Render the overlay
		} else {
			pauseButton.click(function() {
				display_pause_dialog();
			});
		}

		mailButton.after(pauseButton);
	}
}

function display_pause_dialog() {
	var frameDoc = get_frame();
	var user = get_gmail_user();

	vex.defaultOptions.className = 'vex-theme-default';
    vex.dialog.open({
      message: 'How many time you want to relax?',
      input: "<div class=\"vex-custom-field-wrapper\">\n    <div class=\"vex-custom-input-wrapper\">\n        <input autofocus name=\"time\" type=\"time\" min=\"00:01:00\" max=\"20:00:00\" />\n    </div>\n</div>",
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled');
        }

        var hours = parseInt(data.time.slice(0,2));
        var minutes = parseInt(data.time.slice(3,5));
        pause_now(hours, minutes);
      }
    });
}

function pause_now(hours, minutes, seconds) {
	var frameDoc = get_frame();

	$('body', frameDoc).append($(get_main_screen()));
    $('#ip-volume-link').unbind('click');
    $('#ip-volume-link').click(function () {
        $('#ip-volume-bar').toggle();
    });
    $('#ip-timer-link').unbind('click');
    $('#ip-unpause').unbind('click');
    $('#ip-unpause').click(unpause);

    init_countdown(hours, minutes, seconds);
    set_gmail_counter()
    pid = window.setInterval(set_gmail_counter, 500);

    $('.covervid-video').coverVid(1920, 1080);
    var video = document.getElementById("covervid-video");
    var volume_bar = document.getElementById("ip-volume-bar");

    volume_bar.addEventListener("change", function() {
        video.volume = volume_bar.value;
    });
}

function init_countdown(hh, mm, ss) {
    var guser = get_gmail_user();
    var end = moment();

    if(hh>0) {
        end.add(hh, 'hours');
    }
    if(mm>0) {
        end.add(mm, 'minutes');
    }
    if(ss) {
        end.add(ss, 'seconds');
    }

    if (check_storage_available()) {
        write_to_localStorage('inbox_peace_user_' + guser + 'timeout', end);
    }

    $('#clock').countdown(end.toDate())
        .on('update.countdown', function(event) { var format = '%H:%M:%S'; $(this).html(event.strftime(format)); })
        .on('finish.countdown', unpause);
}

function unpause() {
	$('.ip-main-container').remove();
    window.clearInterval(pid);
}

function get_url(url) {
    return chrome.extension.getURL(url);
}

function get_main_screen() {
    var content = [
        '<video id="covervid-video" class="covervid-video" autoplay loop poster="img/video-fallback.png">',
            '<source src="' + get_url('videos/dreamscapes.mp4') + '" type="video/webm">',
            '<source src="' + get_url('videos/dreamscapes.webm') + '" type="video/webm">',
        '</video>',
        '<div class="ip-header">',
            '<div class="ip-inbox">',
                '<a id="ip-unpause" href="#">',
                    '<img src="' + get_url('images/gmail.png') + '" alt="">',
                    '<span id="ip-unreaded"></span>',
                '</a>',
            '</div>',
            '<div class="ip-controls">',
                '<a id="ip-volume-link" href="#"><img src="' + get_url('images/speaker.png') + '" alt=""></a>',
                '<a id="ip-timer-link" href="#"><img src="' + get_url('images/clock.png') + '" alt=""></a>',
                '<input type="range" id="ip-volume-bar" orient="vertical" min="0" max="1" step="0.01" value="1">',
            '</div>',
        '</div>',
        '<div class="ip-hero">',
            '<img src="' + get_url('images/Logo@2x.png') + '" alt="">',
            '<h1>Inbox Peace</h1>',
            '<p>check emails in...</p>',
        '</div>',
        '<div class="ip-countdown"><span id="clock"></span></div>',
        '<div class="ip-quote">',
            '<p>“Never be in a hurry, do everything quietly and in a calm spirit.” - Saint Frances</p>',
        '</div>'
    ].join('');

    var scr = '<div class="ip-main-container">' + content + '</div>'

    return scr;
}

function check_storage_available() {
    try {
            return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
            return false;
    }
}

function set_gmail_counter() {
    $('div[act="20"]').click();
    $('#ip-unreaded').text(get_gmail_unreaded());
}

function get_gmail_unreaded() {
	var unreaded = $('.J-Ke.n0').attr('title').match(/\(([^)]+)\)/)
	if(unreaded) {
		return unreaded[1];
	}
	return 0;
}
