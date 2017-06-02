(function ($) {
    /**
     * Creates a select
     */
    var use_dropdown = lssm_settings.get("aaos_dropdown", false).toString();
    function addToDropdown()
    {
        "use strict";
        // Add all the original AAO options
        $("a[id^='aao_']").each(function (i,e) {
            e = $(e);
            var option = document.createElement("option");
            option.value = e.attr('id').substring(4);
            option.text = e.text();
            $("#lssm_aao_dropdown").append(option);
        });

        // When we select something
        $("#lssm_aao_dropdown").on("change", function(){
            var aao_id = $(this).val();
            // We need a ID
            if (aao_id == -1)
                return;
            // Get the original button
            $("a[id='aao_"+aao_id+"']").click();
            setTimeout(function(){
                $('#lssm_aao_dropdown').val("-1");
            }, 500);
        });
    }

    /**
     * Formats the options for the select
     * @param option
     * @returns {*}
     */
    function formatOptions(option)
    {
        "use strict";
        if(typeof option.id == "undefined" || option.id == "-1") {
            console.log("undef");
            return option.text;
        }
        var available = document.getElementById("available_aao_"+option.id).innerHTML;
        var bg = $("#aao_"+option.id).css("background-color");
        option = $('<span style="background-color: '+bg+';">'+available + option.text+'</span>');
        return option;
    }
    function activateSearch()
    {
        "use strict";
        $("#mission-aao-group").before('<input type="text" id="lssm_aao_search" style="min-width: 400px;" placeholder="AAO suchen">');
        $("#mission-aao-group").before('<div id="lssm_aao_results"></div>');
        $("a[id^='aao_']").css("display", "inline-block");
        $("#lssm_aao_search").on("keyup", function(){
            "use strict";
            var value = this.value;
            if(value.length > 0)
            {
                if($("#lssm_aao_results > a[id^='aao_']:contains('"+value+"')").length == 0)
                    $("a[id^='aao_']:contains('"+value+"')").clone().appendTo("#lssm_aao_results");
                $("#mission-aao-group div:not(.clearfix)").each(function() {
                    this.style.setProperty("display", "none");
                });
                $("#lssm_aao_results > a[id^='aao_']:not(:contains('"+value+"'))").remove();
            }
            else
            {
                $("#mission-aao-group div:not(.clearfix)").each(function() {
                    this.style.setProperty("display", "block");
                });
                $("#lssm_aao_results > a").remove();
            }
        });
    }
    /**
     * Initialize
     */

    $("#mission-aao-group").before('Dropdown nutzen: <div class="onoffswitch"><input class="onoffswitch-checkbox" id="lssm_aao_search_dropdown" '+((use_dropdown=="true")?'checked="checked':'')+' value="true" name="onoffswitch" type="checkbox"><label class="onoffswitch-label" for="lssm_aao_search_dropdown"></label></div>');
    // Add a reset button
    $("#mission-aao-group").before('<button id="lssm_aao_reset" class="btn btn-small btn-danger">Zurücksetzen</button>');
    if(use_dropdown == "true")
    {
        // Hide all original AAO buttons
        $("#mission-aao-group div:not(.clearfix)").each(function() {
            this.style.setProperty("display", "none");
        });
        // Create a new select
        $("#mission-aao-group").before('<select id="lssm_aao_dropdown" name="lssm_aao_dropdown" style="min-width: 400px;"><option value="-1">Bitte wählen...</option></select>');
        // Add the original AAO's to the select
        addToDropdown();
        // Format the options from the select
        $( "#lssm_aao_dropdown" ).select2({
            templateResult: formatOptions
        });
    }
    else
    {
        activateSearch();
    }

    $("#lssm_aao_search_dropdown").on("click", function() {
        "use strict";
        lssm_settings.set("aaos_dropdown", this.checked);
        if(this.checked)
        {
            $("#lssm_aao_search").remove();
            // Hide all original AAO buttons
            $("#mission-aao-group div:not(.clearfix)").each(function() {
                this.style.setProperty("display", "none");
            });
            // Create a new select
            $("#mission-aao-group").before('<select id="lssm_aao_dropdown" name="lssm_aao_dropdown" style="min-width: 400px;"><option value="-1">Bitte wählen...</option></select>');
            addToDropdown();
            // Format the options from the select
            $( "#lssm_aao_dropdown" ).select2({
                templateResult: formatOptions
            });
        }
        else
        {
            // Hide all original AAO buttons
            $("#mission-aao-group div:not(.clearfix)").each(function() {
                this.style.setProperty("display", "block");
            });
            $("#lssm_aao_dropdown").remove();
            $(".select2:has(#select2-lssm_aao_dropdown-container)").remove();
            activateSearch();
        }
    });
    $("#lssm_aao_reset").on("click", function(){
        "use strict";
        vehicleSelectionReset();
    });
})($);
