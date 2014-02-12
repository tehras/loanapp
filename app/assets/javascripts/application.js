// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require plugins/pace/pace.js
//= require plugins/bootstrap/bootstrap.min.js
//= require plugins/slimscroll/jquery.slimscroll.min.js
//= require plugins/popupoverlay/jquery.popupoverlay.js
//= require plugins/popupoverlay/defaults.js
//= require plugins/popupoverlay/logout.js
//= require plugins/hisrc/hisrc.js
//= require plugins/messenger/messenger.min.js
//= require jquery.turbolinks
//= require plugins/messenger/messenger-theme-flat.js
//= require plugins/daterangepicker/moment.js
//= require plugins/daterangepicker/daterangepicker.js
//= require plugins/morris/morris.js
//= require plugins/morris/raphael-2.1.0.min.js
//= require plugins/flot/jquery.flot.js
//= require plugins/flot/jquery.flot.resize.js
//= require plugins/sparkline/jquery.sparkline.min.js
//= require plugins/moment/moment.min.js
//= require plugins/jvectormap/jquery-jvectormap-1.2.2.min.js
//= require plugins/jvectormap/maps/jquery-jvectormap-world-mill-en.js
//= require demo/map-demo-data.js
//= require plugins/easypiechart/jquery.easypiechart.min.js
//= require flex.js
//= require demo/dashboard-demo.js
//= require bootstrap-select.js
//= require bootstrap-datepicker.js
//= require jquery.dataTables.js
//= require live-validator.js
//= require jquery.bind-first-0.2.2.js

retrieveEmployee = function (employee) {
    var msg = {"employee":employee};
    $.ajax({
        type: 'GET',
        url: '/employees/'+employee,
        dataType: 'html',
        data: msg,

        success: function (response) {
            $('.employee-block').html(response);
        }
    });
}
retrievePatient = function (patient) {
    var msg = {"patient":patient};
    $.ajax({
        type: 'GET',
        url: '/patients/'+patient,
        dataType: 'html',
        data: msg,

        success: function (response) {
            $('.patient-block').html(response);
        }
    });
}
retrieveCase = function (lcase) {
    var msg = {"case":lcase};
    $.ajax({
        type: 'GET',
        url: '/cases/'+lcase,
        dataType: 'html',
        data: msg,

        success: function (response) {
            $('.employee-block').html(response);
        }
    });
}

$(document).ready(function() {
    $('#example').dataTable();
} );



