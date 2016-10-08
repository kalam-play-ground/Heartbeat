//Create a local reference to the MediaHeartbeat classes
var MediaHeartbeat = ADB.va.MediaHeartbeat;
var MediaHeartbeatConfig = ADB.va.MediaHeartbeatConfig;
var MediaHeartbeatDelegate = ADB.va.MediaHeartbeatDelegate;

//Media Heartbeat initialization
var mediaConfig = new MediaHeartbeatConfig();
mediaConfig.trackingServer = Configuration.HEARTBEAT.TRACKING_SERVER;
mediaConfig.playerName = Configuration.PLAYER.NAME;
mediaConfig.channel = Configuration.HEARTBEAT.CHANNEL;
mediaConfig.debugLogging = Configuration.HEARTBEAT.DEBUG;
mediaConfig.appVersion = Configuration.HEARTBEAT.SDK;
mediaConfig.ssl = Configuration.HEARTBEAT.SDK;
mediaConfig.ovp = Configuration.HEARTBEAT.OVP;

// Implement the MediaHeartbeatDelegate protocol.
var mediaDelegate = new MediaHeartbeatDelegate();

// Initiate 	
var appMeasurement = new AppMeasurement();
appMeasurement.visitor = visitor;
appMeasurement.trackingServer = Configuration.APP_MEASUREMENT.TRACKING_SERVER;
appMeasurement.account = Configuration.APP_MEASUREMENT.RSID;
appMeasurement.pageName = Configuration.APP_MEASUREMENT.PAGE_NAME;
appMeasurement.charSet = Configuration.APP_MEASUREMENT.CHAR_SET 	;

var contextData = {
        pageURL: document.URL,
        isUserLoggedIn: "false",
        tvStation: "Sample TV station",
        programmer: "Khurshid Alam"
        };
		
var mediaInfo;
var videoPlayer;
var videostarted = false;
var metaDataLoaded = false;

jQuery(document).ready(function($) {

    // Create the VideoPlayer.
    videoPlayer = document.getElementById('movie');
	videoPlayer.addEventListener('error',handlePlayerEvents,true);
	videoPlayer.addEventListener('loadeddata',handlePlayerEvents,true);
	videoPlayer.addEventListener('play',handlePlayerEvents,true);
	videoPlayer.addEventListener('ended',handlePlayerEvents,true);
	videoPlayer.addEventListener('seeking',handlePlayerEvents,true);
	videoPlayer.addEventListener('pause',handlePlayerEvents,true);
	videoPlayer.addEventListener('loadedmetadata',handlePlayerEvents,true);
	
	function handlePlayerEvents(e){
		//console.log("Event Type: "+e.type);
		
		switch(e.type){
			case 'error': 		console.log("***HB Error");
								console.log("Error: "+e.data);
								MediaHeartbeat.trackError("videoErrorId");;
								break;
			case 'loadeddata': 	metaDataLoaded = true;
								mediaDelegate.getCurrentPlaybackTime = function() {
										   return videoPlayer.currentTime;
										};
										
								mediaInfo = MediaHeartbeat.createMediaObject( Configuration.PLAYER.VIDEO_NAME, Configuration.PLAYER.VIDEO_ID,  e.target.duration, MediaHeartbeat.StreamType.VOD);  
								MediaHeartbeat = new MediaHeartbeat(mediaDelegate, mediaConfig, appMeasurement);
								videoPlayer.play();
								break;
			case 'play': 		if(metaDataLoaded){
									if (Math.floor(videoPlayer.currentTime ) == 0) {
											console.log("***HB Start");
											MediaHeartbeat.trackSessionStart(mediaInfo, contextData); 
											   
											MediaHeartbeat.trackPlay();  
											videostarted = true;                
									} else {
											console.log("***HB Play");
											MediaHeartbeat.trackPlay(); 
									};
								}
								break;
			case 'ended': 		MediaHeartbeat.trackComplete();
								console.log("***HB Ended");
								break;
			case 'seeking': 	console.log("***HB Buffering");
								break;
			case 'pause': 		console.log("***HB Pause");
								MediaHeartbeat.trackPause();
								break;
			
		}
	}
	
});