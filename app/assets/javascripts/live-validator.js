(function(window, document, undefined){
    var live_validator = window.live_validator = {
        get: function() {
            return _instance
        },
        init: function(options) {
            return new LiveValidator(options)
        },
        VERSION: '0.1.0'
    };


    // Singleton
    var _instance;

    // Responsible for global settings
    function LiveValidator(options) {
        // Assign to instance
        _instance = this;

        // Get a list of options
        var _options = options || {};

        var _error = _options.Error || {};
        this.errorClass = _error.errorClass || 'error-inline';
        this.isErrorMessageEnabled = _error.isErrorMessageEnabled || true;
        this.messageLocation = _error.messageLocation || 'append';
        this.disableListenersOnElements = _error.disableListenersOnElements || '';

        var _errorMessages = _options.ErrorMessages || {};
        if(!_errorMessages.required)
            _errorMessages.required = {};
        if(!_errorMessages.minLength)
            _errorMessages.minLength = {};
        if(!_errorMessages.maxLength)
            _errorMessages.maxLength = {};
        if(!_errorMessages.minNumber)
            _errorMessages.minNumber = {};
        if(!_errorMessages.maxNumber)
            _errorMessages.maxNumber = {};
        if(!_errorMessages.regex)
            _errorMessages.regex = {};
        if(!_errorMessages.match)
            _errorMessages.match = {};
        this.errorMessagesEnum = {
            required: {
                message: _errorMessages.required.message || "can't be blank",
                isErrorMessageEnabled: _errorMessages.required.isErrorMessageEnabled || true
            },
            minLength: {
                message: _errorMessages.minLength.message || "is too short(minimum is ? characters)",
                isErrorMessageEnabled: _errorMessages.minLength.isErrorMessageEnabled || true
            },
            maxLength: {
                message: _errorMessages.maxLength.message || "is too long(maximum is ? characters)",
                isErrorMessageEnabled: _errorMessages.maxLength.isErrorMessageEnabled || true
            },
            minNumber: {
                message: _errorMessages.minNumber.message || "must be less than ?",
                isErrorMessageEnabled: _errorMessages.minNumber.isErrorMessageEnabled || true
            },
            maxNumber: {
                message: _errorMessages.maxNumber.message || "must be greater than ?",
                isErrorMessageEnabled: _errorMessages.maxNumber.isErrorMessageEnabled || true
            },
            regex: {
                message: _errorMessages.regex.message || "is invalid",
                isErrorMessageEnabled: _errorMessages.regex.isErrorMessageEnabled || true
            },
            match: {
                message: _errorMessages.match.message || "doesn't match ?",
                isErrorMessageEnabled: _errorMessages.match.isErrorMessageEnabled || true
            }
        }

        this.regexEnum = {
            alpha: {e: /^[a-zA-Z]+$/, message: 'may contain only letters'},
            alphanumeric: {e: /^[a-zA-Z0-9]+$/, message: 'may only contain only letters or numbers'},
            creditcard: {e: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/, message: 'must be a valid credit card number'},
            date: {e: /^(0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2}$/, message: 'must be a valid date'},
            digits: {e: /^[0-9]+$/, message: 'may contail only numbers'},
            email: {e: /^([a-zA-Z0-9._%-+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/, message: 'must be a valid email adress'},
            ipaddress: {e: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: 'must be a valid IP address'},
            phone: {e: /^((([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+)*$/, message: 'must be a valid phone number'},
            slug: {e: /^[a-z0-9-]+$/, message: 'must be a valid slug' },
            ssn: {e: /^([0-9]{3}[-]*[0-9]{2}[-]*[0-9]{4})*$/, message: 'must a valid social security number'},
            url: {e: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, message: 'must be a valid URL'},
            usstates: {e: /^(?:A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])*$/, message: 'must be valid US state'},
            uszipcode: {e: /^[0-9]{5}(?:-[0-9]{4})?$/, message: 'must be a valid US zip code'},
            password: {e: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]{8,}$/, message: 'is invalid'} //1 upper char, 1 lower, 1 number, at least 8 chars
        }

        var _wrapper = _options.Wrapper || {};
        this.wrapperClass =_wrapper.wrapperClass || 'form-group';
        this.isBootstrapValidationStyleEnabled = _wrapper.isBootstrapValidationStyleEnabled || true;

        var _validators = _options.Validators;

        var _submitButton = _options.SubmitButton || {};
        this.buttonElement = _submitButton.buttonElement || 'input[name="commit"]';
        this.preventSubmit = _submitButton.preventSubmit || true;

        this.inputArray = [];
        if(this.preventSubmit) {
            $(this.buttonElement).prop('disabled', true);
        }

        this.setListeners(_validators);

        this.isNoErrors = function() {
            for(var v = 0; v < this.inputArray.length; v++) {
                if(this.inputArray[v].stack.length > 0 || !this.inputArray[v].checkedForError)
                    if(this.inputArray[v].preventSubmit) {
                        $(this.buttonElement).prop('disabled', true);
                        return false;
                    }
            }
            $(this.buttonElement).prop('disabled', false);
            return true;
        }
    }

    // Adds rules to inputs
    LiveValidator.prototype.setListeners = function(validators)
    {

        console.log();
        // Turn off when listeners when linked is clicked
        $( 'a').add(this.buttonElement).add(this.disableListenersOnElements).mousedown(function() {
            $('input').off();
        });

        // Loops through all the rules
        for (var v=0; v<validators.length; v++){
            // Create a new Validator object for inputs specified
            this.inputArray.push(new Validator(validators[v], this));
        }
    }

    function Validator(validator, lv) {

        // Reference to the LiveValidator object to get global settings
        this.lv = lv;

        // Error stack
        this.stack = [];

        // Error on this input will disable the button
        this.preventSubmit = this.checkOption(validator.preventSubmit, lv.preventSubmit) || true;

        // Is there an error
        this.checkedForError = false;

        // Is input already prefilled
        if($(validator.name).val())
            this.checkedForError = true;


        // Get all the rules with this input, maintains an order from the settings
        var _rules = validator.rules;
        for(var i = 0; i < _rules.length; i++) {
            if(Object.keys(_rules[i]).toString() === 'required')
                this.Required(validator, i);
            if(Object.keys(_rules[i]).toString() === 'minLength')
                this.MinLength(validator, i);
            if(Object.keys(_rules[i]).toString() === 'maxLength')
                this.MaxLength(validator, i);
            if(Object.keys(_rules[i]).toString() === 'minNumber')
                this.MinLength(validator, i);
            if(Object.keys(_rules[i]).toString() === 'maxNumber')
                this.MaxLength(validator, i);
            if(Object.keys(_rules[i]).toString() === 'regex')
                this.Regex(validator, i);
            if(Object.keys(_rules[i]).toString() === 'match')
                this.Match(validator, i);
            if(Object.keys(_rules[i]).toString() === 'ajax')
                this.AJAX(validator, i);
        }

        this.addError = function(errorMessage, input_element, options, index) {
            //console.log("ADD Error");

            // Get options, local, input, global
            var isErrorMessageEnabled = this.checkOption(
                options.rules[index].isErrorMessageEnabled,
                options.isErrorMessageEnabled,
                this.lv.isErrorMessageEnabled);
            var isBootstrapValidationStyleEnabled = this.checkOption(
                options.rules[index].isBootstrapValidationStyleEnabled,
                options.isBootstrapValidationStyleEnabled,
                this.lv.isBootstrapValidationStyleEnabled);

            var messageLocation = this.checkOption(
                options.rules[index].messageLocation,
                options.messageLocation,
                this.lv.messageLocation);

            // Get values from LiveValidator instance
            var $wrapperClass =  input_element.closest('.' + this.lv.wrapperClass);
            var errorClass = this.lv.errorClass;

            // Clean up previous error messages
            if($wrapperClass.find('.' + errorClass))
                $wrapperClass.find('.' + errorClass).remove();

            // Only add the same message once
            var index = this.stack.indexOf(errorMessage);
            if (index === -1) {
                this.stack.push(errorMessage);
            }

            var $error_elem = $('<span/>', {
                'class' : errorClass,
                'text' : this.escapeHtml(this.stack[0])
            });

            // Add error message to the input
            if(isErrorMessageEnabled)
                if(messageLocation === 'append')
                    input_element.after($error_elem);
                else
                    input_element.before($error_elem);


            // Check if to add Bootstrap error class to the input
            if(isBootstrapValidationStyleEnabled)
                $wrapperClass.addClass('has-error');

            // Check for error for button disable/enable
            this.checkedForError = true;

            // Enable button
            this.lv.isNoErrors();
        }

        this.removeError = function(errorMessage, input_element, options, index) {
            //console.log("REMOVE Error");

            // Get options, local, input, global
            var isErrorMessageEnabled = this.checkOption(
                options.rules[index].isErrorMessageEnabled,
                options.isErrorMessageEnabled,
                this.lv.isErrorMessageEnabled);
            var isBootstrapValidationStyleEnabled = this.checkOption(
                options.rules[index].isBootstrapValidationStyleEnabled,
                options.isBootstrapValidationStyleEnabled,
                this.lv.isBootstrapValidationStyleEnabled);

            var messageLocation = this.checkOption(
                options.rules[index].messageLocation,
                options.messageLocation,
                this.lv.messageLocation);

            // Get values from LiveValidator instance
            var $wrapperClass =  input_element.closest('.' + this.lv.wrapperClass);
            var errorClass = this.lv.errorClass;

            // Clean up previous error messages
            if($wrapperClass.find('.' + errorClass))
                $wrapperClass.find('.' + errorClass).remove();

            var index = this.stack.indexOf(errorMessage);

            if (index > -1) {
                this.stack.splice(index, 1);
            }

            var $error_elem = $('<span/>', {
                'class' : errorClass,
                'text' : this.stack[0]
            });

            var length = this.stack.length;
            if(length > 0) {
                if(messageLocation === 'append')
                    input_element.after($error_elem);
                else
                    input_element.before($error_elem);
            }
            else
                // Check if to remove Bootstrap error class to the input
                if(isBootstrapValidationStyleEnabled)
                    $wrapperClass.removeClass('has-error');

            // Check for error for button disable/enable
            this.checkedForError = true;

            // Enable button
            this.lv.isNoErrors();
        }
    }

    Validator.prototype.checkOption = function() {
        for (var i = 0; i < arguments.length; i++)
        {
            if(arguments[i] != undefined)
                return arguments[i];
        }
        return false;
    }

    Validator.prototype.escapeHtml = function(text) {
        if(text != undefined)
            return text;
//        return text
//            .replace(/&/g, "&amp;")
//            .replace(/</g, "&lt;")
//            .replace(/>/g, "&gt;")
//            .replace(/"/g, "&quot;")
//            .replace(/'/g, "&#039;");
    }

     Validator.prototype.genId = function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };


    // Check for not blank
    Validator.prototype.Required = function (options, index)
    {
        //console.log("REQUIRE");

        // Get instance of Validator
        var validator = this;

        // Get events
        var events = options.rules[index].required.events || 'input blur';

        // attach a delegated event
        $(options.name).onFirst(events, function() {
            //console.log("REQUIRE");
            if(validator.checkOption(options.rules[index].required.isEnabled, options.isEnabled, true)) {

                var $this = $(this);

                // Get error message directly or global
                var errorMessage = options.rules[index].required.errorMessage || validator.lv.errorMessagesEnum.required.message;

                if( !$this.val())
                    validator.addError(errorMessage, $this, options, index);
                else
                    validator.removeError(errorMessage, $this, options, index);
            }
        });
    };

    // Check for a required length
    Validator.prototype.MinLength = function (options, index)
    {
        //console.log("MIN LENGTH");

        // Get instance of Validator
        var validator = this;

        // Get events
        var events = options.rules[index].minLength.events || 'input blur';

        // attach a delegated event
        $(options.name).on(events, function() {
            if(validator.checkOption(options.rules[index].minLength.isEnabled, options.isEnabled, true)) {

                var $this = $(this);

                // Get error message directly or global
                var errorMessage = options.rules[index].minLength.errorMessage || validator.lv.errorMessagesEnum.minLength.message;

                var min_length = options.rules[index].minLength.length || 0;

                errorMessage = errorMessage.replace('?', min_length);

                if( $this.val().length < min_length )
                    validator.addError(errorMessage, $this, options, index);
                else
                    validator.removeError(errorMessage, $this, options, index);
            }

        });
    };

    // Check for a required length
    Validator.prototype.MaxLength = function (options, index)
    {
        //console.log("MAX LENGTH");

        // Get instance of Validator
        var validator = this;

        // Get events
        var events = options.rules[index].maxLength.events || 'input blur';

        // attach a delegated event
        $(options.name).on(events, function() {
            if(validator.checkOption(options.rules[index].maxLength.isEnabled, options.isEnabled, true)) {

                var $this = $(this);

                // Get error message directly or global
                var errorMessage = options.rules[index].maxLength.errorMessage || validator.lv.errorMessagesEnum.maxLength.message;

                var max_length = options.rules[index].maxLength.length || -1;

                errorMessage = errorMessage.replace('?', max_length);

                if( $this.val().length > max_length && max_length != -1)
                    validator.addError(errorMessage, $this, options, index);
                else
                    validator.removeError(errorMessage, $this, options, index);
            }

        });
    };

    // Check for a required length
    Validator.prototype.MinNumber = function (options, index)
    {
        //console.log("MIN LENGTH");

        // Get instance of Validator
        var validator = this;

        // Get events
        var events = options.rules[index].minNumber.events || 'input blur';

        // attach a delegated event
        $(options.name).on(events, function() {
            if(validator.checkOption(options.rules[index].minNumber.isEnabled, options.isEnabled, true)) {

                var $this = $(this);

                // Get error message directly or global
                var errorMessage = options.rules[index].minNumber.errorMessage || validator.lv.errorMessagesEnum.minNumber.message;

                var min = options.rules[index].minNumber.minimum || 0;

                errorMessage = errorMessage.replace('?', min);

                if( parseFloat($this.val()) < min )
                    validator.addError(errorMessage, $this, options, index);
                else
                    validator.removeError(errorMessage, $this, options, index);
            }

        });
    };

    // Check for a required length
    Validator.prototype.MaxNumber = function (options, index)
    {
        //console.log("MAX LENGTH");

        // Get instance of Validator
        var validator = this;

        // Get events
        var events = options.rules[index].maxNumber.events || 'input blur';

        // attach a delegated event
        $(options.name).on(events, function() {
            if(validator.checkOption(options.rules[index].maxNumber.isEnabled, options.isEnabled, true)) {

                var $this = $(this);

                // Get error message directly or global
                var errorMessage = options.rules[index].maxNumber.errorMessage || validator.lv.errorMessagesEnum.maxNumber.message;

                var max = options.rules[index].maxNumber.maximum || 0;

                errorMessage = errorMessage.replace('?', max);

                if( parseFloat($this.val()) > max)
                    validator.addError(errorMessage, $this, options, index);
                else
                    validator.removeError(errorMessage, $this, options, index);
            }

        });
    };

    // Check if matches another input
    Validator.prototype.Match = function(options, index)
    {
        //console.log("MATCH");

        // Get instance of Validator
        var validator = this;

        // Get events
        var events = options.rules[index].match.events || 'input blur';

        // attach a delegated event
        $(options.name).on(events, function() {
            if(validator.checkOption(options.rules[index].match.isEnabled, options.isEnabled, true)) {

                var $this = $(this);

                // Get error message directly or global
                var errorMessage = options.rules[index].match.errorMessage || validator.lv.errorMessagesEnum.match.message;

                // Get input to match to
                var matchToElement = options.rules[index].match.matchToElement || {};
                var matchToElementName = options.rules[index].match.matchToElementName || {};
                errorMessage = errorMessage.replace('?', matchToElementName);

                if( $this.val() != $(matchToElement).val() )
                    validator.addError(errorMessage, $this, options, index);
                else
                    validator.removeError(errorMessage, $this, options, index);
            }
        });
    };

    // Check for a regex for the email
    Validator.prototype.Regex = function(options, index)
    {
        //console.log("REGEX");

        // Get instance of Validator
        var validator = this;

        // Get events
        var events = options.rules[index].regex.events || 'input blur';


        // Add a popover with a list for field requirements
        var popover = options.rules[index].regex.popover || {};

        if(popover.errorExpressions != undefined) {
            // Title of the popover
            var errorTitle = popover.errorTitle || '';

            // Content of the popover
            var errorMessages = $('<ul>', {
                class: 'popover_errors'
                //type: 'hidden'
            });

            // Event to trigger the popover
            var trigger = popover.trigger || 'focus';
            var offsetLeft = popover.offsetLeft || 265;
            var placementFunction = popover.placement ||
                function (context, source) {
                    var offset = $(source).offset();

                    if (offset.left > offsetLeft) {
                        return "right";
                    }
                    return "top";
                }

            // Get all requirements
            for(var i=0; i<popover.errorExpressions.length; i++)
                errorMessages.append('<li>' + popover.errorExpressions[i].message + '</li>');

            // Create the popover
            $(options.name).popover({
                title: errorTitle,
                content: function () {
                    //return $('#pswd_info').html();
                    return errorMessages.html();
                },
                placement: placementFunction,
                trigger: 'focus' ,
                html: true
                //container: '#user_password'
            });
        }

        // attach a delegated event
        $(options.name).on(events, function() {
            if(validator.checkOption(options.rules[index].regex.isEnabled, options.isEnabled, true)) {

                var $this = $(this);

                // Get error message directly or global
                var errorMessage;
                var re;
                var expression = options.rules[index].regex.expression || '/^[a-z0-9 ]+$/';

                for(var r in validator.lv.regexEnum) {
                    if(r.toString() === expression) {
                        re = new RegExp(validator.lv.regexEnum[r].e);
                        errorMessage = validator.checkOption(options.rules[index].regex.errorMessage, validator.lv.regexEnum[r].message ,validator.lv.errorMessagesEnum.regex.message);
                    }

                }
                if(re === undefined)
                    re = new RegExp(expression);

                if( !re.test($this.val()) )
                    validator.addError(errorMessage, $this, options, index);
                else
                {
                    validator.removeError(errorMessage, $this, options, index);
                    $(options.name).popover('hide');
                }
            }
        });
    };

    // Check with an AJAX call to server
    Validator.prototype.AJAX = function(options, index)
    {
        //console.log("AJAX");

        // Get instance of Validator
        var validator = this;

        // Get events
        var events = options.rules[index].ajax.events || 'input blur';

        //Timer for waiting until finish typing to send to server
        var timer = null;

        // attach a delegated event
        $(options.name).on(events, function() {
            if(validator.checkOption(options.rules[index].ajax.isEnabled, options.isEnabled, true))
            {
                var $this = $(this);

                var msKeyDownTimer = options.rules[index].ajax.msKeyDownTimer || 500;

                // Reset timer if event fired
                clearTimeout(timer);

                timer = setTimeout(function() {
                    // Get data attribute
                    var url = options.rules[index].ajax.url;

                    $.get(url, {value: $this.val()
                    }).success(function (data) {
                        if(data.status)
                            validator.removeError(data.message, $this, options, index);
                        else
                            validator.addError(data.message, $this, options, index);
                        });
                }, msKeyDownTimer);
            }
        });
    };
}(window, document));