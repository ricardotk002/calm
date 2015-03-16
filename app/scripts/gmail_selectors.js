/** GMAIL SELECTORS **/
EDIT_WINDOW_SELECTOR = ".dK";
SUBJECT_LINE_SELECTOR = ".hP";
DISPLAY_IMAGES_BELOW_SELECTOR = ".G8gNXb,.dNDeCd";
LAST_ROW_OF_SEND_FORM_SELECTOR = ".ee";

function get_mail_dropdowns(){
    var mailDropdowns = get_buttons_by_text("Mail").add(get_buttons_by_text("Gmail"));
	return mailDropdowns;
}

function apply_search_button_css(destination){
    var frameDoc= get_frame(); 
    var searchButton = $('.T-I-ax7', frameDoc);
    $(destination).copyCSS(searchButton);
}


function get_buttons_by_text(buttonText){
	var frameDoc = get_frame();
	return $("[role=button]", frameDoc).filter(function() {return $(this).text().trim()== buttonText});
}

function get_thread_id()
{
	var loc = String(document.location);
	var threadId = loc.substr(loc.lastIndexOf("/") + 1);
	return threadId;
}


function add_script_to_document(inputscript){
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = inputscript.toString();
    document.body.appendChild(script); // run the script
}


function execute_javascript_on_document(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}

// resize delay function. 
// ensures that resize callback is only called 500ms after last resize
// http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();


function resize_search_box_if_necessary()
{
		var frameDoc = get_frame();
		var manageLink = $("#b4c_manage", frameDoc);
		var searchButton = $("#gbqfb", frameDoc);	
		var searchBar = $("#gbqfqwb", frameDoc);

		
			var totalWidth = $("#gbq", frameDoc).width();
		   	var leftBarWidth= $("#gbq1", frameDoc).width();
		   	var rightMenuWidth= $("#gbu", frameDoc).width();	
	           	var searchBoxWidth = totalWidth - (leftBarWidth + rightMenuWidth + 200);
			var currentBoxWidth = $('fieldset#gbqff',frameDoc).width();
			if (manageLink.overlaps(searchButton) || manageLink.overlaps(searchBar))
			{
		   		var calculatedWidth =  searchBoxWidth + "px";
		   		$('fieldset#gbqff',frameDoc).css("width", calculatedWidth);
		   		$('#gbqfbw',frameDoc).css("left", calculatedWidth);
			}
			else if( currentBoxWidth < searchBoxWidth)
			{
				if (searchBoxWidth > 512) {
					searchBoxWidth = 512;
				}
				var calculatedWidth =  searchBoxWidth + "px";
		   		$('fieldset#gbqff',frameDoc).css("width", calculatedWidth);
		   		$('#gbqfbw',frameDoc).css("left", calculatedWidth);		
			}
		
}


function get_target(e) {
	//Get the target of the given event
	e = e || window.event;
	return e.target || e.srcElement;
}
function get_frame()
{
	var oIframe = document.getElementById('canvas_frame');
	if (!oIframe){
		return document;
	}
	var frameDoc = (oIframe.contentWindow || oIframe.contentDocument);
	if (frameDoc.document) frameDoc = frameDoc.document;
	return frameDoc;
}
function is_new_googlebar(){
      return $('button', get_frame()).filter(function() {return $(this).attr("aria-label") == "Google Search"}).length > 0 ;
}

function is_pop_out_window(){
	return (loc.indexOf("ui=2") > 0 || loc.indexOf("view=cm") > 0) && get_gmail_logo().length == 0;
}

function get_gmail_logo(){
	var frameDoc = get_frame();
	return $("[role=banner]", frameDoc);
}

function get_gmail_user()
{
	var emailRegEx = /[a-zA-Z0-9\._-]+@[a-zA-Z0-9\.-]+\.[a-z\.A-Z]+/;

	var address = "";
	loadingWords = $(".msg").html();
	address = emailRegEx.exec(loadingWords);

	if (!address)
	{
		address = "";
		titleWords = document.title.split(" ");

		for(i in titleWords)
		{
			var extractedAddress = emailRegEx.exec(titleWords[i]);
			if (extractedAddress)
			{
				address = extractedAddress[0];
			}
		}
	}
	else
	{
		address = address[0];
	}
	return address;
}


function get_draft_html(){
	var frameDoc = get_frame();
	var b4gDraftIframe = $("iframe.Am.Al", frameDoc).contents();
	var b4gDraftHtml = $("body", b4gDraftIframe);
	return b4gDraftHtml;
}

function get_plain_text_area_draft(){
	var frameDoc = get_frame();
	var plainTextArea= $("textarea[name='body']", frameDoc);
	return plainTextArea;
}

function prepend_html_to_draft(html){
	var draftHtml = get_draft_html();
	draftHtml.prepend(html);
	var plainTextArea = get_plain_text_area_draft();
	plainTextArea.val(get_plain_text_of_html_with_line_breaks(html) + plainTextArea.val());
}

function check_if_text_written_in_draft(){
	
	var just_the_text = get_draft_html().children().not('br').not('body').not('script');
	if ($(just_the_text).length == 0) {
		return false; 		
	}
	return true;
}

function open_reply_window(){
	var frameDoc = get_frame();
	var replyButtons = $(".ams", get_frame()).filter(function(){return $(this).text().toLowerCase().indexOf("reply")>-1}).last();
	if (replyButtons.length == 0){ // old gmail
		replyButtons = $("textarea.ir", frameDoc);
	}
	replyButtons.each(simulate_click);
}

/**
 * Simulates a click by creating a mousedown event followed by a mouseup event.
 */
function simulate_click(index)
{
	var frameDoc = get_frame();
	thisButton = this;
	evt = frameDoc.createEvent("MouseEvents");
	evt.initMouseEvent("mousedown", true, true, window,
			0, 0, 0, 0, 0, false, false, false, false, 0, null);
	thisButton.dispatchEvent(evt);
	evt = frameDoc.createEvent("MouseEvents");
	evt.initMouseEvent("mouseup", true, true, window,
			0, 0, 0, 0, 0, false, false, false, false, 0, null);
	thisButton.dispatchEvent(evt);
}
		

/**
 * Forces the GMail notification message to remain hidden.
 */
function hide_gmail_notification()
{
	var frameDoc = get_frame();
	$(".UD", frameDoc).first().css("visibility", "hidden");
	$(".UB", frameDoc).first().css("visibility", "hidden");
	$(".vh", frameDoc).first().not(".boomerang").css("visibility", "hidden");
}

/**
 * Forces the GMail notification message to display.
 */
function show_gmail_notification()
{
	var frameDoc = get_frame();
	$(".UD", frameDoc).first().css("visibility", "visible");
	$(".UB", frameDoc).first().css("visibility", "visible");
	$(".vh", frameDoc).first().not(".boomerang").css("visibility", "visible");
}

function display_gmail_notification(message)
{
	var frameDoc = get_frame();
	$(".vh", frameDoc).not(".boomerang").first().html(message);
	show_gmail_notification();
	setTimeout(clear_message_style, 5000);
}


/**
  * Override Gmail vacation notification bar with our own stuff
  */
function override_vacation_bar(check, times){
    var frameDoc = get_frame();
    var content = "<div class='bip_notification_bar'>Your inbox is currently paused. Please visit your <a href='#inbox'>Inbox</a> and click the blue <strong>UNPAUSE</strong> button to see what's waiting for you.</div>"
    
	if (times != null && check != null && times.length > 0 && check == "checked='yes'")
	{
		var scheduledTimes = milliseconds_to_date_objects(times).sort();
		var current = new Date();
		
		var displayTime = scheduledTimes[0];
		for (var i =1; i < scheduledTimes.length; i++) 
		{
			if (scheduledTimes[i].getHours() > current.getHours())
			{
				displayTime = scheduledTimes[i];
				break;
			}
			else if (scheduledTimes[i].getHours() == current.getHours() && scheduledTimes[i].getMinutes() > current.getMinutes())
			{
				displayTime = scheduledTimes[i];
				break;
			}
		}
		
		// Update the next time by checking every minute.
		function update_banner() 
		{
			var current = new Date();
		
			displayTime = scheduledTimes[0];
			for (var i =1; i < scheduledTimes.length; i++) 
			{
				if (scheduledTimes[i].getHours() > current.getHours())
				{
					displayTime = scheduledTimes[i];
					break;
				}
				else if (scheduledTimes[i].getHours() == current.getHours() && scheduledTimes[i].getMinutes() > current.getMinutes())
				{
					displayTime = scheduledTimes[i];
					break;
				}
			}
			
			var displayTimeString = displayTime.toLocaleTimeString().split(":");
			displayTimeString = displayTimeString[0] + ":" + displayTimeString[1] + " " + displayTimeString[2].split(" ")[1];
			
			$('.bip_notification_display_time').text(displayTimeString);
		}
		setInterval(update_banner, 60000);
		
		// Format date without seconds
		var displayTimeString = displayTime.toLocaleTimeString().split(":");
		displayTimeString = displayTimeString[0] + ":" + displayTimeString[1] + " " + displayTimeString[2].split(" ")[1];
		
		content = "<div class='bip_notification_bar'>Your inbox is currently paused. Messages will next arrive at <strong class='bip_notification_display_time'>" + displayTimeString + "</strong>. To unpause now, visit your <a href='#inbox'>Inbox</a> and click the blue <strong>UNPAUSE</strong> button.</div>";
	}
	
	var bip_notification_bar = $(content);
	
    bip_notification_bar.css( {
        "padding": "10px",
        "color": "#222",
        "background": "#FFF1A8",
        "border": "1px solid #CCC",
        "text-align": "center"
    });
    $(".w-MH",frameDoc).remove();
    if($('.bip_notification_bar',frameDoc).length == 0 ) 
    {
        $(".aiw",frameDoc).find('.nH').first().show().append(bip_notification_bar);
    }
}

function milliseconds_to_date_objects(array)
{
	var result = [];
	var dst = b4c_is_daylight_saving_time(new Date());
	
	for (var i = 0; i < array.length; i++)
	{
		var date = new Date(0);
		date.setMilliseconds(array[i]);
		date.addHours(( dst ? 1 : 0 ));
		result.push(date);
	}
	
	return result;
}

function remove_vacation_bar(){
      var frameDoc = get_frame();
      $('.bip_notification_bar', frameDoc).remove();  
}
/**
 * Undoes all of the visibility changes made to the GMail notification message.
 */
function clear_message_style()
{
	var frameDoc = get_frame();
	$(".UD", frameDoc).first().attr("style", "");
	$(".UB", frameDoc).first().attr("style", "");
	$(".vh", frameDoc).first().not(".boomerang").attr("style", "");
}	

$.fn.copyCSS = function(source){
    var dom = $(source).get(0);
    var style;
    var dest = {};
    if(window.getComputedStyle){
        var camelize = function(a,b){
            return b.toUpperCase();
        };
        style = window.getComputedStyle(dom, null);
        for(var i = 0, l = style.length; i < l; i++){
            var prop = style[i];
            var camel = prop.replace(/\-([a-z])/g, camelize);
            var val = style.getPropertyValue(prop);
            dest[camel] = val;
        };
        return this.css(dest);
    };
    if(style = dom.currentStyle){
        for(var prop in style){
            dest[prop] = style[prop];
        };
        return this.css(dest);
   };
   if(style = dom.style){
      for(var prop in style){
        if(typeof style[prop] != 'function'){
          dest[prop] = style[prop];
        };
      };
    };
    return this.css(dest);
};
		
function get_gmail_ik_variable()
{
	$("body").append("<input style='display:none' id='ipause_hidden'/>");
	guser = get_gmail_user();
	$("#ipause_hidden").val(guser);
	
	// Get IK

	execute_javascript_on_document(function()
	{
	    var guser = document.getElementById("ipause_hidden").value;
	    var ikIndex = 0;
	    for (i in GLOBALS)
	    {
	    	if (GLOBALS[i] == guser && ikIndex == 0)
	    	{
	    	ikIndex = i - 1;
	    	}
	    }
	    var ik = GLOBALS[ikIndex];
	    document.getElementById("ipause_hidden").value = ik;
	});
	var ik = $("#ipause_hidden").val();
	$("#ipause_hidden").remove();
	return ik
}

function get_gmail_at_variable()
{
   	var atStartIndex = document.cookie.indexOf("GMAIL_AT=") + 9;
	var atEndIndex = document.cookie.indexOf(";",document.cookie.indexOf("GMAIL_AT"));
	var at = document.cookie.substring(atStartIndex, atEndIndex);
	return at;
}

function get_multi_signin_base_url()
{
	var loc = String(document.location);
	var endpoint = loc.indexOf("?") + 1;
	if (endpoint > 0)
	{
	    var url = loc.substr(0,loc.indexOf("?") + 1);
	}
	else
	{
	    endpoint = loc.lastIndexOf("/");
	    var url = loc.substring(0, endpoint) + "?";
	}

	return url;
}
