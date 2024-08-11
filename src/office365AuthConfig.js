/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from '@azure/msal-browser'

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
const clienID = '648a3dd6-4a57-46d1-803c-8869ff882c42'
const tenantID = '1b669d37-c786-49a8-9909-0d72cfbe7c33'

export const office365MsalConfig = {
  auth: {
    clientId: clienID, // This is the ONLY mandatory field that you need to supply.
    authority: 'https://login.microsoftonline.com/' + tenantID, // Defaults to "https://login.microsoftonline.com/common"
    clientSecret: 'LhA8Q~1knENzfjZA_k1T1prERAk3_qsclaO9GbyH'
  },
  cache: {
    cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return
        }
        switch (level) {
          case LogLevel.Error:
            // console.error(message);
            return
          case LogLevel.Info:
            // console.info(message);
            return
          case LogLevel.Verbose:
            // console.debug(message);
            return
          case LogLevel.Warning:
            // console.warn(message);
            return
          default:
            return
        }
      }
    }
  }
}

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ['User.Read']
}
//'Sites.FullControl.All','Sites.ReadWrite.All'
