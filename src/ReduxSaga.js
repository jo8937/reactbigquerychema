import React, { Component } from "react";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import CustomUtils from "./custom-utils";
import API from "./API";
import fetch from "./cross-fetch-with-timeout";
import { fork, call, put, takeLatest, take } from "redux-saga/effects";

import createSagaMiddleware from "redux-saga";
import * as effects from "redux-saga/effects";
import "babel-polyfill";
import createCombineLatest from "redux-saga-combine-latest";

const combineLatest = createCombineLatest(effects);

function* fetchSaga(actions, actionName, options) {
	const actionType = actionName ? actionName : actions.type;
	const URI = API[actionName+"_URI"];

    try {
		if(!URI){
			throw new Error(`[${actionName}] Not exists in request URI`);
		}
        //const user = yield call(Api.fetchUser, action.payload.userId);
        yield put({ type: actionType + "_PENDING" });
        let res = yield call(fetch, URI, options);
        yield put({
            type: actionType + "_FULFILLED",
            req: actions,
            res
        });
        return res;
    } catch (e) {
        // Bad response from server : 405
        if (e.message.match(/Network request failed/g)) {
            yield put({
                type: "ALERT_MESSAGE",
                msgIdTitle: "label.need_login",
                message: e.message
            });
        } else {
            yield put({ type: actionType + "_REJECTED", message: e.message });
        }
    }
}


/*
  static SCHEMA_URI = APP_URI['BASE_URI'] + "/schema/view/" + APP_URI['BASE_CATEGORY'] + ".json";
  static SOURCE_URI = APP_URI['BASE_URI'] + "/schema/generate_source.json";
  static DATA_URI = APP_URI['BASE_URI'] + "/tabledata/" + APP_URI['BASE_CATEGORY'] + ".json";
  static SCHEMA_EDIT_URI = APP_URI['BASE_URI'] + "/schema/schema_edit_proc";
  static FIELD_ACTIVE_URI = APP_URI['BASE_URI'] + "/field/active";
  static FIELD_EDIT_URI = APP_URI['BASE_URI'] + "/schema/field_edit_proc";
  static FIELD_ADD_URI = APP_URI['BASE_URI'] + "/schema/field_add_proc";
*/
class Sagas{

    static *fetch_datalist_with_schema(actions) {
        let res = yield call(fetchSaga, actions, "DATALIST",  {
            body: JSON.stringify({
                category: actions[0].res.schema.category,
                ...actions[1]
            })
        });
    }

    static *fetch_source_with_schema(actions) {
        let res = yield call(fetchSaga, actions, "SOURCE",  {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            body: CustomUtils.formData({
                category: actions[0].res.schema.category,
                lang: actions[1].lang
            })
        });
    }

    static *fetch_schema(action){
        let res = yield call(fetchSaga, action, "SCHEMA", {
            method: "GET"
        });
    }

    static *fetch_schema_edit(action) {
        let res = yield call(fetchSaga, action, "SCHEMA_EDIT", {
            body: JSON.stringify( action.payload)
        });
    }
    
    static *fetch_field_add(action) {
        let res = yield call(fetchSaga, action, "FIELD_ADD", {
            body: JSON.stringify( action.payload)
        });
    }
    
    static *fetch_field_edit(action) {
        let res = yield call(fetchSaga, action, "FIELD_EDIT",{
            body: JSON.stringify( action.payload)
        });
    }
    
}

function* fetch_command(action){
    let surfix = action.type.toLowerCase().replace(/request_(.+)/, "$1");
    let generator =  Sagas["fetch_"+surfix];
    if (generator){
        yield call(generator, action);
    }else{
        console.log("Generater not found in Sagas[fetch_"+surfix+"]");
    }
}

export default function* rootSaga() {
    yield [
		fork(function*(){
			yield takeLatest(action => action.type.match(/^REQUEST_/), fetch_command);
		}),
		fork(function*(){
			yield combineLatest(["SCHEMA_FULFILLED", "REQUEST_SOURCE"], Sagas.fetch_source_with_schema);
        }),
		fork(function*(){
			yield combineLatest(["SCHEMA_FULFILLED", "REQUEST_DATALIST"], Sagas.fetch_datalist_with_schema);
		})        
	];
}
