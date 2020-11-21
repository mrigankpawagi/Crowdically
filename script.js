$("#loader").fadeOut(500);

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

$("#newMusic").click(function(){
	$("#loader").fadeIn(500);
	$.ajax({
        url: 'https://api.airtable.com/v0/appHDwQN2sfuFpklp/Music',
        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", "Bearer key5kk2RFN088tXFg")
        },
	    type: 'POST',
    	dataType: 'json',
    	processData: false,
    	data: '{"fields": {"Name": "' + $("#newMusicName").val() + '","ID": "' + makeid(6) + '"}}',
    	contentType: 'application/json',
		success: function(data){
            $("#newMusicName").val('');
			$("#gotoMusic").val(data.fields.ID);
			$("#gotoMusicBtn").click();
        }
	});
});

$("#gotoMusicBtn").click(function(){
	if($("#gotoMusic").val().replace(/ /g, '') != ""){
		location.href = "music/?music=" + $("#gotoMusic").val();
	}
});