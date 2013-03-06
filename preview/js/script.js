
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
            $.scrollTo(slideshow.$slides.eq(n), {
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
      if($(window).scrollTop()>5700){
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