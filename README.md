# paintSplat-Real

Steps to run
1. Clone the repo
2. Run npm install to install all the dependencies
3. Make the following change in react-prompt (node-modules/react-prompt/Prompt.js)
    import React, { Component, PropTypes } from 'react';
    to
    import React, { Component } from 'react';
    import PropTypes from 'prop-types'; 
4. Run react-native run-android
