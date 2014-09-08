Eyevinn Player is a VideoJS based video player with the purpose to help you test
the qualities of an adaptive stream in HLS. The video player includes a throttler
where you can limit the bandwidth and watch how the encoded streams looks.

![Screenshot of Player](/screenshot/eyevinn-player-screenshot1.png?raw=true "Screenshot")

## Prerequisites:

This application is built on NodeJS and Node-webkit and currently tested on Mac OSX.
To be able to run this application you need to have NodeJS installed and the package
manager npm.

 - NodeJS >= 0.10.x
 - Git >= 1.8.3.4

## Installation
 
To download the application you get the source from Github. To check
out the source code run:

    git clone https://github.com/Eyevinn/eyevinn-player.git

Then go the source root directory and install the necessary node modules:

    npm install

Then you can start the player by running the following command:

    npm start
