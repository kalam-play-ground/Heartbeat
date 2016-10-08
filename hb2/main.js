

jQuery(document).ready(function($) {

    // Create the VideoPlayer.
    var videoPlayer = new VideoPlayer('movie');

    // Create the AnalyticsProvider instance and attach it to the VideoPlayer instance.
    var analyticsProvider = new VideoAnalyticsProvider(videoPlayer);

    // Setup the ad label.
    NotificationCenter().addEventListener(PlayerEvent.AD_START, onEnterAd);
    NotificationCenter().addEventListener(PlayerEvent.AD_COMPLETE, onExitAd);
    NotificationCenter().addEventListener(PlayerEvent.SEEK_COMPLETE, onSeekComplete);
    NotificationCenter().addEventListener(PlayerEvent.VIDEO_UNLOAD, onExitAd);

    function onEnterAd() {
        $('#pub-label').show();
    }

    function onExitAd() {
        $('#pub-label').hide();
    }

    function onSeekComplete() {
        if (!videoPlayer.getAdInfo()) {
            // The user seeked outside the ad.
            onExitAd();
        }
    }
});



