// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-file-upload';

Cypress.Commands.add(
	'login',
	( username = 'admin', password = 'password', path = '' ) => {
		if ( 0 === path.length ) {
			cy.visit( `/wp-admin` );
		} else {
			cy.visit( path );
		}
		cy.get( 'body' ).then( ( $body ) => {
			if ( $body.find( '#wpwrap' ).length == 0 ) {
				cy.get( 'input#user_login' ).clear();
				cy.get( 'input#user_login' ).click().type( username );
				cy.get( 'input#user_pass' ).type( `${ password }{enter}` );
			}
		} );
	}
);

Cypress.Commands.add( 'visitAdminPage', ( page = 'index.php' ) => {
	cy.login();
	if ( page.includes( 'http' ) ) {
		cy.visit( page );
	} else {
		cy.visit( `/wp-admin/${ page.replace( /^\/|\/$/g, '' ) }` );
	}
} );

Cypress.Commands.add(
	'createTaxonomy',
	( name = 'Test taxonomy', taxonomy = 'category' ) => {
		cy.visitAdminPage( `edit-tags.php?taxonomy=${ taxonomy }` );
		cy.get( '#tag-name' ).click().type( `${ name }{enter}` );
	}
);

Cypress.Commands.add( 'openDocumentSettingsSidebar', () => {
	const button =
		'.edit-post-header__settings button[aria-label="Settings"][aria-expanded="false"]';
	cy.get( 'body' ).then( ( $body ) => {
		if ( $body.find( button ).length > 0 ) {
			cy.get( button ).click();
		}
	} );
	cy.get( '.edit-post-sidebar__panel-tab' ).contains( 'Post' ).click();
} );

Cypress.Commands.add( 'openDocumentSettingsPanel', ( name ) => {
	cy.openDocumentSettingsSidebar();
	cy.get( '.components-panel__body .components-panel__body-title button' )
		.contains( name )
		.then( ( panel ) => {
			if ( ! panel.hasClass( '.is-opened' ) ) {
				cy.get( panel ).click();
				cy.get( panel )
					.parents( '.components-panel__body' )
					.should( 'have.class', 'is-opened' );
			}
		} );
} );

Cypress.Commands.add( 'addPage', ( title, content ) => {
	cy.login( undefined, undefined, '/wp-admin/post-new.php?post_type=page' );
	cy.get( 'button[aria-label="Close dialog"]' ).click();

	cy
		.get( '.editor-post-title__input' )
		.type( title );

	cy.get( '.edit-post-header-toolbar__inserter-toggle' ).click();
	cy.get( '.block-editor-inserter__search-input' ).type( 'paragraph' );
	cy.get( '.editor-block-list-item-paragraph' ).click();
	cy.get( '.editor-post-publish-button__button' ).click();
	cy.get( '.editor-post-publish-panel__header-publish-button .editor-post-publish-button__button' ).click();
	cy.wait( 1000 );
} );
