"use strict";

const Keycloak = require("keycloak-connect");

/**
 * Keycloak instance that will serve to authenticate API routes
 * 
 * Examples:
 * 
 * Simple authentication (the user has a valid token)
 * app.get( '/complain', keycloak.protect(), routeHandler );
 * 
 * To secure a resource with an application role for the current app:
 * app.get( '/special', keycloak.protect('special'), specialHandler );
 * 
 * To secure a resource with an application role for a different app:
 * app.get( '/extra-special', keycloak.protect('other-app:special', extraSpecialHandler );
 * 
 * To secure a resource with a realm role:
 * app.get( '/admin', keycloak.protect( 'realm:admin' ), adminHandler );
 * 
 * Keycloak nodejs adapter docs:
 * https://wjw465150.gitbooks.io/keycloak-documentation/content/securing_apps/topics/oidc/nodejs-adapter.html
 */
const keycloak = new Keycloak(
  {},
  {
    realm: process.env.KEYCLOAK_REALM,
    "bearer-only": true,
    "auth-server-url": process.env.KEYCLOAK_URL,
    "ssl-required": "external",
    resource: process.env.KEYCLOAK_CLIENT,
    "confidential-port": 0,
  }
);



module.exports = {
  keycloak,
};
