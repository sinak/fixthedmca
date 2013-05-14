var tracking_id=0;
function update_tracking_id(array) {
  tracking_id=array[1];
  $('.twitter-share-button').attr('data-url', 'http://fixthedmca.org/?r=t-'+tracking_id);
  //$('.twitter-share-button').attr('data-url', 'http://127.0.0.1:3000/?r=t-'+tracking_id);
  $('.twitter-follow-button').attr('data-url', 'http://fixthedmca.org/?r=t-'+tracking_id);
  setupFacebookShare();
}

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

var tracked_share_view=false;
	$('button #email-send').click( function() {
		$.post("/",  $(this).serialize(), function(data) {
			// response from server
		},
		'json'
    );
});


(function($){ 
	 window.slideshow = {
        '$slides': $('section'),
        'current': null
        ,
        'findCurrentSlide': function(){
            var scrollTop = $(window).scrollTop(),
                windowHeight = window.innerHeight,
                marker = scrollTop + (windowHeight * 0.33),
                retValue = null;
            slideshow.$slides.each(function(index, slide){
                var $slide = $(slide),
                    slideTop = $slide.offset().top;
                if(index === 0 && marker < slideTop){
                    retValue = 0;
                }else{
                    if(retValue === null && marker <= slideTop){
                        retValue = index - 1;
                    }
                }
            });
            return retValue;
        },
        'checkSlide': function(){
            var old = slideshow.current;
            slideshow.current = slideshow.findCurrentSlide();
            if(old == slideshow.current){
                return false;
            }else{
                return true;
            }
        },
        'goToSlide': function(n){
            $.scrollTo(slideshow.$slides.eq(n), 500, {
                'axis': 'y'
            });
        },
        'init': function(){
            slideshow.$next = $('#scroll');
            $('body').addClass('scroller');
            $(window).scroll(function(evt){
                slideshow.checkSlide();
            });
            slideshow.$next.click(function(){
                slideshow.goToSlide(slideshow.current + 1);
                return false;
            });


        }


    };


$(window).scroll(function(){
      if($(window).scrollTop()>5500){
         $(".overlay").hide();
      }else{
         $(".overlay").show();
      }
});

$('#about').click(function () {
    if ($(".about-content").is(":hidden")) {
    $(".about-content").slideDown("500");
    return false;
    } else {
    $(".about-content").hide();
    return false;
    }
});

   window.trackScrollDepth = {
        'elements': (function(){
            var $slides = $('section'),
                retVal = [];
            $slides.each(function(index, slide){
                retVal.push('#' + $(slide).attr('id'));
            });
            return retVal;
        })(),
        'init': function(){
            $.scrollDepth({
                'minHeight': 2000,
                'elements': trackScrollDepth.elements,
                'percentage': false
            });
        }
    };


 $(document).bind('ready', function(){
	  slideshow.init();
	    });

    })(jQuery);

// SCRIPTS FOR TWEET AND CONTACT BEGIN HERE

$(document).ready(function(){
 
 $('#rep-form').validate(
 {
  rules: {
    name: {
      minlength: 2,
      required: true
    },
    email: {
      required: true,
      email: true
    },
    "zip-code": {
      minlength: 5,
      required: true
    }
  },
  highlight: function(element) {
    $(element).closest('.control-group').removeClass('success').addClass('error');
  },
  success: function(element) {
    element
    .text('OK!').addClass('valid')
    .closest('.control-group').removeClass('error').addClass('success');
  }
 });

$('#join').waypoint(function() {
  if (!tracked_share_view) { 
    mixpanel.track('Join View');
    tracked_share_view=true;
  }
});


twttr.ready(function (twttr) {
  twttr.events.bind('tweet', function(event) {
    mixpanel.track('Tweet');
    $.ajax({ 
        type: 'POST',
        url: '/api/record_share/tweet',
        data: "", 
        dataType: 'json',
        contentType : 'application/json', 
    });                                                                           
  });

});

$.ajax({
  type: 'POST',
  url: '/api/record_share/init',
  data: "",
  dataType: 'json',
  contentType : 'application/json',
  success : update_tracking_id
});

var refer_id=GetURLParameter('r');
if (GetURLParameter('fb_ref')) {
  refer_id=GetURLParameter('fb_ref');
}

// $.ajax({
//   type: 'POST',
//   url: '/api/record_refer/'+refer_id,
//   data: "",
//   dataType: 'json',
//   contentType : 'application/json'
// });


mixpanel.track('Page View');
}); // end document.ready



!function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
    }
}(document, "script", "twitter-wjs");

function didSubmitEmail(d) {
  $('#modal').modal();
  $('#rep-form')[0].reset();
  mixpanel.track('Sent Congress Email');
}

// FORM VALIDATION

  $('#email-send').click(function(){   
      if ($("#rep-form").valid() == true)
      {
          $.ajax({                                                                      
          type: 'POST',
          url: '/api/add_email_rep/1',                                                
          data: JSON.stringify({email_rep: {
                                            email: $('#email').val(),                 
                                            name: $('#action').val() + '|' + $('#name').val(),                   
                                            street_address: $('#address').val(),                   
                                            zip: $('#zip-code').val(),                   
                                            opt_in: $('#optin').is(':checked'),               
                                            }}),                                      
          dataType: 'json',
          contentType : 'application/json', 
          success: didSubmitEmail
        });                                                                           
 //     return false;
  
       }
                                                           
    return false;
});
                                                  
      

            function submitZip()
            {
                $.ajax({
                    type: 'GET',
                    url: 'http://services.sunlightlabs.com/api/legislators.allForZip.json',
                    data: 'zip=' + $('.zip').val() + '&apikey=0268e7d928694dfe85b778415c844a66',
                    crossDomain: true,
                    dataType: 'jsonp',
                    jsonp: 'jsonp'
                }).done(function (xhr) {
                            //console.log(xhr.response.legislators);

                            var a = xhr.response.legislators;

                            var html_fragment = '';
                            var handles_avail = 0;

                            for (var i = 0; i < a.length; i++) {
                                if ( a[i].legislator['twitter_id'] != '')
                                {
                                    handles_avail = 1;
                                    message = "Hi <span class=\"blue\">@" + a[i].legislator['twitter_id'] + "</span>, I'm one of your constituents. I support fixing the DMCA.</span> <span class=\"blue\">#FixTheDMCA</span>";
                                    messagef = 'Hi @' + a[i].legislator['twitter_id'] + ', I\'m one of your constituents. I support fixing the DMCA. #FixTheDMCA';
                                    urlmessage = encodeURIComponent(messagef);

                                    html_fragment = html_fragment + '<div class="legtweet clearfix span11"><div class="span9">' + message + '</div><div class="span2" id="'+ a[i].legislator['twitter_id'] +'"><a href="https://twitter.com/share?text=' + urlmessage + '" class="twitter-share-button legislatortweet" url="http://fixthedmca.org/?r=t-"'+tracking_id+' data-lang="en" data-count="none" data-size="large" data-counturl="http://fixthedmca.org">Tweet</a></div></div>';
                                }
                            }

                            if (handles_avail == 1) {
                                $('div#legtweets').removeClass('hide');
                                $('.get-legislators').parent().removeClass("error");
                            }


                            if (handles_avail == 0) {
                                $('div#legtweets').addClass('hide');
                                $('.get-legislators').parent().addClass("error");
                            }

                            $("#legtweets").html(html_fragment);
                            $.getScript("http://platform.twitter.com/widgets.js");

                        });

            }

            $('.get-legislators').click(function () {
                submitZip();
                window.setTimeout(function(){}, 300);
            });

            $('input.zip').keypress(function(e) {
                if(e.which == 13) {
                    $(this).blur();
                    $('.get-legislators').focus().click();
                    window.setTimeout(function(){}, 300);
                }
            });




 // $(document).scroll(function() {
 //    if ($(this).scrollTop() > 185) {
 //      $('#join-form').addClass('fixed-right');
 //    }
 //    else if ($(this).scrollTop() > 1985) {
 //      $('#join-form').removeClass('fixed-right');
 //      $('#join-form').addClass('stuck-right');
 //    }
 //    else {false}
 //  })