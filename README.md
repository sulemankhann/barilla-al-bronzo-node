# Introduction 
This is the Barilla static campaign builder project, its designed to streamline the creation of static campaigns to be uploaded into contentful and displayed within the Barilla website. This project provides a webserver and barilla template to allow the developer to view how the campaign should look after being uploaded correctly to contentful and export a build of the campaign files in the correct format.

# Getting Started

## Project dependencies
This application is built to work with nodeJs v20.10.0

## First run
1. run `npm install` to install npm dependencies
2. run the built in webserver `npm run start`
3. browse to the url of the desired file within the `src/` folder using the local port provided

# Campaign development
To build a new campaign its ideal to first fork this repo, this will allow any upstream changes to the templates to be easily applied to your campaign in the future. Once you have prepared yure repo, your campaign files will be added to the `src/` folder, with all supporting assets (js/css/img/fonts etc) being added to the `assets/` folder. To work successfully, each locale requires its own html file in the root of the `src/` folder with th filename format `{locale}.html`, the locales should be supplied to you by Barilla. To make sure all assets work with the build process, please make sure all asset source urls are relative and start with `./`, this includes in css files.

# Build and Test
When the campaign is ready to be exported for upload to contentful, you need to run the `npm run build` command. this will ask you for the name of the campaign to use for the generated zip. Please only use aplhanumeric characters and `-` to generate the names.

Once you have the generated zip, please send this to the appropriate contact to upload to the campaign within Contentful.
