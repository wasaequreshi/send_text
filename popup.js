var email = "";
var api_key = "";
var db_name = "";
var collection_name = ""
$.getJSON("api_key.json", function(json) {
    api_key = json.api_key;
    db_name = json.db_name;
    collection_name = json.collection_name;
});

document.addEventListener('DOMContentLoaded', function() {
    chrome.identity.getProfileUserInfo(function(userInfo) {
        //Getting the email of the currently logged in person
        email = userInfo.email;
        //html element that we will update with the text from the db
        var copied_textarea = document.getElementById('copied-text');
        //API url to get data from the db for the current user
        api_url = 'https://api.mlab.com/api/1/databases/' + db_name + '/collections/' + collection_name + '?apiKey=' + api_key +'&q{"email":"' + email + '"}';
        //API call to mlab db
        $.ajax( 
        { 
            url: api_url, 
            //On success, it will update the html element
            success : function(data) 
            {      
                copied_textarea.innerHTML = data[0].text;
            }, 
            //On error, it will update html element with error message 
            error : function(xhr, ajaxOptions, thrownError){
              copied_textarea.innerHTML = "Can't receive, not connected to the internet :(";
            }
        });
    });
});

$(document).ready(function() {
    $('.send-text').keydown(function(event) {
        if (event.keyCode == 13) {
            //The text that will be sent to the database
            var send_text = document.getElementById('send-text').value;
            //API url to upsert data to database
            api_url = 'https://api.mlab.com/api/1/databases/' + db_name + '/collections/' + collection_name +'?apiKey=' + api_key + '&q={"email":"' + email + '"}&u=true';
            //API call to mlab db
            $.ajax( 
            { 
                url: api_url,
                //New data to be set
                data: JSON.stringify( { "$set" : { "email" : email , "text" : send_text } } ),
                type: "PUT",
                contentType: "application/json",
                success : function(data) 
                {      
                    var sent_status = document.getElementById('sent-status');
                    sent_status.innerHTML = "Success";
                    // $("#sent-status").show();
                    $("#sent-status").fadeIn();
                    $('#sent-status').delay(2000).fadeOut('slow');
                    // setTimeout(function() { $("#sent-status").hide(); }, 5000);
                }, 
                //On error, it will update html element with error message
                error : function(xhr, ajaxOptions, thrownError)
                {
                    var copied_textarea = document.getElementById('copied-text');  
                    copied_textarea.innerHTML = "Can't send, not connected to the internet :(";
                    var sent_status = document.getElementById('sent-status');
                    sent_status.innerHTML = "Failed to send...";
                    // $("#sent-status").show();
                    $("#sent-status").fadeIn();
                    $('#sent-status').delay(2000).fadeOut('slow');
                }   
            });
         }
    });
});