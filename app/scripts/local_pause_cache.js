function write_to_localStorage(key, value)
{
	var guser = get_gmail_user();
	key += '_' +guser;

    if(typeof(localStorage) == undefined)
    {
        alert("Your browser does not support HTML5 localStorage.");
    } 
    else 
    {
        try 
        {
            if(typeof(key) != undefined && key != null)
            {   
                localStorage.setItem(key, value); 
            }
        } 
        catch (e) 
        {
            if (e == QUOTA_EXCEEDED_ERR) 
            {
                alert("HTML5 Storage Quota exceeded! Please let us know this happened at support+inboxpause@baydin.com");
            }
            else
            {
                alert("Something went wrong writing to HTML5 LocalStorage. Please let us know at support+inboxpause@baydin.com");
            }
        }
    }
}

function read_from_localStorage(key)
{
	var guser = get_gmail_user();
	key += '_' + guser;

    if(typeof(localStorage) == undefined)
    {
        return null;
    } 
    else 
    {
        try 
        {
            return localStorage.getItem(key); 
        } 
        catch (e) 
        {
            return null;
        }
    }
}

function set_paused_state(paused_state)
{
	write_to_localStorage("is_it_paused", paused_state);
}

function is_paused()
{
	var paused_state = read_from_localStorage("is_it_paused");
	return paused_state == "true"; //false, null -- returns false
} 
