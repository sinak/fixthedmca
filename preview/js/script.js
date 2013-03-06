
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
  alert('Thanks for your support!');
  $('#rep-form')[0].reset();
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
                                          name: $('#name').val(),                   
                                          street_address: $('#address').val(),                   
                                          zip: $('#zip-code').val(),                   
                                          opt_in: $('#optin').val(),               
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
                                    message = "Hi <span class=\"blue\">@" + a[i].legislator['twitter_id'] + "</span>, I'm one of your constituents. Please fix the DMCA to <span class=\"choice\">make unlocking permanently legal</span>. <span class=\"blue\">#FixTheDMCA fixthedmca.org</span>";
                                    messagef = 'Hi @' + a[i].legislator['twitter_id'] + ', I\'m one of your constituents. Please fix the DMCA to make unlocking permanently legal. #FixTheDMCA fixthedmca.org';
                                    urlmessage = encodeURIComponent(messagef);

                                    html_fragment = html_fragment + '<div class="legtweet clearfix span11"><div class="span9">' + message + '</div><div class="span2" id="'+ a[i].legislator['twitter_id'] +'"><a href="https://twitter.com/share?text=' + urlmessage + '" class="twitter-share-button legislatortweet" url="" data-lang="en" data-count="none" data-size="large">Tweet</a></div></div>';
                                }
                            }

                            if (handles_avail == 1) {
                                $('div#choosereason').removeClass('hide');
                                $('.get-legislators').parent().removeClass("error");
                            }


                            if (handles_avail == 0) {
                                $('div#choosereason').addClass('hide');
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

            $('input.reason').click(function () {
                selected = $(':radio:checked').attr('id');

                var opt = new Array();
                opt[0] = "make jailbreaking legal";
                opt[1] = "make unlocking legal";
                opt[2] = "make screenreading legal";
                opt[3] = "make modifying & repairing legal";

                if (selected == 'optionsRadios1'){
                    $('span.choice').html(opt[0]);
                    $('iframe.legislatortweet').each(function(){
                        twitter = $(this).parent().attr('id');
                        theparent = $(this).parent()
                        $(this).remove();
                        message ='Hi @' + twitter + ', I\'m one of your constituents. Please fix the DMCA to ' + opt[0] + '.  #FixTheDMCA';
                        urlmessage = encodeURIComponent(message);
                        theparent.append('<a href="https://twitter.com/share?text=' + urlmessage + '" class="twitter-share-button legislatortweet" url="fixthedmca.org" data-lang="en" data-count="none" data-size="large">Tweet</a>');
                    });
                    $.getScript("http://platform.twitter.com/widgets.js");
                }
                
                if (selected == 'optionsRadios2'){
                    $('span.choice').html(opt[1]);
                    $('iframe.legislatortweet').each(function(){
                        twitter = $(this).parent().attr('id');
                        theparent = $(this).parent()
                        $(this).remove();
                        message ='Hi @' + twitter + ', I\'m one of your constituents. Please fix the DMCA to ' + opt[1] + '.  #FixTheDMCA';
                        urlmessage = encodeURIComponent(message);
                        theparent.append('<a href="https://twitter.com/share?text=' + urlmessage + '" class="twitter-share-button legislatortweet" url="fixthedmca.org" data-lang="en" data-count="none" data-size="large">Tweet</a>');
                    });
                    $.getScript("http://platform.twitter.com/widgets.js");
                }

                if (selected == 'optionsRadios3'){
                    $('span.choice').html(opt[2]);
                    $('iframe.legislatortweet').each(function(){
                        twitter = $(this).parent().attr('id');
                        theparent = $(this).parent()
                        $(this).remove();
                        message ='Hi @' + twitter + ', I\'m one of your constituents. Please fix the DMCA to ' + opt[2] + '.  #FixTheDMCA';
                        urlmessage = encodeURIComponent(message);
                        theparent.append('<a href="https://twitter.com/share?text=' + urlmessage + '" class="twitter-share-button legislatortweet" url="fixthedmca.org" data-lang="en" data-count="none" data-size="large">Tweet</a>');
                    });
                    $.getScript("http://platform.twitter.com/widgets.js");
                }

                if (selected == 'optionsRadios4'){
                    $('span.choice').html(opt[3]);
                    $('iframe.legislatortweet').each(function(){
                        twitter = $(this).parent().attr('id');
                        theparent = $(this).parent()
                        $(this).remove();
                        message ='Hi @' + twitter + ', I\'m one of your constituents. Please fix the DMCA to ' + opt[3] + '.  #FixTheDMCA';
                        urlmessage = encodeURIComponent(message);
                        theparent.append('<a href="https://twitter.com/share?text=' + urlmessage + '" class="twitter-share-button legislatortweet" url="fixthedmca.org" data-lang="en" data-count="none" data-size="large">Tweet</a>');
                    });
                    $.getScript("http://platform.twitter.com/widgets.js");
                }

                $('div#legtweets').removeClass('hide');

            });




