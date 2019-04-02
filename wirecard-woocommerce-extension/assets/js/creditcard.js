/*
 * Helper functions
 */


var token                  = null;
var tab_content            = '.wd-tab-content';
var nonce                  = jQuery( '#wc_payment_method_wirecard_creditcard_response_form input[name="cc_nonce"]' );
var togglers               = jQuery( '.wd-toggle-tab' );
var content_areas          = jQuery( tab_content );
var new_card_content_area  = jQuery( '#wc_payment_method_wirecard_new_credit_card' );
var vault_content_area     = jQuery( '#wc_payment_method_wirecard_creditcard_vault' );
var seamless_submit_button = jQuery( '#seamless-submit' );
var vault_submit_button    = jQuery( '#vault-submit' );


/**
 * Log any error that has occurred.
 *
 * @param data
 * @since 1.7.0
 */
function log_error( data ) {
	console.error( 'An error occurred: ', data );
}

/*
 * AJAX-based functions
 */

/**
 * Save a new credit card token to our vault.
 *
 * @param response
 * @returns mixed
 * @since 1.7.0
 */
function save_credit_card_to_vault( response ) {
	var vault_checkbox = jQuery( "#wirecard-store-card" );
	var request = {
		'action': 'save_cc_to_vault',
		'token': response.token_id,
		'mask_pan': response.masked_account_number
	};

	if ( "success" !== response.transaction_state ) {
		return;
	}

	if ( ! vault_checkbox.is( ':checked' ) ) {
		return;
	}
	
	return jQuery.ajax(
		{
			type: 'POST',
			url: php_vars.vault_url,
			data: request,
			dataType: 'json'
		}
	);
}

/**
 * Get all saved credit cards from the vault
 *
 * @return mixed
 * @since 1.7.0
 */
function get_credit_cards_from_vault() {
	return jQuery.ajax(
		{
			type: "GET",
			url: php_vars.vault_get_url,
			data: { "action" : "get_cc_from_vault" },
			dataType: "json",
		}
	);
}

/**
 * Delete a saved credit card from the vault
 *
 * @param id
 * @since 1.1.0
 */
function delete_credit_card_from_vault( id ) {
	return jQuery.ajax(
		{
			type: "POST",
			url: php_vars.vault_delete_url,
			data: { "action" : "remove_cc_from_vault", "vault_id": id },
			dataType: "json",
		}
	);
}

/**
 * Gets the request data from the server.
 *
 * @returns mixed
 * @since 1.7.0
 */
function get_credit_card_data() {
	return jQuery.ajax(
		{
			type: 'POST',
			url: php_vars.ajax_url,
			cache: false,
			data: {'action': 'get_credit_card_request_data'},
			dataType: 'json',
		}
	);
}

/**
 * Submits the seamless response to the server
 *
 * @param {Object} response
 * @returns mixed
 * @since 1.7.0
 */
function submit_credit_card_response( response ) {
	return jQuery.ajax(
		{
			type: 'POST',
			url: php_vars.submit_url,
			cache: false,
			data: response,
			dataType: 'json',
		}
	);
}

/**
 * Submits a vault-based payment to the server
 *
 * @returns mixed
 * @since 1.7.0
 */
function submit_vault() {
	request = {
		'vault_token': token,
		'cc_nonce': nonce.val(),
		'action': 'submit_creditcard_response'
	};

	return jQuery.ajax(
		{
			type: 'POST',
			url: php_vars.submit_url,
			cache: false,
			data: request,
			dataType: 'json',
		}
	);
}

/*
 * User interface-related functions
 */

/**
 * @param cardResponse
 */
function add_credit_cards_to_vault_tab(cardResponse) {
	var cards = cardResponse.data;

	vault_content_area
		.find( '.cards' )
		.html( cards )
}

/**
 * @param delete_trigger
 * @param id
 */
function delete_credit_card_from_vault_tab( delete_trigger, id ) {
	token = null;
	vault_submit_button.attr( 'disabled', 'disabled' );
	jQuery( delete_trigger ).append( php_vars.spinner );

	delete_credit_card_from_vault( id )
		.then( add_credit_cards_to_vault_tab )
		.fail( log_error )
}

function toggle_tab() {
	var $tab = jQuery( this );

	if ( $tab.hasClass( 'active' ) ) {
		return;
	}

	togglers
		.removeClass( 'active' )
		.find( '.dashicons' )
		.removeClass( 'dashicons-arrow-up' )
		.addClass( 'dashicons-arrow-down' );

	$tab.find( '.dashicons' )
		.removeClass( 'dashicons-arrow-down' )
		.addClass( 'dashicons-arrow-up' );

	content_areas.slideUp();

	$tab.addClass( 'active' )
		.next( tab_content )
		.slideDown();
}

function on_token_selected( token_field ) {
	var selected_token = jQuery( token_field ).data( 'token' );
	
	if ( selected_token ) {
		token = selected_token;
		vault_submit_button.removeAttr( 'disabled' );
	}
}

/*
 * Seamless related functions
 */

/**
 * Handle the results of the form submission.
 *
 * @since 1.7.0
 */
function handle_submit_result( response ) {
	var data = response.data;

	if ( "error" === data.result ) {
		document.location.reload();
		return;
	}

	document.location = data.redirect;

}

/**
 * Submit the data so we can do a proper transaction
 *
 * @param response
 * @since 1.7.0
 */
function on_form_submitted( response ) {
	response['action']   = 'submit_creditcard_response';
	response['cc_nonce'] = nonce.val();

	save_credit_card_to_vault( response )
		.then(
			function () {
				submit_credit_card_response( response )
					.then( handle_submit_result )
					.fail( log_error );
			}
		);
}

/**
 * Renders the actual seamless form
 *
 * @since 1.7.0
 */
function render_form( response ) {
	var request_data = JSON.parse( response.data );

	WirecardPaymentPage.seamlessRenderForm(
		{
			requestData: request_data,
			wrappingDivId: 'wc_payment_method_wirecard_creditcard_form',
			onSuccess: on_form_rendered,
			onError: log_error,
		}
	);
}

/**
 * Resize the credit card form when loaded
 *
 * @since 1.0.0
 */
function on_form_rendered() {
	seamless_submit_button.removeAttr( 'disabled' );
	new_card_content_area.find( 'iframe' ).height( 470 );
}

/**
 * Initializes the vault interface as required.
 */
function initialize_vault() {
	togglers.on( 'click', toggle_tab );

	get_credit_cards_from_vault()
		.then( add_credit_cards_to_vault_tab )
		.fail( log_error );
}

/**
 * Coordinates the necessary calls for making a successful credit card payment.
 *
 * @since 1.7.0
 */
function initialize_form() {
	var vault_needs_to_be_initialized = togglers.length > 0;

	if ( vault_needs_to_be_initialized ) {
		initialize_vault();
	}

	get_credit_card_data()
		.then( render_form )
		.fail( log_error )
		.always(
			function() {
				jQuery( '.show-spinner' ).hide()
			}
		)
}

/**
 * Submit the seamless form or token and handle the results.
 *
 * @since 1.7.0
 */
function submit_seamless_form() {
	jQuery( this ).after( php_vars.spinner );
	jQuery( '.spinner' ).addClass( 'spinner-submit' );

	WirecardPaymentPage.seamlessSubmitForm(
		{
			wrappingDivId: "wc_payment_method_wirecard_creditcard_form",
			onSuccess: on_form_submitted,
			onError: log_error
		}
	);
}

/**
 * Submit the token and handle the results.
 *
 * @since 1.7.0
 */
function submit_vault_form() {
	jQuery( this ).after( php_vars.spinner );
	jQuery( '.spinner' ).addClass( 'spinner-submit' );

	submit_vault()
		.then( handle_submit_result )
		.fail( log_error );
}

/*
 * Integration code
 */

jQuery( document ).ready( initialize_form );
seamless_submit_button.click( submit_vault_form );
vault_submit_button.click( submit_seamless_form );
