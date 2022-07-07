/**************************
 * Copyright 2018 CF Pro Tools, All Rights Reserved
 * Do not share, or distribute this code without author's consent.
 * This copyright notice must remain in place whenever using
 * this code - DO NOT REMOVE
 * Author: Jaime Smith
 * Website: https://cfprotools.com
 **************************/

var videoWrapperId = '[data-title="cf-vimeo-video"]'
var videoPlayer = null
var checkerMillis = 1000
var videoCurrentTime = 0
var timerInterval = null

$(function () {
  var soundImage = 'sound-on4.png'
  var playButtonImage =
    '//trafficsecrets.com/hosted/images/e0/641cd0cb3611e8a5efdf0f4d679b5f/playbutton.png'

  var blocker = $(
    '<div data-title="cf-vimeo-unmute cf-vimeo-restart cf-vimeo-remove-blocker" class="iframeBlocker"><div class="video-sound-overlay"><div class="unmute-button"><img src="' +
      soundImage +
      '" alt="Click To Turn On Sound" /></div><div class="play-button"><img src="' +
      playButtonImage +
      '" /></div></div></div>'
  )
  $('iframe', videoWrapperId).parents('.elVideo').append(blocker)

  $('[data-title*="cf-vimeo-remove-blocker"]').on('click', function () {
    $(this).remove()
  })
})

$(function () {
  if (typeof Vimeo == 'undefined') {
    $('body').append(
      '<script src="https://player.vimeo.com/api/player.js"></script>'
    )
    checkForVimeo()
  }

  function checkForVimeo() {
    if (typeof Vimeo == 'undefined') {
      window.setTimeout(checkForVimeo, 100)
    } else {
      handleVimeoPlayer()
    }
  }
})

function handleVimeoPlayer() {
  videoFrameSrc = $('iframe', videoWrapperId).attr('src')
  //videoFrameSrc = videoFrameSrc.replace('autoplay=1','background=1');
  $('iframe', videoWrapperId).attr('src', videoFrameSrc)

  videoPlayer = new Vimeo.Player($('iframe', videoWrapperId))

  videoPlayer.ready().then(function () {
    $('.elVideo', videoWrapperId).next('iframe').remove()

    $('[data-title*="cf-vimeo-unmute"]').on('click', function () {
      videoPlayer.play()
      videoPlayer.setVolume(1)
    })

    $('[data-title*="cf-vimeo-restart"]').on('click', function () {
      videoPlayer.setCurrentTime(0)
      videoPlayer.play()
    })

    $('[data-title*="cf-vimeo-delay-"]').each(function () {
      var seconds = null
      var titleParts = $(this).attr('data-title').split(' ')
      var currThis = $(this)
      $.each(titleParts, function (index, value) {
        if (value.indexOf('cf-vimeo-delay-') > -1) {
          seconds = parseInt(value.split('-').pop())
          currThis.attr('data-vimeo-delay', seconds)
        }
      })
    })

    function setCurrentTime() {
      videoPlayer.getCurrentTime().then(function (seconds) {
        videoCurrentTime = seconds
      })
    }

    function checkAndPop() {
      setCurrentTime()

      if ($('[data-vimeo-delay]:hidden').length == 0) {
        clearInterval(timerInterval)
        return true
      }

      $('[data-vimeo-delay]').each(function () {
        var seconds = parseInt($(this).data('vimeo-delay'))

        if (videoCurrentTime >= seconds) {
          $(this).show()
        }
      })
    }

    function clearTimeCheckers() {
      clearInterval(timerInterval)
    }

    function startTimeCheckers() {
      timerInterval = setInterval(checkAndPop, checkerMillis)
    }

    videoPlayer.on('play', function (data) {
      startTimeCheckers()
    })

    videoPlayer.on('pause', function (data) {
      clearTimeCheckers()
    })
  })
}
