module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		"bundle": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = global["webpackJsonp"] = global["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./main.ts","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "../$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./app.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(false);
// imports
exports.i(__webpack_require__("../node_modules/css-loader/index.js?!../node_modules/nativescript-theme-core/css/core.light.css"), "");

// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),

/***/ "./app/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/nativescript-angular/router/index.js");
/* harmony import */ var nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _app_routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./app/app.routes.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__["NativeScriptRouterModule"].forRoot(_app_routes__WEBPACK_IMPORTED_MODULE_2__["routes"])],
            exports: [nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__["NativeScriptRouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./app/app.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./app/app.component.html":
/***/ (function(module, exports) {

module.exports = "  <page-router-outlet></page-router-outlet>"

/***/ }),

/***/ "./app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__("./app/app.component.html"),
            styles: [__webpack_require__("./app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nativescript_angular_nativescript_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/nativescript-angular/nativescript.module.js");
/* harmony import */ var nativescript_angular_nativescript_module__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nativescript_angular_nativescript_module__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var nativescript_angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../node_modules/nativescript-angular/forms/index.js");
/* harmony import */ var nativescript_angular_forms__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(nativescript_angular_forms__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/app.component.ts");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./app/home/home.component.ts");
/* harmony import */ var _sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./app/sign-in/sign-in.component.ts");
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../node_modules/kinvey-nativescript-sdk/kinvey-nativescript-sdk.js");
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _shared_header_header_component_tns__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./app/shared/header/header.component.tns.ts");
/* harmony import */ var _shared_menu_menu_component_tns__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./app/shared/menu/menu.component.tns.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7__["Kinvey"].init({
    appKey: 'kid_S1kLDRkz4',
    appSecret: '8e61bc7074b744d7995c2c51042c9890'
});
// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _home_home_component__WEBPACK_IMPORTED_MODULE_5__["HomeComponent"],
                _sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_6__["SignInComponent"],
                _shared_header_header_component_tns__WEBPACK_IMPORTED_MODULE_8__["HeaderComponent"],
                _shared_menu_menu_component_tns__WEBPACK_IMPORTED_MODULE_9__["MenuComponent"],
            ],
            imports: [
                nativescript_angular_nativescript_module__WEBPACK_IMPORTED_MODULE_1__["NativeScriptModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
                nativescript_angular_forms__WEBPACK_IMPORTED_MODULE_2__["NativeScriptFormsModule"],
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]],
            schemas: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NO_ERRORS_SCHEMA"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./app/app.routes.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./app/home/home.component.ts");
/* harmony import */ var _sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./app/sign-in/sign-in.component.ts");


var routes = [
    {
        path: '',
        redirectTo: '/sign-in',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: _home_home_component__WEBPACK_IMPORTED_MODULE_0__["HomeComponent"],
    },
    {
        path: 'sign-in',
        component: _sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_1__["SignInComponent"],
    },
];


/***/ }),

/***/ "./app/home/home.component.css":
/***/ (function(module, exports) {

module.exports = "/* Add mobile styles for the component here.  */\n.btn-img{\n    border-radius: 5;\n    border-width: 1;\n    margin: 10;\n    color: black;\n    border-color: #A8F259;\n    background-color: #82CC33;\n    text-align: center;\n}\n\n.flex-btn {\n    align-items: center;\n    justify-content: center;\n}\n\n.logo {\n    border-radius:100%;\n    width:90;\n    height:90;\n    margin: 5;\n}\n\n.page {\n    background-color: #A8F259;\n}"

/***/ }),

/***/ "./app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<GridLayout rows=\"auto, *\" columns=\"*\" class=\"page\">\n    <ns-header></ns-header>\n    <ns-menu></ns-menu>\n    <ScrollView row=\"1\" col=\"0\">\n        <StackLayout>\n            <StackLayout class=\"p-20 btn-img\" (tap)=\"alertPopUp()\">\n                <Image src=\"res://userImg\" stretch=\"aspectFit\" class=\"logo\" (tap)=\"alertPopUp()\"></Image>\n                <Label text=\"{{userWelcomeText}}\" class=\"h2 text-center\" textWrap=\"true\" (tap)=\"alertPopUp()\"></Label>\n            </StackLayout>\n            <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"alertPopUp()\">\n                <Label text=\"{{allocatedSchoolText}}\" class=\"h2 text-center\" textWrap=\"true\" (tap)=\"alertPopUp()\"></Label>\n            </FlexboxLayout>\n            <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"alertPopUp()\">\n                <Label text=\"{{allocatedChildrenText}}\" class=\"h2 text-center\" textWrap=\"true\" (tap)=\"alertPopUp()\"></Label>\n            </FlexboxLayout>\n            <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"signOut($event)\">\n                <Label text=\"{{signOutText}}\" class=\"h2 text-center\" textWrap=\"true\" (tap)=\"signOut($event)\"></Label>\n            </FlexboxLayout>\n        </StackLayout>\n    </ScrollView>\n</GridLayout>"

/***/ }),

/***/ "./app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/kinvey-nativescript-sdk/kinvey-nativescript-sdk.js");
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomeComponent = /** @class */ (function () {
    function HomeComponent(router) {
        this.router = router;
        this.activeUser = kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.getActiveUser();
        this.user = this.activeUser.username;
        this.userWelcomeText = "Welcome:\n" + this.user;
        this.allocatedSchoolText = "Allocated Schools";
        this.allocatedChildrenText = "Allocated Children";
        this.signOutText = "Sign Out";
    }
    HomeComponent.prototype.signOut = function (args) {
        var _this = this;
        var promise = kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.logout()
            .then(function () {
            _this.router.navigate(["/sign-in"]);
        }).catch(function (error) {
            _this.feedback.error({
                message: "Unfortunately we could not sign out: " + _this.user,
            });
        });
    };
    HomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'ns-home',
            template: __webpack_require__("./app/home/home.component.html"),
            styles: [__webpack_require__("./app/home/home.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./app/shared/header/header.component.css":
/***/ (function(module, exports) {

module.exports = "#actionBar {\n    background-color: #82CC33;\n    /* #A8F259 */\n    /* background-color: #A8F259 */\n}\n.action-image {\n    height: 30;\n    vertical-align: center;\n    horizontal-align: center;\n}"

/***/ }),

/***/ "./app/shared/header/header.component.html":
/***/ (function(module, exports) {

module.exports = "<GridLayout row=\"0\" rows=\"*\" columns=\"90,*,10,30\" id=\"actionBar\" orientation=\"horizontal\" class=\"action-bar p-10\">\n    <Image col=\"0\" height=\"60\" src=\"res://homeLogo\" stretch=\"aspectFit\" (tap)=\"goHome($event)\"></Image>\n    <SearchBar col=\"1\" hint=\"Search Results\" #searchBar (loaded)=\"searchBarLoaded($event)\"></SearchBar>\n    <Image col=\"3\" height=\"30\" src=\"res://menuIcon\" stretch=\"aspectFit\"></Image>\n</GridLayout>"

/***/ }),

/***/ "./app/shared/header/header.component.tns.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/tns-core-modules/ui/page/page.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tns_core_modules_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../node_modules/tns-core-modules/platform/platform.js");
/* harmony import */ var tns_core_modules_platform__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_platform__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(page, router) {
        this.router = router;
        page.actionBarHidden = true;
    }
    HeaderComponent.prototype.searchBarLoaded = function (args) {
        var searchBar = args.object;
        if (tns_core_modules_platform__WEBPACK_IMPORTED_MODULE_2__["isIOS"]) {
            var nativeSearchBar = searchBar.nativeView;
            nativeSearchBar.searchBarStyle = UISearchBarStyle.Prominent;
            nativeSearchBar.backgroundImage = UIImage.new();
        }
    };
    HeaderComponent.prototype.goHome = function (args) {
        if (this.router.url != "/home") {
            this.router.navigate(["/home"]);
        }
        else {
            console.dir(this.router.url);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("searchBar"),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], HeaderComponent.prototype, "searchBar", void 0);
    HeaderComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'ns-header',
            template: __webpack_require__("./app/shared/header/header.component.html"),
            styles: [__webpack_require__("./app/shared/header/header.component.css")]
        }),
        __metadata("design:paramtypes", [tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_1__["Page"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./app/shared/menu/menu.component.css":
/***/ (function(module, exports) {

module.exports = "button {\n    font-size: 15;\n    horizontal-align: center;\n}\n\n.drawerContentText {\n    font-size: 13;\n    padding: 10;\n}\n\n.drawerContentButton {\n    margin: 10;\n    horizontal-align: left;\n}\n\n.sideStackLayout {\n    background-color: gray;\n}\n\n.sideTitleStackLayout {\n    height: 56;\n    text-align: center;\n    vertical-align: center;\n}\n\n.sideLabel {\n    padding: 10;\n}\n\n.sideLightGrayLabel {\n    background-color: lightgray;\n}"

/***/ }),

/***/ "./app/shared/menu/menu.component.html":
/***/ (function(module, exports) {

module.exports = "<RadSideDrawer tkExampleTitle tkToggleNavButton>\n    <StackLayout tkDrawerContent class=\"sideStackLayout\">\n        <StackLayout class=\"sideTitleStackLayout\">\n            <Label text=\"Navigation Menu\"></Label>\n        </StackLayout>\n        <ScrollView>\n            <StackLayout class=\"sideStackLayout\">\n                <Label text=\"Primary\" class=\"sideLabel sideLightGrayLabel\"></Label>\n                <Label text=\"Social\" class=\"sideLabel\"></Label>\n                <Label text=\"Promotions\" class=\"sideLabel\"></Label>\n                <Label text=\"Labels\" class=\"sideLabel sideLightGrayLabel\"></Label>\n                <Label text=\"Important\" class=\"sideLabel\"></Label>\n                <Label text=\"Starred\" class=\"sideLabel\"></Label>\n                <Label text=\"Sent Mail\" class=\"sideLabel\"></Label>\n                <Label text=\"Drafts\" class=\"sideLabel\"></Label>\n                <Label text=\"Close Drawer\" color=\"lightgray\" padding=\"10\" style=\"horizontal-align: center\" (tap)=\"onCloseDrawerTap()\"></Label>\n            </StackLayout>\n        </ScrollView>\n    </StackLayout>\n</RadSideDrawer>"

/***/ }),

/***/ "./app/shared/menu/menu.component.tns.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuComponent", function() { return MenuComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nativescript_ui_sidedrawer_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/nativescript-ui-sidedrawer/angular/side-drawer-directives.js");
/* harmony import */ var nativescript_ui_sidedrawer_angular__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nativescript_ui_sidedrawer_angular__WEBPACK_IMPORTED_MODULE_1__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MenuComponent = /** @class */ (function () {
    function MenuComponent(_changeDetectionRef) {
        this._changeDetectionRef = _changeDetectionRef;
    }
    MenuComponent.prototype.ngAfterViewInit = function () {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    };
    MenuComponent.prototype.ngOnInit = function () {
        this.mainContentText = "SideDrawer for NativeScript can be easily setup in the HTML definition of your page by defining tkDrawerContent and tkMainContent. The component has a default transition and position and also exposes notifications related to changes in its state. Swipe from left to open side drawer.";
    };
    Object.defineProperty(MenuComponent.prototype, "mainContentText", {
        get: function () {
            return this._mainContentText;
        },
        set: function (value) {
            this._mainContentText = value;
        },
        enumerable: true,
        configurable: true
    });
    MenuComponent.prototype.openDrawer = function () {
        this.drawer.showDrawer();
    };
    MenuComponent.prototype.onCloseDrawerTap = function () {
        this.drawer.closeDrawer();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(nativescript_ui_sidedrawer_angular__WEBPACK_IMPORTED_MODULE_1__["RadSideDrawerComponent"]),
        __metadata("design:type", nativescript_ui_sidedrawer_angular__WEBPACK_IMPORTED_MODULE_1__["RadSideDrawerComponent"])
    ], MenuComponent.prototype, "drawerComponent", void 0);
    MenuComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'ns-menu',
            template: __webpack_require__("./app/shared/menu/menu.component.html"),
            styles: [__webpack_require__("./app/shared/menu/menu.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]])
    ], MenuComponent);
    return MenuComponent;
}());



/***/ }),

/***/ "./app/shared/user/user.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());



/***/ }),

/***/ "./app/shared/user/user.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/kinvey-nativescript-sdk/kinvey-nativescript-sdk.js");
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.prototype.register = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.logout()
                .then(function () {
                kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.signup({ username: user.username, password: user.password })
                    .then(resolve)
                    .catch(function (error) { _this.handleErrors(error); reject(); });
            })
                .catch(function (error) { _this.handleErrors(error); reject(); });
        });
    };
    UserService.prototype.login = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.logout()
                .then(function () {
                kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.login(user.username, user.password)
                    .then(resolve)
                    .catch(function (error) { _this.handleErrors(error); reject(); });
            })
                .catch(function (error) { _this.handleErrors(error); reject(); });
        });
    };
    UserService.prototype.handleErrors = function (error) {
        console.error(error.message);
        return error.message;
    };
    UserService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "./app/sign-in/sign-in.component.css":
/***/ (function(module, exports) {

module.exports = "/* Add mobile styles for the component here.  */\n\n:disabled {\n  opacity: 0.5;\n}\n\n:disabled> :disabled {\n  opacity: 1;\n}\n\nFlexboxLayout {\n  justify-content: center;\n  align-items: center;\n  background-size: cover;\n  background-color: #82CC33;\n}\n\nGridLayout {\n  width: 300;\n  padding: 10 16;\n}\n\nButton, TextField {\n  margin: 10 0;\n}\n\n.btn-primary {\n  margin-left: 0;\n  margin-right: 0;\n}\n\nTextField {\n  placeholder-color: #C4AFB4;\n  color: black;\n}\n\n.input, .btn-primary {\n  background-color: white;\n  color: black;\n}\n\n.web-form {\n  display: flex;\n  align-items: center;\n  height: 100vh;\n  margin: auto;\n  width: auto;\n  max-width: 90%;\n}\n\n.web-form-contents {\n  width: fit-content;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  margin: auto;\n}"

/***/ }),

/***/ "./app/sign-in/sign-in.component.html":
/***/ (function(module, exports) {

module.exports = "<FlexboxLayout>\n    <GridLayout [isEnabled]=\"!processing\" rows=\"auto,auto,auto,auto,auto\" columns=\"*\" width=\"90%\" class=\"form\">\n        <Image [isEnabled]=\"!processing\" row=\"0\" src=\"res://homeLogo\" stretch=\"aspectFit\"></Image>\n        <TextField row=\"1\" [isEnabled]=\"!processing\" returnKeyType=\"next\" id=\"username\" hint=\"Username\" class=\"input input-rounded input-border\" [(ngModel)]=\"user.username\" autocorrect=\"false\" autocapitalizationType=\"none\" (returnPress)=\"switchToPass($event)\"></TextField>\n        <TextField row=\"2\" [isEnabled]=\"!processing\" #password hint=\"Password\" secure=\"true\" class=\"input input-rounded input-border\" [(ngModel)]=\"user.password\" autocorrect=\"false\" autocapitalizationType=\"none\" (returnPress)=\"submit($event)\" returnKeyType=\"done\"></TextField>\n        <Button row=\"3\" [isEnabled]=\"!processing\" [text]=\"isLoggingIn ? 'Sign In' : 'Sign Up'\" (tap)=\"submit($event)\" class=\"btn btn-primary btn-rounded-lg btn-active\" clearHistory=\"true\"></Button>\n        <Button row=\"4\" [isEnabled]=\"!processing\" (tap)=\"touchID()\" [text]=\"bioType\" [visibility]=\"bioOn\"></Button>\n        <ActivityIndicator rowSpan=\"5\" [busy]=\"processing\"></ActivityIndicator>\n    </GridLayout>\n</FlexboxLayout>"

/***/ }),

/***/ "./app/sign-in/sign-in.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignInComponent", function() { return SignInComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var tns_core_modules_ui_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../node_modules/tns-core-modules/ui/page/page.js");
/* harmony import */ var tns_core_modules_ui_page__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_ui_page__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shared_user_user_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./app/shared/user/user.model.ts");
/* harmony import */ var _shared_user_user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/shared/user/user.service.ts");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../node_modules/nativescript-feedback/feedback.js");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(nativescript_feedback__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../node_modules/kinvey-nativescript-sdk/kinvey-nativescript-sdk.js");
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var nativescript_fingerprint_auth__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../node_modules/nativescript-fingerprint-auth/fingerprint-auth.js");
/* harmony import */ var nativescript_fingerprint_auth__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(nativescript_fingerprint_auth__WEBPACK_IMPORTED_MODULE_7__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var SignInComponent = /** @class */ (function () {
    function SignInComponent(user, router, userService, page) {
        var _this = this;
        this.user = user;
        this.router = router;
        this.userService = userService;
        this.page = page;
        this.isLoggingIn = true;
        this.processing = false;
        this.bioType = null;
        this.bioOn = "hidden";
        this.page.actionBarHidden = true;
        this.user = new _shared_user_user_model__WEBPACK_IMPORTED_MODULE_3__["User"]();
        this.feedback = new nativescript_feedback__WEBPACK_IMPORTED_MODULE_5__["Feedback"]();
        this.fingerprintAuth = new nativescript_fingerprint_auth__WEBPACK_IMPORTED_MODULE_7__["FingerprintAuth"]();
        this.fingerprintAuth.available().then(function (result) {
            _this.bioValues = result;
        });
    }
    ;
    SignInComponent.prototype.ngOnInit = function () {
        if (this.bioValues.face) {
            this.bioType = "Use Face ID";
        }
        else if (this.bioValues.touch) {
            this.bioType = "Use Touch ID";
        }
        if (kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_6__["Kinvey"].User.getActiveUser()) {
            console.log("Auto Sign In");
            kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_6__["Kinvey"].User.getActiveUser().me();
            this.user.username = kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_6__["Kinvey"].User.getActiveUser().username;
            this.bioOn = "visible";
        }
        ;
    };
    ;
    SignInComponent.prototype.login = function () {
        var _this = this;
        this.userService.login(this.user)
            .then(function () {
            _this.processing = false;
            _this.router.navigate(["/home"]);
        })
            .catch(function () {
            _this.processing = false;
            _this.feedback.error({
                message: "Unfortunately we could not find your account: " + _this.user.username
            });
        });
    };
    SignInComponent.prototype.submit = function (args) {
        this.processing = true;
        if (!this.user.username && this.user.password) {
            this.feedback.error({
                message: "Please Provide Username"
            });
            this.processing = false;
        }
        else if (this.user.username && !this.user.password) {
            this.feedback.error({
                message: "Please Provide Password"
            });
            this.processing = false;
        }
        else if (!this.user.username && !this.user.password) {
            this.feedback.error({
                message: "Please Provide Both a Username and a Password"
            });
            this.processing = false;
        }
        else {
            this.login();
        }
    };
    SignInComponent.prototype.switchToPass = function (args) {
        this.password.nativeElement.focus();
    };
    SignInComponent.prototype.touchID = function () {
        var _this = this;
        this.fingerprintAuth.verifyFingerprint({
            title: 'Authenticate',
            message: "Sign Into User '" + this.user.username + "'",
            authenticationValidityDuration: 10,
            useCustomAndroidUI: false // set to true to use a different authentication screen (see below)
        })
            .then(function () {
            _this.router.navigate(["/home"]);
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("password"),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], SignInComponent.prototype, "password", void 0);
    SignInComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-sign-in',
            template: __webpack_require__("./app/sign-in/sign-in.component.html"),
            providers: [_shared_user_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"], _shared_user_user_model__WEBPACK_IMPORTED_MODULE_3__["User"]],
            styles: [__webpack_require__("./app/sign-in/sign-in.component.css")]
        }),
        __metadata("design:paramtypes", [_shared_user_user_model__WEBPACK_IMPORTED_MODULE_3__["User"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _shared_user_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"],
            tns_core_modules_ui_page__WEBPACK_IMPORTED_MODULE_2__["Page"]])
    ], SignInComponent);
    return SignInComponent;
}());



/***/ }),

/***/ "./main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var nativescript_angular_platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/nativescript-angular/platform.js");
/* harmony import */ var nativescript_angular_platform__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nativescript_angular_platform__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./app/app.module.ts");

            __webpack_require__("../node_modules/nativescript-dev-webpack/load-application-css-angular.js")();
            
        __webpack_require__("../node_modules/tns-core-modules/bundle-entry-points.js");
        // this import should be first in order to load some required settings (like globals and reflect-metadata)


// A traditional NativeScript application starts by initializing global objects, setting up global CSS rules, creating, and navigating to the main page. 
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers. 
// A NativeScript Angular app needs to make both paradigms work together, so we provide a wrapper platform object, platformNativeScriptDynamic, 
// that sets up a NativeScript application and can bootstrap the Angular framework.
Object(nativescript_angular_platform__WEBPACK_IMPORTED_MODULE_0__["platformNativeScriptDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_1__["AppModule"]);

    
        

/***/ }),

/***/ "./package.json":
/***/ (function(module) {

module.exports = {"android":{"v8Flags":"--expose_gc"},"main":"main.js","name":"migration-ng","version":"4.1.0"};

/***/ }),

/***/ "nativescript-sqlite-commercial":
/***/ (function(module, exports) {

module.exports = require("nativescript-sqlite-commercial");

/***/ }),

/***/ "nativescript-sqlite-encrypted":
/***/ (function(module, exports) {

module.exports = require("nativescript-sqlite-encrypted");

/***/ })

/******/ });