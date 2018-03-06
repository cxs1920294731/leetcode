"use strict";
var IMAGES = ("https:" == document.location.protocol ? "https:" : "http:") + "//image.groupbuyer.com.hk/";
var UPLOADPATH = ("https:" == document.location.protocol ? "https:" : "http:") + "//image.groupbuyer.com.hk/";
var is_web_mode = true;
$(function () {
    var $topBar = $("#top_bar");
    var $categoryBar = $("#category_bar");
    var $loginPopupForm = $("#login_popup_form");
    var $haveloginPopupForm = $loginPopupForm.length;
    var $shoppingCartBalloon = $("#shopping_cart_balloon");
    var $unreadCouponBalloon = $("#unread_coupon_balloon");
    var $keyword = $("#keyword");
    var $searchSuggestions = $("#search_suggestions");
    var $searchErrorMessage = $("#search_error_message");
    var $formDealSearch = $("#form_deal_search");
    var currentCat = "";
    var hideMenu;
    var is_pc_view_style = $("#is_pc_view_style").val();
    var url = window.location.href.replace(ROOT, "");
    if (!sessionStorage.length) {
        sessionStorage.lang = "zh";
    }
    if (url !== '') {
        var lang = url.substr(0, 2);
        if ($.inArray(lang, ["zh", "en"]) === -1) {
            lang = "zh";
        }
        if (sessionStorage.lang !== lang) {
            sessionStorage.lang = lang;
            localStorage.clear();
        }
    }
    if ($(window).width() < 975 && is_pc_view_style != 1) {
        is_web_mode = false;
    }
    if (!localStorage.length) {
        var jqxhr = $.ajax({url: "app/js/app/json/" + sessionStorage.lang + ".json", dataType: "json", async: false});
        jqxhr.done(function (data) {
            $.each(data, function (key, value) {
                localStorage.setItem(key, value);
            });
        });
    }
    var total_cart_items = parseInt($shoppingCartBalloon.text());
    if (total_cart_items > 0) {
        $shoppingCartBalloon.text(total_cart_items).show();
        animateBalloon("shopping_cart_balloon");
        $('#nav_cart_no').show();
    } else {
        $('#nav_cart_no').hide();
    }
    $(window).resize(function () {
        if ($(window).width() < 991 && parseInt($('#nav_cart_no').text()) > 0) {
            $('#nav_cart_no').show();
        }
    });
    var unread_coupons = parseInt($unreadCouponBalloon.text());
    if (unread_coupons > 0) {
        $unreadCouponBalloon.html(unread_coupons).show();
        animateBalloon("unread_coupon_balloon");
    }
    window.scrollTo(0, 0);
    $(window).on({
        click: function () {
            $searchSuggestions.hide();
        }, scroll: function () {
            var scroll_position = $(window).scrollTop();
            if ($categoryBar.length) {
                var float_position = $categoryBar.offset().top;
            } else {
                var float_position = $topBar.offset().top;
            }
            if (scroll_position > float_position) {
                $("#top_bar, #category_bar").hide().fadeIn(250);
                $topBar.addClass("top_bar_float");
                $categoryBar.addClass("category_bar_float");
                if ($haveloginPopupForm) {
                    $loginPopupForm.find(".form_container").addClass("form_container_float");
                }
            } else if ($categoryBar.length && scroll_position < 140) {
                $topBar.removeClass("top_bar_float");
                $categoryBar.removeClass("category_bar_float");
                if ($haveloginPopupForm) {
                    $loginPopupForm.find(".form_container").removeClass("form_container_float");
                }
            } else if (!$categoryBar.length) {
                if ($haveloginPopupForm) {
                    $loginPopupForm.find(".form_container").removeClass("form_container_float");
                }
            }
        }
    });
    $keyword.val("");
    $(".language").on("click", function (event) {
        var lang = ($(event.currentTarget).attr("id") === "en") ? "en" : "zh";
        if (sessionStorage.lang !== lang) {
            sessionStorage.lang = lang;
            localStorage.clear();
        }
    });
    $("#logout_link").on("click", function () {
        sessionStorage.is_logged_in = false;
        sessionStorage.total_cart_items = 0;
        sessionStorage.unread_coupons = 0;
    });
    var typingTimer;
    var searchInteval = 1000;
    $("#keyword").on("keyup", function () {
        var keyword = getValue("keyword");
        if (keyword.length < 2) {
            $searchSuggestions.empty().hide();
        } else {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function () {
                console.log(1);
                var jqxhr = $.ajax({url: sessionStorage.lang + "/search", data: {keyword: keyword}});
                jqxhr.done(function (suggestion_list) {
                    if (suggestion_list !== '') {
                        $searchSuggestions.html(suggestion_list).show();
                        $(".suggest_item").hover(function () {
                            $(this).toggleClass("suggest_item_hover");
                        });
                    }
                });
            }, 1000);
        }
    });
    $(".category_button").on("mouseenter", function () {
        $(".category_arrow").hide();
        $(this).find(".category_arrow").show();
        if (currentCat !== $(this).index()) {
            $("#category_bar").find(".category_submenu").eq(currentCat).hide();
            currentCat = $(this).index();
        }
        $(this).find(".category_submenu").stop(true, true).fadeIn(250).eq(currentCat).hover(function () {
            $(this).show();
        });
        clearTimeout(hideMenu);
    });
    $(".category_button").on("mouseleave", function () {
        hideMenu = setTimeout(function () {
            $(".category_arrow, .category_submenu").hide();
        }, 50);
    });
    $(".topmenu_item").on("mouseenter", function () {
        $(this).removeClass("cat_item_" + $(this).attr("id")).addClass("cat_item_over_" + $(this).attr("id")).addClass("topmenu_item_over");
    });
    $(".topmenu_item").on("mouseleave", function () {
        $(this).addClass("cat_item_" + $(this).attr("id")).removeClass("cat_item_over_" + $(this).attr("id")).removeClass("topmenu_item_over");
    });
    $(".deal-item").on("mouseenter", function () {
        $(this).addClass("deal-item_hover");
    });
    $(".deal-item").on("mouseleave", function () {
        $(this).removeClass("deal-item_hover");
    });
    $("#location").on("change", function () {
        $("#location_form").submit();
    });
    $(".reset_button").on("click", function () {
        var form = $(this).closest("form").attr("id");
        $("#" + form).find(".form-error_message").text("");
        document.getElementById(form).reset();
    });
    $(".noProp").click(function (event) {
        event.stopPropagation();
    });
    $(".subscribe_button").click(function (event) {
        var subscribe_email = $(".subscribe_email").val();
        if (!validateEmail(subscribe_email)) {
            alert("Please fill in a valid email.");
            $(".subscribe_email").val("");
            return false;
        }
        var jqxhr = $.ajax({
            url: "http://groupbuyer.com.hk/zh/subscribe_email",
            data: {
                email: subscribe_email
            }
        });
        jqxhr.done(function (subscribe_result) {
            if (subscribe_result == "1") {
                $(".subscribe_group").hide();
                $(".subscribe_bar").text("You have subscribed successfully.");
            } else {
                alert("Please fill in a valid email.");
            }
            $(".subscribe_email").val("");
        });
    });
});

function validateEmail(email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
}

function showLandingPage() {
    var is_read_landing = parseInt(getValue("is_read_landing"));
    if (is_read_landing === 0) {
        window.location = ROOT + sessionStorage.lang + '/landing';
    }
}

function animateBalloon(id) {
    $("#" + id).animate({"opacity": "0.5", "top": "-=2px"}, 800).animate({
        "opacity": "1",
        "top": "+=2px"
    }, 800, function () {
        animateBalloon(id);
    });
}

function getValue(id) {
    return $.trim($("#" + id).val());
}

function getNameValue(name) {
    return $.trim($("input[name=" + name + "]").val());
}

function getData(id, data_name) {
    return $("#" + id).data(data_name);
}

function get_onetime_hash() {
    var onetime_hash;
    var jqxhr = $.ajax({url: "generate_onetime_hash", async: false});
    jqxhr.done(function (hash) {
        onetime_hash = hash;
    });
    return onetime_hash;
}

function checkSearchForm() {
    var keyword = getValue("keyword");
    if (keyword.length < 2) {
        $("#search_error_message").show();
        return false;
    }
    $("#search_error_message").hide();
    $("#form_deal_search").attr("action", $("#form_deal_search").attr("action") + "/" + keyword);
    return true;
}

function checkNavSearchForm() {
    var keyword = $(".nav-menu #nav_keyword").val();
    if (keyword.length < 2) {
        $(".nav-menu #nav_search_error_message").show();
        $(".search_deal").css("margin-bottom", "0px");
        $(".nav-menu #slider_menu_outer_container").css("height", "966px");
        return false;
    }
    $(".nav-menu #nav_search_error_message").hide();
    $(".search_deal").css("margin-bottom", "10px");
    $(".nav-menu #slider_menu_outer_container").css("height", "955px");
    $(".nav-menu #nav_form_deal_search").attr("action", $(".nav-menu #nav_form_deal_search").attr("action") + "/" + keyword);
    return true;
}

