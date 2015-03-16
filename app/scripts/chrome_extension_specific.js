function get_third_party_cookies_help_link(){
	return "https://support.google.com/chrome/bin/answer.py?hl=en&answer=95647";
}

function only_call_function_if_this_tab_is_active(callback){
	chrome.extension.sendRequest({action: "active_tab"}, function(tabs){
		if (tabs["active"]){
			callback();
		}
	});
}

function send_get_request_auth_wrapper(url, callback) {
	send_get_request(url, callback, true, false);
};

function send_get_request_silent_auth_wrapper(url, callback) {
	send_get_request(url, callback, true, true);
};

function send_get_request(url, callback, shouldAuthAndRetry, shouldBeSilent)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) 
			{
				callback(xhr.responseText);
			}
			else if (xhr.status == 403)
			{
				if (shouldAuthAndRetry){
					oauth_flow(url, callback, shouldBeSilent);
				}
				else if(!shouldBeSilent)
				{
					show_authentication_error();
				}
			}
			else 
			{
				show_error_dialog("Inbox Pause has failed to work on your account for some reason. To ensure that your inbox has not been paused, please check your filters and vacation responder. For more information, please click <a href='https://inboxpause.com/help.html'>here</a>.");
				console.log(xhr);
			}
		}
	}
	xhr.open('GET', url, true);
	xhr.send();
}

function create_popup(url)
{
	chrome.extension.sendRequest(
		{
				'action': 'popup',
				'url': url,
		}, function(){});
}


function oauth_flow(url, callback, shouldBeSilent)
{
	var guser = get_gmail_user();
	if (guser == null || guser.indexOf("@") == -1){
		return;
	}
	
	chrome.extension.sendRequest(
		{
				'action': 'auth_popup',
				'authurl': "https://inboxpause.baydin.com/login?guser=" + guser,
				'top': 0,
				'left': 0,
				'width': 800,
				'height': 650,
				'silent': shouldBeSilent,
		}, onAuthWindowClosed);
	function onAuthWindowClosed(request)
	{
		send_get_request(url, callback, false, shouldBeSilent);
	}
}
