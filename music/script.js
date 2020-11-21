$('.modal').modal();
$('select').formSelect();

var music = {};
var musicInfo = {};

function getParameter(name, url) {
 	if (!url) url = window.location.href;
 	name = name.replace(/[\[\]]/g, '\\$&');
 	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
 		results = regex.exec(url);
 	if (!results) return null;
 	if (!results[2]) return '';
 	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

if(getParameter('music') == "" || getParameter('music') == null){
	location.href = "../";
}
else{
	$.ajax({
    	url: encodeURI('https://api.airtable.com/v0/appHDwQN2sfuFpklp/Music?' + 'maxRecords=1' + '&view=Grid view' + '&filterByFormula=' + "{ID} = '" + getParameter('music').toUpperCase() + "'"),
    	beforeSend: function(xhr) {
    	    xhr.setRequestHeader("Authorization", "Bearer key5kk2RFN088tXFg")
    	},
		type: 'GET',
   		dataType: 'json',
  	 	processData: false,
  	 	contentType: 'application/json',
		success: function(data){
			if(data.records.length == 0){
				$("#console").hide();
				$("#notFound").show();
				$("#loader").fadeOut(500);
			}
			else{
				musicInfo = data.records[0].fields;
				musicInfo.recID = data.records[0].id;
				$('title').text(musicInfo.Name + ' | Crowdically - Crowdsourced Music!');
				$("#musicName").text(musicInfo.Name);
				$("#musicID").text(musicInfo.ID);
				$("#musicIDInfo").text(musicInfo.ID);
				$("#musicLink").text(location.host + '/music/?music=' + musicInfo.ID);
				$("#musicLink").attr('href', 'https://' + location.host + '/music/?music=' + musicInfo.ID);
				$("#loader").fadeOut(500);
				if(data.records[0].fields.Notes == undefined){
					music = {
						"notes": []
					};
				}
				else{
					music = JSON.parse(musicInfo.Notes.replace(/'/g, '"'));
				}
				renderTimeline();
			}
	    }
	});
}

function renderTimeline(){
	if(music.notes.length == 0){
		$("#timeline").html("<blockquote class='yellow lighten-4 montserrat'><i class='fas fa-info-circle red-text text-darken-2'></i> " + musicInfo.Name + " does not have any notes yet. Try adding your own notes from the button above!</blockquote>");
	}
	else{

	}
}
var instrument = [new Tone.Synth().toMaster(), new Tone.MembraneSynth().toMaster(), new Tone.MetalSynth().toMaster(), new Tone.PluckSynth().toMaster()];
var notes = ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4'];

$("#addNoteGrid button").click(function(){
	if(!$(this).hasClass('active')){
		$(this).addClass('active');
		instrument[$("#addNoteInstrument").val() - 0].triggerAttackRelease(notes[$(this).parent('div').children('button').index(this)], $("#addNoteDuration").val() + 'n');
	}
	else{
		$(this).removeClass('active');
	}
});

$("#addNotePreview").click(function(){
	var prev = [];
	for(a = 0; a < 7; a++){
		prev.push([]);
		for(b = 0; b < 7; b++){
			if($("#addNoteGrid > div").eq(a).children('button').eq(b).hasClass('active')){
				prev[a].push(notes[b]);
			}
		}
	}
	var seq = new Tone.Sequence(
    	function(time, note) {
      		instrument[$("#addNoteInstrument").val() - 0].triggerAttackRelease(note, "10hz", time);
    	},
    	prev,
    	$("#addNoteDuration").val() + 'n'
  	)
	seq.loop = false;
	seq.start();
  	Tone.Transport.start();
});

$("#addNoteTime").change(function(){
	$("#addNoteTimeLabel").text($(this).val() + ' seconds');
});

$("#addNoteBtn").click(function(){
	var beatArr = [], zeroes = [];
	for(a = 0; a < 7; a++){
		beatArr.push([]);
		for(b = 0; b < 7; b++){
			if($("#addNoteGrid > div").eq(a).children('button').eq(b).hasClass('active')){
				beatArr[a].push(notes[b]);
			}
		}
	}
	for(var i = 0; i < $("#addNoteTime").val(); i++){
		zeroes.push(0);
	}
	music.notes.push({
		instrument: $("#addNoteInstrument").val() - 0,
		duration: $("#addNoteDuration").val() + 'n',
		beat: zeroes.concat(beatArr)
	});
	$("#addNoteInstrument").val(0);
	$("#addNoteDuration").val(8);
	$("#addNoteTime").val(0);
	$("#addNoteTimeLabel").text('0 seconds');
	$("#addNoteGrid button").removeClass('active');
	renderTimeline();
	$.ajax({
        url: 'https://api.airtable.com/v0/appHDwQN2sfuFpklp/Music/' + musicInfo.recID,
        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", "Bearer key5kk2RFN088tXFg")
        },
	    type: 'PATCH',
    	dataType: 'json',
    	processData: false,
    	data: '{"fields": {"Notes": "' + JSON.stringify(music).replace(/"/g, "'") + '"}}',
    	contentType: 'application/json',
		success: function(data){
            musicInfo = data.fields;
			musicInfo.recID = data.id;
        }
	});
});

$("#playMusic").click(function(){
	var beats = music.notes;
	
});