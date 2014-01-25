// Code to do input validation ********************
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
// Turn off all events when a link is clicked, fixes bug of not leaving page after 1st click because of blur event
function leave() {
    $('a').mousedown(function() {
        console.log("off");
        $('input').off();
    });
}

// Check for a uniqueness with database
function unique() {
    //console.log("unique");
    $('[data-unique]').on('blur unqiue' ,function() {
        $this = $(this);
        // Not empty
        if($this.val())
        {
            var error_msg = "has already been taken";

            $.get($this.data('unique'), {
                email: $this.val()
            }).success(function() {
                    removeError($this, error_msg);
                    // Checks regex after email
                    $this.trigger('regex');
                }).error(function() {
                    addError($this, error_msg);
                });
        }

        checkInput();
    });
};

// Check for a presence
function presence() {
    //console.log("presence");
    $('.validate-presence').on('blur input', function() {
        $this = $(this);
        var error_msg = "can't be blank";

        if( !$this.val() )
            addError($this, error_msg);
        else
            removeError($this, error_msg);
    });

    checkInput();
};

// Check for a required length
function length() {
    //console.log("length");
    $('.validate-length').on('blur input', function() {
        $this = $(this);
        var min_length = 8;
        var error_msg = "is too short (minimum is " + min_length + " characters)";

        // Not empty
        if($this.val())
        {
            if( $this.val().length < min_length )
                addError($this, error_msg);
            else
            {
                removeError($this, error_msg);
                $('.validate-match').trigger('match');

            }
        }

        checkInput();
    });
};

// Check if matches another input
function match() {
    //console.log("match");
    $('.validate-match').on('blur input match', function() {
        $this = $(this);
        var error_msg = "doesn't match Password";

        if( $this.val() != $('#user_password').val() )
            addError($this, error_msg);
        else
            removeError($this, error_msg);

        checkInput();
    });
};

// Check for a regex for the email
function regex() {
    //console.log("regex");
    $('.validate-regex').on('blur input regex',  function() {
        $this = $(this);
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        var error_msg = "is invalid";

        // Not empty
        if($this.val())
        {
            if( !re.test($this.val()) ) {
                addError($this, error_msg);
            }
            else
            {
                removeError($this, error_msg);
                $this.trigger("unqiue");
            }
        }

        checkInput();
    } );
};


function addError(input_element, error_msg) {
    // Remove any previous messages
    if(input_element.next())
        input_element.next().remove('.help-inline');

    input_element.parentsUntil( ".control-group").addClass('has-error');
    input_element.parent().append('<span class="help-inline">' + error_msg + '</span>');

    input_element.data('myvalid', 'false')
}

function removeError(input_element, error_msg) {
    if(input_element.next())
    {
        input_element.parentsUntil(".control-group").removeClass('has-error');
        input_element.next().remove('.help-inline');

        input_element.data('myvalid', 'true')
    }
}

function checkInput() {
    var disablebtn = false;
    $('[data-myvalid]').each(function(){
        //console.log($(this).val());
        //console.log($(this).data('myvalid'));
        if($(this).data('myvalid') != 'true')
        {
            // Disable button
            disablebtn = true;
            return false;
        }
        return true;
    });

    // Disable button
    $('input[name="commit"]').prop("disabled", disablebtn);
}
