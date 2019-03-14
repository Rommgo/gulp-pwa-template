if (jQuery('#go-top').length) {
    var target = jQuery("#go-top");
    var scrollTrigger = 100, // px
        backToTop = function () {
            var scrollTop = jQuery(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                target.show(10);
            } else {
                target.hide();
            }
        };
    backToTop();
    jQuery(window).on('scroll', function () {
        backToTop();
    });
    target.on('click', function (e) {
        e.preventDefault();
        jQuery('html,body').animate({scrollTop: 0}, 700);
    });
}