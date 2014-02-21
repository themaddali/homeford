jQuery(document).ready(function(e) {
  var t = {
    lines : 17,
    length : 6,
    width : 4,
    radius : 12,
    rotate : 0,
    color : "#ccc",
    speed : 2.2,
    trail : 60,
    className : "spinner",
    zIndex : 2e9,
    top : "auto",
    left : "auto"
  }, n = document.getElementById("preloader"), r = (new Spinner(t)).spin(n);
  e.backstretch(work_script_params.workBg);
  var i = e(window).height(), s = e("#contact-modal").height(), o = i / 2 - s / 2;
  e("a[rel*=theModal]").leanModal({
    top : o,
    overlay : .7,
    closeButton : ".modal_close"
  });

  if (!jQuery.cookie('user')) {
    var currentlocation = window.location.href;
    window.location.assign(currentlocation.split('view/class')[0]);
  } else {
    jQuery('#loggedin-user').text(jQuery.cookie('user'));
  }
  
  //Create the quiz panels on the fly (DB should send this info per user/teacher/quiz)
  //Testing with 10 Questions
  var quizboardtemplate = jQuery('#quizboard-template').remove().attr('id', '');
  var QUESTIONS = 10; 
  for (var i=1; i<= QUESTIONS; i++)
  {
    var newboard = quizboardtemplate.clone();
    jQuery('.qtnnumber', newboard).text('#'+i);
    jQuery('#carousel').append(newboard);
    if (i=== QUESTIONS)
    {
      jQuery('#carousel').append('<div class="empty"></div>');
    }
  }

  Modernizr.load({
    test : Modernizr.touch,
    yep : {
      loadSwipejs : work_script_params.swipejsurl
    },
    nope : {
      loadCarousel : work_script_params.carouselurl
    },
    callback : {
      loadSwipejs : function(t, n, i) {
        jQuery(function() {
          e("#wrapper-touch").removeClass("hidden");
          e("#wrapper").remove();
          var t = new Swipe(document.getElementById("wrapper-touch"), {
            speed : 500,
            callback : function(e, t, n) {
            }
          });
          e("a#prev").click(function() {
            t.prev()
          });
          e("a#next").click(function() {
            t.next()
          });
          e(window).resize(function() {
            e(window).width() > 480 ? e("#slider-container").css({
              top : e(window).height() / 2 - 225 + "px"
            }) : e("#slider-container").css({
              top : "80px"
            })
          }).resize();
          e("#wrapper-touch").waitForImages(function() {
            r.stop();
            e("#wrapper-touch").animate({
              opacity : 1
            }, 600)
          })
        })
      },
      loadCarousel : function(t, n, i) {
        jQuery(function() {
          function t(e) {
            e.find("a").stop().fadeTo(500, 0);
            e.addClass("selected");
            e.unbind("click");
            generateQuiz()
            var totalobjects = jQuery('.quizboard').length;
            var currentobject = (jQuery('.selected > .qtnnumber').text()).split("#")[1];
            progress(Math.round((100/totalobjects)*currentobject), jQuery('#progressBar'));
          }


          e("#wrapper").removeClass("hidden");
          e("#wrapper-touch").remove();
          e("#wrapper").waitForImages(function() {
            r.stop();
            e("#wrapper").animate({
              opacity : 1
            }, 600)
          });
          e(function() {
            e("#carousel").carouFredSel({
              circular : !1,
              width : "100%",
              height : 490,
              items : 3,
              auto : !1,
              prev : {
                button : "#prev",
                key : "left"
              },
              next : {
                button : "#next",
                key : "right"
              },
              scroll : {
                items : 1,
                duration : 1e3,
                easing : "quadratic",
                onBefore : function(t, n) {
                  t.find("a").stop().fadeTo(500, 1);
                  t.removeClass("selected");
                  t.prev().unbind("click");
                  t.next().unbind("click");
                  n.prev().click(function(t) {
                    t.preventDefault();
                    e("#carousel").trigger("prev", 1)
                  });
                  n.next().click(function(t) {
                    t.preventDefault();
                    e("#carousel").trigger("next", 1)
                  })
                },
                onAfter : function(e, n) {
                  t(n.eq(1))
                }
              },
              onCreate : function(n) {
                t(n.eq(1));
                e("#carousel div.selected").next().click(function(t) {
                  t.preventDefault();
                  e("#carousel").trigger("next", 1);
                })
              }
            })
          })
        })
      }
    }
  })
  
  jQuery('.answer-option').on('click', function() {
    if (jQuery(this).attr('data-id') === 'correct') {
      jQuery(this).addClass('correct');
      setTimeout(function() {
        //jQuery('.qtn').parent(".quizboard").addClass('correct');
        e("#carousel").trigger("next", 1);
        generateQuiz();
      }, 1000);
    } else {
      jQuery(this).addClass('incorrect');
    }
  });
  
  function generateQuiz() {
    //jQuery('.quizboard .correct').removeClass('correct');
    jQuery('.answer-option').removeClass('correct');
    jQuery('.answer-option').removeClass('incorrect');
    jQuery('.answer-option').attr('data-id', '');
    var operands = ['+', '-', '*'];
    var activeoperand = operands[Math.floor((Math.random() * 2) + 1)];
    var number1 = Math.floor((Math.random() * 100) + 1);
    var number2 = Math.floor((Math.random() * 100) + 1);
    var answer;
    if (activeoperand == '+') {
      answer = number1 + number2;
    }
    if (activeoperand == '-') {
      answer = number1 - number2;
    }
    if (activeoperand == '*') {
      answer = number1 * number2;
    }
    jQuery('.qtn').text('Value of ' + number1 + ' ' + activeoperand + ' ' + number2 + ' = ?');
    var optionlocation = Math.floor((Math.random() * 4) + 1);
    for (var i = 1; i < 5; i++) {
      if (i === optionlocation) {
        jQuery(".option" + i).val(answer).attr('data-id', 'correct');
      } else {
        var randomize = Math.floor((Math.random() * 30) + 1);
        randomize = answer + randomize;
        jQuery(".option" + i).val(randomize);
      }
    }
  }

  function progress(percent, element) {
    var progressBarWidth = percent * jQuery(element).width() / 100;
    element.find('div').animate({
      width : progressBarWidth
    }, 500).html(percent + "%&nbsp; ");
  }

});
