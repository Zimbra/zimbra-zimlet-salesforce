#!/bin/bash

npm install
zimlet build
zimlet package -v 1.0.6 --zimbraXVersion ">=2.0.0" -n "zimbra-zimlet-salesforce" --desc "Adds a button in the more menu to create a Salesforce case from an email." -l "Salesforce Email2Case"
