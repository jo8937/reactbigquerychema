import React, { Component } from 'react';
import {  combineReducers, createStore, applyMiddleware, compose } from 'redux'
import {  loadingBarMiddleware, loadingBarReducer } from 'react-redux-loading-bar'
import logger from 'redux-logger'
import { Provider, intlReducer } from 'react-intl-redux'

const debuggerReducer = (state = {}, action) => {
	//console.log(action);
	return state;
};

const schemaReducer = (state = { schema: null, fields: null } , action) => {
	console.log(action.payload);
    switch(action.type){
		case 'SCHEMA_FULFILLED':
			var newState = Object.assign({}, state, {
				schema: action.schema,
				fields: action.fields
			});
			return newState;
		case 'SOURCE_FULFILLED':
			var newState = Object.assign({}, state, {
				source: action.source
			});
			return newState;			
		case 'SCHEMA_UPDATE_FULFILLED':
            return Object.assign({}, state, {});
		default:
            return state;
    }
}

const alsertMessageReducer = (state = {
											msgIdTitle: "info",
											msgIdMessage: "desc",
											message: "...",
											msgIdOk: "ok",
											theme: "warning",
											onOk: null,
											open: false
										}, action) => {
	switch(action.type){
		case 'TOGGLE_ALERT':
			return Object.assign({}, state, action);
		case 'ALERT_MESSAGE':
			return Object.assign({}, state, action, {open:true});
		default:
            return state;
    }
};

const rootReducer = combineReducers({
	loadingBar: loadingBarReducer,
	debugger: debuggerReducer,
	schemaVo : schemaReducer,
	intl: intlReducer,
	alertmessage: alsertMessageReducer
})

export default rootReducer