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



let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__["NativeScriptRouterModule"].forRoot(_app_routes__WEBPACK_IMPORTED_MODULE_2__["routes"])],
        exports: [nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__["NativeScriptRouterModule"]]
    })
], AppRoutingModule);



/***/ }),

/***/ "./app/app.component.css":
/***/ (function(module, exports) {

module.exports = "button {\n    font-size: 15;\n    horizontal-align: center;\n}\n\n.drawerContentText {\n    font-size: 13;\n    padding: 10;\n}\n\n.drawerContentButton {\n    margin: 10;\n    horizontal-align: center;\n}\n\n.sideStackLayout {\n    background-color: #A8F259;\n}\n\n.sideLabel {\n    padding: 10;\n    text-align: center;\n}\n\n.footer {\n    border-color: black;\n    border-width: 1 0 0 0;\n    vertical-align: center;\n    width: 100%;\n    justify-content: center;\n    display: flex;\n    align-items: center;\n    box-pack: center;\n    justify-content: center;\n    overflow: hidden;\n    margin: auto;\n    height: 80;\n}\n\n#actionBar {\n    background-color: #82CC33;\n    border-color: black;\n    border-width: 0 0 1 0;\n    /* #A8F259 */\n    /* background-color: #A8F259 */\n}\n\n.action-image {\n    height: 30;\n    vertical-align: center;\n    horizontal-align: center;\n}\n\n.btn-img {\n    border-radius: 5;\n    border-width: 1;\n    margin: 10;\n    color: black;\n    border-color: #A8F259;\n    background-color: #82CC33;\n    text-align: center;\n}\n\n.flex-btn {\n    align-items: center;\n    justify-content: center;\n}"

/***/ }),

/***/ "./app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<StackLayout>\n    <DockLayout #Menu [visibility]=\"isSignIn()\">\n        <GridLayout dock=\"top\" rows=\"auto\" columns=\"*,3*,*\" id=\"actionBar\" class=\"action-bar p-10\">\n            <StackLayout col=\"0\" orientation=\"horizontal\" [visibility]=\"isBackActive()\">\n                <Label text=\"< Back\" (tap)=\"back()\"></Label>\n            </StackLayout>\n            <Image col=\"1\" height=\"60\" src=\"res://homeLogo\" stretch=\"aspectFit\" (tap)=\"navigate('/home')\"></Image>\n            <Image col=\"2\" height=\"30\" src=\"res://menuIcon\" stretch=\"aspectFit\" (tap)=\"toggleDrawer()\"></Image>\n        </GridLayout>\n    </DockLayout>\n    <RadSideDrawer #radSideDrawer tkExampleTitle tkToggleNavButton (loaded)=\"onLoaded()\" drawerLocation=\"Top\"\n        drawerTransition=\"RevealTransition\" drawerContentSize=\"470\">\n        <StackLayout tkDrawerContent class=\"sideStackLayout\">\n            <DockLayout>\n                <FlexboxLayout dock=\"bottom\" class=\"footer\">\n                    <Image src=\"res://close_drawer\" (tap)=\"closeDrawer()\" width=\"64\" height=\"64\"></Image>\n                </FlexboxLayout>\n                <ScrollView>\n                    <StackLayout>\n                        <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"navigate('/supported-children')\">\n                            <Label text=\"Supported Children\" class=\"sideLabel h2 text-center\" textWrap=\"true\"></Label>\n                        </FlexboxLayout>\n                        <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"navigate('/heads-of-family')\">\n                            <Label text=\"Heads of Family\" class=\"sideLabel h2 text-center\" textWrap=\"true\"></Label>\n                        </FlexboxLayout>\n                        <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"navigate('/sponsors')\">\n                            <Label text=\"Sponsors\" class=\"sideLabel h2 text-center\" textWrap=\"true\"></Label>\n                        </FlexboxLayout>\n                        <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"navigate('/schools')\">\n                            <Label text=\"Schools\" class=\"sideLabel h2 text-center\" textWrap=\"true\"></Label>\n                        </FlexboxLayout>\n                        <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"navigate('/parish-workers')\">\n                            <Label text=\"Parish Workers\" class=\"sideLabel h2 text-center\" textWrap=\"true\"></Label>\n                        </FlexboxLayout>\n                        <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"navigate('/assigned-offices')\">\n                            <Label text=\"Assigned Offices\" class=\"sideLabel h2 text-center\" textWrap=\"true\"></Label>\n                        </FlexboxLayout>\n                    </StackLayout>\n                </ScrollView>\n            </DockLayout>\n        </StackLayout>\n        <StackLayout tkMainContent>\n            <page-router-outlet></page-router-outlet>\n        </StackLayout>\n    </RadSideDrawer>\n</StackLayout>"

/***/ }),

/***/ "./app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nativescript_ui_sidedrawer_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/nativescript-ui-sidedrawer/angular/side-drawer-directives.js");
/* harmony import */ var nativescript_ui_sidedrawer_angular__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nativescript_ui_sidedrawer_angular__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../node_modules/tns-core-modules/ui/page/page.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_routes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/app.routes.ts");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../node_modules/nativescript-feedback/feedback.js");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(nativescript_feedback__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../node_modules/@angular/common/fesm5/common.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







let AppComponent = class AppComponent {
    constructor(page, feedback, _changeDetectionRef, router, location) {
        this.page = page;
        this.feedback = feedback;
        this._changeDetectionRef = _changeDetectionRef;
        this.router = router;
        this.location = location;
        this.feedback = new nativescript_feedback__WEBPACK_IMPORTED_MODULE_5__["Feedback"]();
    }
    ngOnInit() {
        this.mainContentText = "SideDrawer for NativeScript can be easily setup in the HTML definition of your page by defining tkDrawerContent and tkMainContent. The component has a default transition and position and also exposes notifications related to changes in its state. Swipe from left to open side drawer.";
    }
    onLoaded() {
        if (tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_2__["isAndroid"]) {
            this.drawer.android.setTouchTargetThreshold(0);
        }
    }
    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
        if (tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_2__["isIOS"]) {
            this.drawer.ios.defaultSideDrawer.allowEdgeSwipe = false;
        }
    }
    get mainContentText() {
        return this._mainContentText;
    }
    set mainContentText(value) {
        this._mainContentText = value;
    }
    toggleDrawer() {
        this.drawer.toggleDrawerState();
    }
    openDrawer() {
        this.drawer.showDrawer();
    }
    closeDrawer() {
        this.drawer.closeDrawer();
    }
    isSignIn() {
        if (this.router.url == "/sign-in") {
            return "collapsed";
        }
        else {
            return "visible";
        }
    }
    isBackActive() {
        if (this.router.url == "/home") {
            return "collapsed";
        }
        else {
            return "visible";
        }
    }
    back() {
        this.closeDrawer();
        this.location.back();
    }
    navigate(destination) {
        destination = destination.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "");
        let current = this.router.url.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "");
        let flag = false;
        for (let curRoute in _app_routes__WEBPACK_IMPORTED_MODULE_4__["routes"]) {
            if (destination == _app_routes__WEBPACK_IMPORTED_MODULE_4__["routes"][curRoute].path) {
                flag = true;
                break;
            }
        }
        if (flag) {
            if (current == destination) {
                this.feedback.info({
                    message: `You're Already At: ${destination}`
                });
            }
            else {
                this.closeDrawer();
                this.router.navigate([destination]);
            }
        }
        else {
            this.feedback.warning({
                message: `The Feature ${destination} Hasn't Been Implemented Yet`
            });
        }
    }
};
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("radSideDrawer"),
    __metadata("design:type", nativescript_ui_sidedrawer_angular__WEBPACK_IMPORTED_MODULE_1__["RadSideDrawerComponent"])
], AppComponent.prototype, "drawerComponent", void 0);
AppComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-root',
        template: __webpack_require__("./app/app.component.html"),
        styles: [__webpack_require__("./app/app.component.css")]
    }),
    __metadata("design:paramtypes", [tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_2__["Page"],
        nativescript_feedback__WEBPACK_IMPORTED_MODULE_5__["Feedback"],
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
        _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
        _angular_common__WEBPACK_IMPORTED_MODULE_6__["Location"]])
], AppComponent);



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
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../node_modules/nativescript-feedback/feedback.js");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(nativescript_feedback__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var nativescript_ui_sidedrawer_angular_side_drawer_directives__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../node_modules/nativescript-ui-sidedrawer/angular/side-drawer-directives.js");
/* harmony import */ var nativescript_ui_sidedrawer_angular_side_drawer_directives__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(nativescript_ui_sidedrawer_angular_side_drawer_directives__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _supported_children_supported_children_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./app/supported-children/supported-children.component.ts");
/* harmony import */ var _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./app/shared/supported-children/supported-children.service.ts");
/* harmony import */ var _supported_child_supported_child_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./app/supported-child/supported-child.component.ts");
/* harmony import */ var _shared_user_user_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./app/shared/user/user.service.ts");
/* harmony import */ var _head_of_family_head_of_family_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./app/head-of-family/head-of-family.component.ts");
/* harmony import */ var _heads_of_family_heads_of_family_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./app/heads-of-family/heads-of-family.component.ts");
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
let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        declarations: [
            _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
            _home_home_component__WEBPACK_IMPORTED_MODULE_5__["HomeComponent"],
            _sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_6__["SignInComponent"],
            _supported_children_supported_children_component__WEBPACK_IMPORTED_MODULE_10__["SupportedChildrenComponent"],
            _supported_child_supported_child_component__WEBPACK_IMPORTED_MODULE_12__["SupportedChildComponent"],
            _head_of_family_head_of_family_component__WEBPACK_IMPORTED_MODULE_14__["HeadOfFamilyComponent"],
            _heads_of_family_heads_of_family_component__WEBPACK_IMPORTED_MODULE_15__["HeadsOfFamilyComponent"]
        ],
        imports: [
            nativescript_angular_nativescript_module__WEBPACK_IMPORTED_MODULE_1__["NativeScriptModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
            nativescript_angular_forms__WEBPACK_IMPORTED_MODULE_2__["NativeScriptFormsModule"],
            nativescript_ui_sidedrawer_angular_side_drawer_directives__WEBPACK_IMPORTED_MODULE_9__["NativeScriptUISideDrawerModule"],
        ],
        providers: [
            nativescript_feedback__WEBPACK_IMPORTED_MODULE_8__["Feedback"],
            _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_11__["SupportedChildrenService"],
            _shared_user_user_service__WEBPACK_IMPORTED_MODULE_13__["UserService"]
        ],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]],
        schemas: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NO_ERRORS_SCHEMA"]]
    })
], AppModule);



/***/ }),

/***/ "./app/app.routes.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./app/home/home.component.ts");
/* harmony import */ var _sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./app/sign-in/sign-in.component.ts");
/* harmony import */ var _supported_children_supported_children_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./app/supported-children/supported-children.component.ts");
/* harmony import */ var _supported_child_supported_child_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./app/supported-child/supported-child.component.ts");
/* harmony import */ var _head_of_family_head_of_family_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/head-of-family/head-of-family.component.ts");
/* harmony import */ var _heads_of_family_heads_of_family_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./app/heads-of-family/heads-of-family.component.ts");






const routes = [
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
    {
        path: 'supported-children',
        component: _supported_children_supported_children_component__WEBPACK_IMPORTED_MODULE_2__["SupportedChildrenComponent"],
    },
    {
        path: 'supported-child/:child',
        component: _supported_child_supported_child_component__WEBPACK_IMPORTED_MODULE_3__["SupportedChildComponent"],
    },
    {
        path: 'heads-of-family',
        component: _heads_of_family_heads_of_family_component__WEBPACK_IMPORTED_MODULE_5__["HeadsOfFamilyComponent"],
    },
    {
        path: 'head-of-family',
        component: _head_of_family_head_of_family_component__WEBPACK_IMPORTED_MODULE_4__["HeadOfFamilyComponent"],
    }
    /*
     {
         path: 'sponsors',
         component: SponsorsComponent,
     }
     */
    /*
     {
         path: 'schools',
         component: SchoolsComponent,
     }
     */
    /*
     {
         path: 'parish-workers',
         component: ParishWorkersComponent,
     }
     */
    /*
     {
         path: 'assigned-offices',
         component: AssignedOfficesComponent,
     }
     */
];


/***/ }),

/***/ "./app/head-of-family/head-of-family.component.css":
/***/ (function(module, exports) {

module.exports = "/* Add mobile styles for the component here.  */\n\n:disabled {\n\topacity: 0.5;\n}\n\n:disabled> :disabled {\n\topacity: 1;\n}\n\nFlexboxLayout {\n\tjustify-content: center;\n\talign-items: center;\n\tbackground-size: cover;\n\tbackground-color: #82CC33;\n}\n\nGridLayout {\n\twidth: 300;\n\tpadding: 10 16;\n}\n\n/* Button, Label {\n\tmargin: 10 0;\n}\n*/\n.btn-primary {\n\tmargin-right: 0;\n\tbackground-color: #82CC33;\n\tcolor: black;\n\t/* \n\theight: fit-content; */\n} \n\nTextField {\n\tplaceholder-color: #C4AFB4;\n\tcolor: black;\n}\n\n/* .input, .btn-primary {\n\tbackground-color: white;\n\tcolor: black;\n} */\n\n.web-form {\n\tdisplay: flex;\n\talign-items: center;\n\theight: 100vh;\n\tmargin: auto;\n\twidth: auto;\n\tmax-width: 100%;\n}\n\n.web-form-contents {\n\twidth: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tmargin: auto;\n}\n\n/* button {\n\tfont-size: 15;\n\thorizontal-align: center;\n} */\n\n.drawerContentText {\n\tfont-size: 13;\n\tpadding: 10;\n}\n\n.drawerContentButton {\n\tmargin: 10;\n\thorizontal-align: center;\n}\n\n.sideStackLayout {\n\tbackground-color: #A8F259;\n}\n\n.sideLabel {\n\tpadding: 10;\n\ttext-align: center;\n}\n\n.footer {\n\tborder-color: black;\n\tborder-width: 1 0 0 0;\n\tvertical-align: center;\n\twidth: 100%;\n\tjustify-content: center;\n\tdisplay: flex;\n\talign-items: center;\n\tbox-pack: center;\n\tjustify-content: center;\n\toverflow: hidden;\n\tmargin: auto;\n\theight: 80;\n}\n\n#actionBar {\n\tbackground-color: #82CC33;\n\tborder-color: black;\n\tborder-width: 0 0 1 0;\n\t/* #A8F259 */\n\t/* background-color: #A8F259 */\n}\n\n.action-image {\n\theight: 30;\n\tvertical-align: center;\n\thorizontal-align: center;\n}\n\n.btn-img {\n\tborder-radius: 5;\n\tborder-width: 1;\n\tmargin: 10;\n\tcolor: black;\n\tborder-color: #A8F259;\n\tbackground-color: #82CC33;\n\ttext-align: center;\n}\n\n.flex-btn {\n\talign-items: center;\n\tjustify-content: center;\n}\n\n/* Add mobile styles for the component here.  */\n.btn-img{\n    border-radius: 5;\n    border-width: 1;\n    margin: 10;\n    color: black;\n    border-color: #A8F259;\n    background-color: #82CC33;\n    text-align: center;\n}\n\n.flex-btn {\n    align-items: center;\n    justify-content: center;\n}\n\n.logo {\n    border-radius:100%;\n    width:45;\n    height:45;\n}\n\n.page {\n    background-color: #A8F259;\n}\n\n.txt-left {\n\ttext-align: left;\n}\n\n.date-picker, .list-picker {\n\tbackground-color: lightgray\n}\n\n.hr-light {\n\tmargin-bottom: 20\n}"

/***/ }),

/***/ "./app/head-of-family/head-of-family.component.html":
/***/ (function(module, exports) {

module.exports = "<ScrollView>\n    <GridLayout rows=\"auto, auto\" columns=\"*\">\n        <GridLayout columns=\"auto, *, auto, auto\" row=\"0\">\n            <Image src=\"res://userImg\" stretch=\"aspectFit\" class=\"logo\" col=\"0\"></Image>\n            <Label text=\"ID: {{target.id}}\" class=\"p-6\" col=\"2\"></Label>\n            <Label text=\"Age: {{target.age}}\" class=\"p-10\" col=\"3\"></Label>\n        </GridLayout>\n        <StackLayout class=\"form\" row=\"1\">\n\n            <Label text=\"Details\" class=\"h1\"></Label>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- First Name -->\n            <StackLayout>\n                <Label text=\"First Name\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"FirstNameLabel\" #labelField [text]=\"target.first_name\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"FirstNameEdit\" #textField [text]=\"target.first_name\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"FirstNameButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('FirstNameLabel','FirstNameEdit','FirstNameButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Family Name -->\n            <StackLayout>\n                <Label text=\"Family Name\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"FamilyNameLabel\" #labelField [text]=\"target.last_name\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"FamilyNameEdit\" #textField [text]=\"target.last_name\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"FamilyNameButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('FamilyNameLabel','FamilyNameEdit','FamilyNameButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Date of Birth -->\n            <StackLayout>\n                <Label text=\"Date of Birth\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"DateOfBirthLabel\" #labelField text=\"{{target.date_of_birth.day}}/{{target.date_of_birth.month}}/{{target.date_of_birth.year}}\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"DateOfBirthButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"datePickerButton('DateOfBirthLabel', 'DateOfBirthPicker', 'DateOfBirthButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <DatePicker id=\"DateOfBirthPicker\" #datePicker [year]=\"target.date_of_birth.year\" [month]=\"target.date_of_birth.month\" [day]=\"target.date_of_birth.day\" visibility=\"collapsed\" class=\"date-picker\"></DatePicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Gender -->\n            <StackLayout>\n                <Label text=\"Gender\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"GenderLabel\" #labelField [text]=\"target.gender\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"GenderButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('GenderLabel', 'GenderPicker', 'GenderButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"GenderPicker\" #listPicker [picked]=\"target.gender\" [items]=\"gender\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- School -->\n            <StackLayout>\n                <Label text=\"School\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"SchoolLabel\" #labelField [text]=\"target.school.school\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"SchoolEdit\" #textField [text]=\"target.school.school\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"SchoolButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('SchoolLabel','SchoolEdit','SchoolButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- School Level -->\n            <StackLayout>\n                <Label text=\"School Level\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"SchoolLevelLabel\" #labelField [text]=\"target.school.level\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"SchoolLevelButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('SchoolLevelLabel', 'SchoolLevelPicker', 'SchoolLevelButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"SchoolLevelPicker\" #listPicker [picked]=\"target.school.level\" [items]=\"school.level\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- School Books -->\n            <StackLayout>\n                <Label text=\"School Books\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"SchoolBooksLabel\" #labelField [text]=\"target.school.books\" class=\"input input-border labelField\" col=\"0\"></Label>\n                    <Button id=\"SchoolBooksButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('SchoolBooksLabel', 'SchoolBooksPicker', 'SchoolBooksButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"SchoolBooksPicker\" #listPicker [picked]=\"target.school.books\" [items]=\"school.books\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Head of Family -->\n            <!-- Need to change to relating to a head of family member -->\n            <StackLayout>\n                <Label text=\"Head of Family\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"HeadOfFamilyLabel\" #labelField [text]=\"target.head_of_family.hof\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"HeadOfFamilyEdit\" #textField [text]=\"target.head_of_family.hof\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"HeadOfFamilyButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('HeadOfFamilyLabel','HeadOfFamilyEdit','HeadOfFamilyButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Relation to Head of Family -->\n            <StackLayout>\n                <Label text=\"Relation to Head of Family\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"HeadOfFamilyRelationLabel\" #labelField [text]=\"target.head_of_family.relation\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"HeadOfFamilyRelationEdit\" #textField [text]=\"target.head_of_family.relation\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"HeadOfFamilyRelationButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('HeadOfFamilyRelationLabel','HeadOfFamilyRelationEdit','HeadOfFamilyRelationButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Personal Status -->\n            <StackLayout>\n                <Label text=\"Personal Status\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"PersonalStatusLabel\" #labelField [text]=\"target.personal_status\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"PersonalStatusButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('PersonalStatusLabel', 'PersonalStatusPicker', 'PersonalStatusButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"PersonalStatusPicker\" #listPicker [picked]=\"target.personal_status\" [items]=\"personal_status\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Future Educational Goals -->\n            <StackLayout>\n                <Label text=\"Future Educational Goals\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"EducationalGoalsLabel\" #labelField [text]=\"target.future_educational_goals\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextView id=\"EducationalGoalsEdit\" #textField [text]=\"target.future_educational_goals\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextView>\n                    <Button id=\"EducationalGoalsButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('EducationalGoalsLabel','EducationalGoalsEdit','EducationalGoalsButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Hygiene Kits -->\n            <StackLayout>\n                <Label text=\"Hygiene Kits\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"HygieneKitsLabel\" #labelField [text]=\"target.hygiene_kits\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"HygieneKitsButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('HygieneKitsLabel', 'HygieneKitsPicker', 'HygieneKitsButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"HygieneKitsPicker\" #listPicker [picked]=\"target.personal_status\" [items]=\"personal_status\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Medical Support -->\n            <StackLayout>\n                <Label text=\"Medical Support\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"MedicalSupportLabel\" #labelField [text]=\"target.medical_support\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"MedicalSupportButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('MedicalSupportLabel', 'MedicalSupportPicker', 'MedicalSupportButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"MedicalSupportPicker\" #listPicker [picked]=\"target.medical_support\" [items]=\"medical_support\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Transport to Clinic -->\n            <StackLayout>\n                <Label text=\"Transport To Clinic\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"TransportToClinicLabel\" #labelField [text]=\"target.transport_to_clinic\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"TransportToClinicButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('TransportToClinicLabel', 'TransportToClinicPicker', 'TransportToClinicButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"TransportToClinicPicker\" #listPicker [picked]=\"target.transport_to_clinic\" [items]=\"transport_to_clinic\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n        </StackLayout>\n    </GridLayout>\n</ScrollView>"

/***/ }),

/***/ "./app/head-of-family/head-of-family.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeadOfFamilyComponent", function() { return HeadOfFamilyComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./app/shared/supported-children/supported-children.service.ts");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../node_modules/tns-core-modules/ui/page/page.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shared_text__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/shared/text.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var view = __webpack_require__("../node_modules/tns-core-modules/ui/core/view/view.js");
let HeadOfFamilyComponent = class HeadOfFamilyComponent {
    constructor(route, page, renderer) {
        this.route = route;
        this.page = page;
        this.renderer = renderer;
        this.supportedChildren = new _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_2__["SupportedChildrenService"]().defaultSupportedChildren;
        this.dataAvailable = false;
        this.Text = _shared_text__WEBPACK_IMPORTED_MODULE_4__["Text"];
        this.gender = ["Male", "Female", "Other"];
        this.school = {
            level: ["education high"],
            books: ["Yes", "No"]
        };
        this.personal_status = ["Single"];
        this.hygiene_kits = ["Yes", "No"];
        this.medical_support = ["Yes", "No"];
        this.transport_to_clinic = ["Yes", "No"];
        this.page.actionBarHidden = true;
        this.textFieldButtonStatus = false;
        this.listPickerButtonStatus = false;
        this.datePickerButtonStatus = false;
    }
    ngOnInit() {
        this.targetId = this.route.snapshot.params['child'];
        for (let i of this.supportedChildren) {
            if (i.id == this.targetId) {
                this.target = i;
            }
        }
    }
    ngAfterViewInit() {
        /*console.log("datePickers")
        console.log(this.datePickers.toArray())
        console.log("listPickers")
        console.log(this.listPickers.toArray())
        console.log("textFieldLabels")
        console.log(this.textFieldLabels.toArray())
        console.log("textFieldTextFields")
        console.log(this.textFieldTextFields.toArray())
        console.log("editButtons")
        console.log(this.editButtons.toArray())*/
    }
    listPickerButton(labelID, pickerID, buttonID, status = this.listPickerButtonStatus) {
        console.log(view.getViewByID(labelID).visibility);
        view.getViewByID(labelID).visibility = "collapse";
        console.log(view.getViewByID(labelID).visibility);
        console.log(view.getViewByID(pickerID).visibility);
        view.getViewByID(pickerID).visibility = "visible";
        console.log(view.getViewByID(pickerID).visibility);
        console.log(view.getViewByID(buttonID).text);
        view.getViewByID(buttonID).text = this.Text.genericDoneButton;
        console.log(view.getViewByID(buttonID).text);
        /*//if (status) { // If Editing Is Active
        this.textFieldLabels.forEach((i) => {
            if (i.nativeElement.id == labelID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "visible"
                console.log(i.nativeElement.visibility)
            }
        })
        this.listPickers.forEach((i) => {
            if (i.nativeElement.id == pickerID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "collapse"
                console.log(i.nativeElement.visibility)
            }
        })
        //console.log(buttonID)
        this.editButtons.forEach((i) => {
            if (i.nativeElement.id == buttonID) {
                console.log(i.nativeElement.text)
                this.renderer.setProperty(i.nativeElement.text, "text", this.Text.genericEditButton)
                console.log(i.nativeElement.text)
            }
        })*/
    } /*else { // If Editing Isn't Active
            console.dir(this.textFieldLabels.toArray())
            this.textFieldLabels.forEach((i) => {
                if (i.nativeElement.id == labelID) {
                    i.nativeElement.visibility = "collapse"
                }
            })
            console.dir(this.listPickers.toArray())
            this.listPickers.forEach((i) => {
                if (i.nativeElement.id == pickerID) {
                    i.nativeElement.visibility = "visible"
                }
            })
            console.dir(this.editButtons.toArray())
            this.editButtons.forEach((i) => {
                if (i.nativeElement.id == buttonID) {
                    i.nativeElement.Text = this.Text.genericDoneButton
                }
            })
            this.listPickerButtonStatus = false
        }
    }*/
    datePickerButton(labelID, pickerID, buttonID, status = this.datePickerButtonStatus) {
        console.log(view.getViewByID(labelID).visibility);
        view.getViewByID(labelID).visibility = "collapse";
        console.log(view.getViewByID(labelID).visibility);
        console.log(view.getViewByID(pickerID).visibility);
        view.getViewByID(pickerID).visibility = "visible";
        console.log(view.getViewByID(pickerID).visibility);
        console.log(view.getViewByID(buttonID).text);
        view.getViewByID(buttonID).text = this.Text.genericDoneButton;
        console.log(view.getViewByID(buttonID).text);
        //if (status) { // If Editing Is Active
        /*this.textFieldLabels.forEach((i) => {
            if (i.nativeElement.id == labelID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "visible"
                console.log(i.nativeElement.visibility)
                //console.log(i.nativeElement.text)
            }
        })
        this.datePickers.forEach((i) => {
            if (i.nativeElement.id == pickerID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "collapse"
                console.log(i.nativeElement.visibility)
            }
        })
        this.editButtons.forEach((i) => {
            if (i.nativeElement.id == buttonID) {
                console.log(i.nativeElement.text)
                this.renderer.setProperty(i.nativeElement.text, "text", this.Text.genericEditButton)
                console.log(i.nativeElement.text)
                //console.log(i.nativeElement.text)
            }
        })*/
    } /*else { // If Editing Isn't Active
            console.dir(this.textFieldLabels.toArray())
            this.textFieldLabels.forEach((i) => {
                if (i.nativeElement.id == labelID) {
                    i.nativeElement.visibility = "collapse"
                }
            })
            console.dir(this.datePickers.toArray())
            this.datePickers.forEach((i) => {
                if (i.nativeElement.id == pickerID) {
                    i.nativeElement.visibility = "visible"
                }
            })
            console.dir(this.editButtons.toArray())
            this.editButtons.forEach((i) => {
                if (i.nativeElement.id == buttonID) {
                    i.nativeElement.Text = this.Text.genericDoneButton
                }
            })
            this.datePickerButtonStatus = false
        }
    }*/
    textFieldButton(labelID, editID, buttonID, status = this.textFieldButtonStatus) {
        console.log(view.getViewByID(labelID).visibility);
        view.getViewByID(labelID).visibility = "collapse";
        console.log(view.getViewByID(labelID).visibility);
        console.log(view.getViewByID(editID).visibility);
        view.getViewByID(editID).visibility = "visible";
        console.log(view.getViewByID(editID).visibility);
        console.log(view.getViewByID(buttonID).text);
        view.getViewByID(buttonID).text = this.Text.genericDoneButton;
        console.log(view.getViewByID(buttonID).text);
        /*//if (status) { // If Editing Is Active
        this.textFieldLabels.forEach((i) => {
            if (i.nativeElement.id == labelID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "collapse"
                console.log(i.nativeElement.visibility)
                //console.log(i.nativeElement.text)
            }
        })
        this.textFieldTextFields.forEach((i) => {
            if (i.nativeElement.id == editID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "visible"
                console.log(i.nativeElement.visibility)
                //console.log(i.nativeElement.text)
            }
        })
        this.editButtons.forEach((i) => {
            if (i.nativeElement.id == buttonID) {
                console.log(i.nativeElement.text)
                this.renderer.setProperty(i.nativeElement.text, "innerHTML", this.Text.genericEditButton)
                console.log(i.nativeElement.text)
            }
        })*/
    } /*else { // If Editing Isn't Active
            console.dir(this.textFieldLabels.toArray())
            this.textFieldLabels.forEach((i) => {
                if (i.nativeElement.id == labelID) {
                    i.nativeElement.visibility = "collapse"
                }
            })
            console.dir(this.textFieldTextFields.toArray())
            this.textFieldTextFields.forEach((i) => {
                if (i.nativeElement.id == editID) {
                    i.nativeElement.visibility = "visible"
                }
            })
            console.dir(this.editButtons.toArray())
            this.editButtons.forEach((i) => {
                if (i.nativeElement.id == buttonID) {
                    i.nativeElement.Text = this.Text.genericDoneButton
                }
            })
            this.textFieldButtonStatus = false
        }
    }*/
};
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('datePicker'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], HeadOfFamilyComponent.prototype, "datePickers", void 0);
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('listPicker'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], HeadOfFamilyComponent.prototype, "listPickers", void 0);
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('labelField'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], HeadOfFamilyComponent.prototype, "textFieldLabels", void 0);
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('textField'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], HeadOfFamilyComponent.prototype, "textFieldTextFields", void 0);
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('editButton'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], HeadOfFamilyComponent.prototype, "editButtons", void 0);
HeadOfFamilyComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-head-of-family',
        template: __webpack_require__("./app/head-of-family/head-of-family.component.html"),
        styles: [__webpack_require__("./app/head-of-family/head-of-family.component.css")]
    }),
    __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
        tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__["Page"],
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]])
], HeadOfFamilyComponent);



/***/ }),

/***/ "./app/heads-of-family/heads-of-family.component.css":
/***/ (function(module, exports) {

module.exports = "/* Add mobile styles for the component here.  */\n\n:disabled {\n\topacity: 0.5;\n}\n\n:disabled> :disabled {\n\topacity: 1;\n}\n\nFlexboxLayout {\n\tjustify-content: center;\n\talign-items: center;\n\tbackground-size: cover;\n\tbackground-color: #82CC33;\n}\n\nGridLayout {\n\twidth: 300;\n\tpadding: 10 16;\n}\n\nButton, TextField {\n\tmargin: 10 0;\n}\n\n.btn-primary {\n\tmargin-left: 0;\n\tmargin-right: 0;\n}\n\nTextField {\n\tplaceholder-color: #C4AFB4;\n\tcolor: black;\n}\n\n.input, .btn-primary {\n\tbackground-color: white;\n\tcolor: black;\n}\n\n.web-form {\n\tdisplay: flex;\n\talign-items: center;\n\theight: 100vh;\n\tmargin: auto;\n\twidth: auto;\n\tmax-width: 90%;\n}\n\n.web-form-contents {\n\twidth: fit-content;\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tmargin: auto;\n}\n\nbutton {\n\tfont-size: 15;\n\thorizontal-align: center;\n}\n\n.drawerContentText {\n\tfont-size: 13;\n\tpadding: 10;\n}\n\n.drawerContentButton {\n\tmargin: 10;\n\thorizontal-align: center;\n}\n\n.sideStackLayout {\n\tbackground-color: #A8F259;\n}\n\n.sideLabel {\n\tpadding: 10;\n\ttext-align: center;\n}\n\n.footer {\n\tborder-color: black;\n\tborder-width: 1 0 0 0;\n\tvertical-align: center;\n\twidth: 100%;\n\tjustify-content: center;\n\tdisplay: flex;\n\talign-items: center;\n\tbox-pack: center;\n\tjustify-content: center;\n\toverflow: hidden;\n\tmargin: auto;\n\theight: 80;\n}\n\n#actionBar {\n\tbackground-color: #82CC33;\n\tborder-color: black;\n\tborder-width: 0 0 1 0;\n\t/* #A8F259 */\n\t/* background-color: #A8F259 */\n}\n\n.action-image {\n\theight: 30;\n\tvertical-align: center;\n\thorizontal-align: center;\n}\n\n.btn-img {\n\tborder-radius: 5;\n\tborder-width: 1;\n\tmargin: 10;\n\tcolor: black;\n\tborder-color: #A8F259;\n\tbackground-color: #82CC33;\n\ttext-align: center;\n}\n\n.flex-btn {\n\talign-items: center;\n\tjustify-content: center;\n}\n\n/* Add mobile styles for the component here.  */\n.btn-img{\n    border-radius: 5;\n    border-width: 1;\n    margin: 10;\n    color: black;\n    border-color: #A8F259;\n    background-color: #82CC33;\n    text-align: center;\n}\n\n.flex-btn {\n    align-items: center;\n    justify-content: center;\n}\n\n.logo {\n    border-radius:100%;\n    width:45;\n    height:45;\n}\n\n.page {\n    background-color: #A8F259;\n}\n\n.txt-left {\n\ttext-align: left;\n}"

/***/ }),

/***/ "./app/heads-of-family/heads-of-family.component.html":
/***/ (function(module, exports) {

module.exports = "<ScrollView class=\"page\">\n    <StackLayout>\n        <FlexboxLayout class=\"p-20 btn-img flex-btn\">\n            <Label text=\"Heads of Family\" class=\"h2 text-center\" textWrap=\"true\"></Label>\n            <!-- <SearchBar></SearchBar> -->\n        </FlexboxLayout>\n\n        <GridLayout *ngFor=\"let i of supportedChildren\" rows=\"*,2*,*\" columns=\"*,auto,auto,auto,*\" class=\"p-20 btn-img flex-btn\">\n            <Label row=\"0\" col=\"4\" [text]=\"i.id\" class=\"p-6\"></Label>\n            <Image row=\"1\" col=\"0\" src=\"res://userImg\" stretch=\"aspectFit\" class=\"logo\"></Image>\n            <Image row=\"1\" col=\"4\" src=\"res://rightArrow\" (tap)=\"viewChild(i.id)\"></Image>\n            <Label row=\"1\" col=\"1\" colSpan=\"2\" text=\"{{i.first_name}} {{i.last_name}}\" class=\"p-10\"></Label>\n            <Label row=\"1\" col=\"3\" text=\"|  {{ i.age}}\" class=\"p-10\"></Label>\n            <Label row=\"2\" col=\"1\" colSpan=\"2\" [text]=\"i.school.school\" class=\"p-10\"></Label>\n        </GridLayout>\n    </StackLayout>\n</ScrollView>"

/***/ }),

/***/ "./app/heads-of-family/heads-of-family.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeadsOfFamilyComponent", function() { return HeadsOfFamilyComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/nativescript-feedback/feedback.js");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nativescript_feedback__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../node_modules/tns-core-modules/ui/page/page.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/shared/supported-children/supported-children.service.ts");
/* harmony import */ var _shared_text__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./app/shared/text.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let HeadsOfFamilyComponent = class HeadsOfFamilyComponent {
    constructor(page, router, feedback) {
        this.page = page;
        this.router = router;
        this.feedback = feedback;
        this.supportedChildren = new _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_4__["SupportedChildrenService"]().defaultSupportedChildren;
        this.Text = _shared_text__WEBPACK_IMPORTED_MODULE_5__["Text"];
        this.page.actionBarHidden = true;
    }
    ngOnInit() {
    }
    viewChild(target) {
        this.router.navigate(['/supported-child/', target]);
    }
};
HeadsOfFamilyComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-heads-of-family',
        template: __webpack_require__("./app/heads-of-family/heads-of-family.component.html"),
        styles: [__webpack_require__("./app/heads-of-family/heads-of-family.component.css")]
    }),
    __metadata("design:paramtypes", [tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__["Page"],
        _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
        nativescript_feedback__WEBPACK_IMPORTED_MODULE_1__["Feedback"]])
], HeadsOfFamilyComponent);



/***/ }),

/***/ "./app/home/home.component.css":
/***/ (function(module, exports) {

module.exports = "/* Add mobile styles for the component here.  */\n.btn-img{\n    border-radius: 5;\n    border-width: 1;\n    margin: 10;\n    color: black;\n    border-color: #A8F259;\n    background-color: #82CC33;\n    text-align: center;\n}\n\n.flex-btn {\n    align-items: center;\n    justify-content: center;\n}\n\n.logo {\n    border-radius:100%;\n    width:90;\n    height:90;\n    margin: 5;\n}\n\n.page {\n    background-color: #A8F259;\n}\n\n.homecont{\n    margin-left:167px;\n    padding:1px 16px;\n    height:1000px;\n    }\n\nul {\n    list-style-type: none;\n    margin: 0;\n    padding: 0;\n    width: 173px;\n    background-color: #707070;\n    position: fixed;\n    height: 100%;\n    overflow: auto;\n  }\n  \nli a {\n    display: block;\n    color: white;\n    padding: 8px 16px;\n    text-decoration: none;\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  }\n  \nli a.active {\n    background-color: #4CAF50;\n    color: white;\n  }\n  \nli a:hover:not(.active) {\n    background-color: #F7DB07;\n    color: #707070;\n  }\n\n  body{\n    background-color: #82CC33;\n  }\n\n  .topnav .search-container {\n    \n  }\n  \n  .topnav input[type=text] {\n    padding: 6px;\n    margin-top: 8px;\n    font-size: 17px;\n    border: none;\n  }\n  \n  .topnav .search-container button {\n    float: right;\n    padding: 6px 10px;\n    margin-top: 8px;\n    margin-right: 16px;\n    background: #ddd;\n    font-size: 17px;\n    border: none;\n    cursor: pointer;\n  }\n  \n  .topnav .search-container button:hover {\n    background: #ccc;\n  }\n"

/***/ }),

/***/ "./app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<ScrollView class=\"page\">\n    <StackLayout>\n        <StackLayout class=\"p-20 btn-img\">\n            <Image src=\"res://userImg\" stretch=\"aspectFit\" class=\"logo\"></Image>\n            <Label [text]=\"homeWelcome\" class=\"h2 text-center\" textWrap=\"true\"></Label>\n        </StackLayout>\n        <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"navigate('/schools')\">\n            <Label [text]=\"Text.homeAllocatedSchool\" class=\"h2 text-center\" textWrap=\"true\"></Label>\n        </FlexboxLayout>\n        <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"navigate('/supported-children')\">\n            <Label [text]=\"Text.homeAllocatedChildren\" class=\"h2 text-center\" textWrap=\"true\"></Label>\n        </FlexboxLayout>\n        <FlexboxLayout class=\"p-20 btn-img flex-btn\" (tap)=\"signOut($event)\">\n            <Label [text]=\"Text.homeSignOut\" class=\"h2 text-center\" textWrap=\"true\"></Label>\n        </FlexboxLayout>\n    </StackLayout>\n</ScrollView>"

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
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../node_modules/nativescript-feedback/feedback.js");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nativescript_feedback__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../node_modules/tns-core-modules/ui/page/page.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _app_routes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./app/app.routes.ts");
/* harmony import */ var _shared_text__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./app/shared/text.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







let HomeComponent = class HomeComponent {
    constructor(page, router, feedback) {
        this.page = page;
        this.router = router;
        this.feedback = feedback;
        this.activeUser = kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.getActiveUser();
        this.user = this.activeUser.username;
        this.Text = _shared_text__WEBPACK_IMPORTED_MODULE_6__["Text"];
        this.page.actionBarHidden = true;
        this.page.enableSwipeBackNavigation = false;
        this.feedback = new nativescript_feedback__WEBPACK_IMPORTED_MODULE_3__["Feedback"]();
        this.homeWelcome = `${this.Text.homeWelcome}${this.user}`;
    }
    ;
    signOut(args) {
        this.feedback.info({
            message: `${this.Text.feedbackSigningIn} ${this.user}`
        });
        kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.logout().then(() => (this.feedback.success({
            message: `${this.user} ${this.Text.feedbackSignedOut}`
        }),
            this.router.navigate(["/sign-in"])));
    }
    navigate(destination) {
        destination = destination.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "");
        let flag = false;
        for (let curRoute in _app_routes__WEBPACK_IMPORTED_MODULE_5__["routes"]) {
            if (destination == _app_routes__WEBPACK_IMPORTED_MODULE_5__["routes"][curRoute].path) {
                flag = true;
                break;
            }
        }
        if (flag) {
            if (this.router.url == destination) {
                this.feedback.info({
                    message: `${this.Text.feedbackSameLocation} ${destination}`
                });
            }
            else {
                this.router.navigate([destination]);
            }
        }
        else {
            this.feedback.warning({
                message: `${this.Text.feedbackNotImplemented_1} ${destination} ${this.Text.feedbackNotImplemented_2}`
            });
        }
    }
};
HomeComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'ns-home',
        template: __webpack_require__("./app/home/home.component.html"),
        styles: [__webpack_require__("./app/home/home.component.css")]
    }),
    __metadata("design:paramtypes", [tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_4__["Page"],
        _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
        nativescript_feedback__WEBPACK_IMPORTED_MODULE_3__["Feedback"]])
], HomeComponent);



/***/ }),

/***/ "./app/shared/supported-children/supported-children.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SupportedChildrenService", function() { return SupportedChildrenService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let SupportedChildrenService = class SupportedChildrenService {
    constructor() {
        this.defaultSupportedChildren = [
            {
                id: 0,
                first_name: "test 1",
                last_name: "test 1",
                age: 1,
                date_of_birth: {
                    day: 22,
                    month: 0o7,
                    year: 2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof: "person",
                    relation: "nephew",
                },
                personal_status: "Single",
                future_educational_goals: "orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
            {
                id: 1,
                first_name: "test 2",
                last_name: "test 2",
                age: 2,
                date_of_birth: {
                    day: 22,
                    month: 0o7,
                    year: 2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof: "person",
                    relation: "nephew",
                },
                personal_status: "Single",
                future_educational_goals: "orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
            {
                id: 2,
                first_name: "test 3",
                last_name: "test 3",
                age: 3,
                date_of_birth: {
                    day: 22,
                    month: 0o7,
                    year: 2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof: "person",
                    relation: "nephew",
                },
                personal_status: "Single",
                future_educational_goals: "orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
            {
                id: 3,
                first_name: "test 4",
                last_name: "test 4",
                age: 4,
                date_of_birth: {
                    day: 22,
                    month: 0o7,
                    year: 2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof: "person",
                    relation: "nephew",
                },
                personal_status: "Single",
                future_educational_goals: "orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
            {
                id: 4,
                first_name: "test 5",
                last_name: "test 5",
                age: 5,
                date_of_birth: {
                    day: 22,
                    month: 0o7,
                    year: 2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof: "person",
                    relation: "nephew",
                },
                personal_status: "Single",
                future_educational_goals: "orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
        ];
    }
};
SupportedChildrenService = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
    __metadata("design:paramtypes", [])
], SupportedChildrenService);



/***/ }),

/***/ "./app/shared/text.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
const Text = {
    /**
     * Feedback Text
     */
    feedbackMissingUsername: "Please Provide Username",
    feedbackMissingPassword: "Please Provide Password",
    feedbackMissingUsernamePassword: "Please Provide Both a Username and a Password",
    feedbackSigningIn: "Signing In User:",
    feedbackSignedIn: "Signed In User:",
    feedbackSignInError: "Unfortunately we could not sign in to the account:",
    feedbackSigningOut: "Signing Out User:",
    feedbackSignedOut: "Signed Out",
    feedbackSameLocation: "You're Already At:",
    feedbackNotImplemented_1: "The Feature",
    feedbackNotImplemented_2: "Hasn't Been Implemented Yet",
    /**
     * Bio Authentication
     */
    bioTitle: "Authenticate",
    bioMessage: "Sign Into User",
    /**
     * Header Text
     */
    headerBack: "< Back",
    /**
     * Dropdown Text
     */
    headerSupportedChildren: "Supported Children",
    headerHeadsFamily: "Heads of Family",
    headerSponsors: "Sponsors",
    headerSchools: "Schools",
    headerWorkers: "Parish Workers",
    headerOffices: "Assigned Offices",
    /**
     * Sign In Text
     * Default Text
     * Stays Static
     */
    signInUsernameHint: "Username",
    signInPasswordHint: "Password",
    signInSignInButton: "Sign In",
    signInSignUpButton: "Sign Up",
    signInBioFaceButton: "Use Face ID",
    signInBioFingerButton: "Use Touch ID",
    /**
     * Home Text
     * Default Text
     * Some Will Be Changed On Sign In
     */
    homeWelcome: "Welcome:\n",
    homeAllocatedSchool: "Allocated Schools",
    homeAllocatedChildren: "Allocated Children",
    homeSignOut: "Sign Out",
    /**
     * Supported Children Text
     */
    supportedChildrenTitle: "Supported Children",
    /**
     * Supported Child Text
     */
    supportedChildID: "ID:",
    supportedChildAge: "Age:",
    supportedChildSubTitle: "Details",
    supportedChildHeadingFirstName: "First Name",
    supportedChildHeadingFamilyName: "Family Name",
    supportedChildHeadingDateBirth: "Date of Birth",
    supportedChildHeadingGender: "Gender",
    supportedChildHeadingSchool: "School",
    supportedChildHeadingSchoolLevel: "School Level",
    supportedChildHeadingSchoolBooks: "School Books",
    supportedChildHeadingHeadFamily: "Head of Family",
    supportedChildHeadingRelationHeadFamily: "Relation to Head of Family",
    supportedChildHeadingPersonalStatus: "Personal Status",
    supportedChildHeadingGoals: "Future Educational Goals",
    supportedChildHeadingHygieneKits: "Hygiene Kits",
    supportedChildHeadingMedicalSupport: "Medical Support",
    supportedChildHeadingTransportToClinics: "Transport to Clinic",
    /**
     * Generic Text
     */
    genericEditButton: "Edit",
    genericDoneButton: "Done",
};


/***/ }),

/***/ "./app/shared/user/user.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
class User {
}


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


let UserService = class UserService {
    constructor() { }
    login(user) {
        return new Promise((resolve, reject) => {
            kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.logout()
                .then(() => {
                kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_1__["Kinvey"].User.login(user.username, user.password)
                    .then(resolve)
                    .catch((error) => { this.handleErrors(error); reject(); });
            })
                .catch((error) => { this.handleErrors(error); reject(); });
        });
    }
    handleErrors(error) {
        console.error(error.message);
        return error.message;
    }
};
UserService = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
    __metadata("design:paramtypes", [])
], UserService);



/***/ }),

/***/ "./app/sign-in/sign-in.component.css":
/***/ (function(module, exports) {

module.exports = "/* Add mobile styles for the component here.  */\n\n:disabled {\n  opacity: 0.5;\n}\n\n:disabled> :disabled {\n  opacity: 1;\n}\n\nFlexboxLayout {\n  justify-content: center;\n  align-items: center;\n  background-size: cover;\n  background-color: #82CC33;\n}\n\nGridLayout {\n  width: 300;\n  padding: 10 16;\n}\n\nButton, TextField {\n  margin: 10 0;\n}\n\n.btn-primary {\n  margin-left: 0;\n  margin-right: 0;\n}\n\nTextField {\n  placeholder-color: #C4AFB4;\n  color: black;\n}\n\n.input, .btn-primary {\n  background-color: white;\n  color: black;\n}\n\n.web-form {\n  display: flex;\n  align-items: center;\n  height: 100vh;\n  margin: auto;\n  width: auto;\n  max-width: 90%;\n}\n\n.web-form-contents {\n  width: fit-content;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  margin: auto;\n}\n\n.SILogo{\n  padding-left: 50%;\n  padding-top: 5%;\n  margin-left: -225px;\n}\n\n.LogIn{\n  padding-left: 50%;\n  margin-left: -86.5px;\n}\n\n.SIBut{\n  margin-top: 20px;\n  margin-left: 50px;\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  border-width: 0.5px;\n  border-color: #00000061;\n  padding-left: 20px;\n  padding-right: 20px;\n}\n.SIBut:hover{\n  background-color: #F7DB07;\n  color: #707070;\n}\n\nform{\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif\n}\n\nbody{\n  background-color: #82CC33;\n}\n\ninput{\n  padding: 5px;\n  border-radius: 20px;\n}\n\np{\n  margin-bottom: 5px;\n}\n\n"

/***/ }),

/***/ "./app/sign-in/sign-in.component.html":
/***/ (function(module, exports) {

module.exports = "<FlexboxLayout>\n    <GridLayout [isEnabled]=\"!processing\" rows=\"auto,auto,auto,auto,auto\" columns=\"*\" width=\"90%\" class=\"form\">\n        <Image [isEnabled]=\"!processing\" row=\"0\" src=\"res://homeLogo\" stretch=\"aspectFit\"></Image>\n        <TextField row=\"1\" [isEnabled]=\"!processing\" returnKeyType=\"next\" id=\"username\" [hint]=\"Text.signInUsernameHint\" class=\"input input-rounded input-border\" [(ngModel)]=\"user.username\" autocorrect=\"false\" autocapitalizationType=\"none\" (returnPress)=\"switchToPass($event)\"></TextField>\n        <TextField row=\"2\" [isEnabled]=\"!processing\" #password [hint]=\"Text.signInPasswordHint\" secure=\"true\" class=\"input input-rounded input-border\" [(ngModel)]=\"user.password\" autocorrect=\"false\" autocapitalizationType=\"none\" (returnPress)=\"submit($event)\" returnKeyType=\"done\"></TextField>\n        <Button row=\"3\" [isEnabled]=\"!processing\" [text]=\"isLoggingIn ? Text.signInSignInButton : Text.signInSignUpButton\" (tap)=\"submit($event)\" class=\"btn btn-primary btn-rounded-lg btn-active\" clearHistory=\"true\"></Button>\n        <Button row=\"4\" [isEnabled]=\"!processing\" (tap)=\"touchID()\" [text]=\"bioType\" [visibility]=\"bioOn\"></Button>\n        <ActivityIndicator rowSpan=\"5\" [busy]=\"processing\"></ActivityIndicator>\n    </GridLayout>\n</FlexboxLayout>"

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
/* harmony import */ var _shared_text__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./app/shared/text.ts");
/* harmony import */ var _shared_user_user_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/shared/user/user.model.ts");
/* harmony import */ var _shared_user_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./app/shared/user/user.service.ts");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../node_modules/nativescript-feedback/feedback.js");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(nativescript_feedback__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../node_modules/kinvey-nativescript-sdk/kinvey-nativescript-sdk.js");
/* harmony import */ var kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var nativescript_fingerprint_auth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../node_modules/nativescript-fingerprint-auth/fingerprint-auth.js");
/* harmony import */ var nativescript_fingerprint_auth__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(nativescript_fingerprint_auth__WEBPACK_IMPORTED_MODULE_8__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let SignInComponent = class SignInComponent {
    constructor(user, router, userService, page) {
        this.user = user;
        this.router = router;
        this.userService = userService;
        this.page = page;
        this.isLoggingIn = true;
        this.processing = false;
        this.bioType = null;
        this.bioOn = "hidden";
        this.Text = _shared_text__WEBPACK_IMPORTED_MODULE_3__["Text"];
        this.user = new _shared_user_user_model__WEBPACK_IMPORTED_MODULE_4__["User"]();
        this.feedback = new nativescript_feedback__WEBPACK_IMPORTED_MODULE_6__["Feedback"]();
        this.fingerprintAuth = new nativescript_fingerprint_auth__WEBPACK_IMPORTED_MODULE_8__["FingerprintAuth"]();
        this.fingerprintAuth.available().then((result) => {
            this.bioValues = result;
        });
        this.page.actionBarHidden = true;
        this.page.enableSwipeBackNavigation = false;
    }
    ;
    ngOnInit() {
        if (this.bioValues.face) {
            this.bioType = this.Text.signInBioFaceButton;
        }
        else if (this.bioValues.touch) {
            this.bioType = this.Text.signInBioFingerButton;
        }
        if (kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7__["Kinvey"].User.getActiveUser()) {
            kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7__["Kinvey"].User.getActiveUser().me();
            this.user.username = kinvey_nativescript_sdk__WEBPACK_IMPORTED_MODULE_7__["Kinvey"].User.getActiveUser().username;
            this.bioOn = "visible";
        }
        ;
    }
    ;
    switchToPass(args) {
        this.password.nativeElement.focus();
    }
    submit(args) {
        this.processing = true;
        if (!this.user.username && this.user.password) {
            this.feedback.error({
                message: this.Text.feedbackMissingUsername
            });
            this.processing = false;
        }
        else if (this.user.username && !this.user.password) {
            this.feedback.error({
                message: this.Text.feedbackMissingPassword
            });
            this.processing = false;
        }
        else if (!this.user.username && !this.user.password) {
            this.feedback.error({
                message: this.Text.feedbackMissingUsernamePassword
            });
            this.processing = false;
        }
        else {
            this.feedback.info({
                message: `${this.Text.feedbackSigningIn} ${this.user.username}`
            });
            this.login();
        }
    }
    login() {
        this.userService.login(this.user)
            .then(() => {
            this.processing = false;
            this.feedback.success({
                message: `${this.Text.feedbackSignedIn} ${this.user.username}`
            });
            this.router.navigate(["/home"]);
        })
            .catch(() => {
            this.processing = false;
            this.feedback.error({
                message: `${this.Text.feedbackSignInError} ${this.user.username}`
            });
        });
    }
    touchID() {
        this.fingerprintAuth.verifyFingerprint({
            title: this.Text.bioTitle,
            message: `${this.Text.bioMessage} '${this.user.username}'`,
            authenticationValidityDuration: 10,
            useCustomAndroidUI: false // set to true to use a different authentication screen (see below)
        })
            .then(() => {
            this.router.navigate(["/home"]);
        });
    }
};
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])("password"),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
], SignInComponent.prototype, "password", void 0);
SignInComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-sign-in',
        template: __webpack_require__("./app/sign-in/sign-in.component.html"),
        providers: [_shared_user_user_service__WEBPACK_IMPORTED_MODULE_5__["UserService"], _shared_user_user_model__WEBPACK_IMPORTED_MODULE_4__["User"]],
        styles: [__webpack_require__("./app/sign-in/sign-in.component.css")]
    }),
    __metadata("design:paramtypes", [_shared_user_user_model__WEBPACK_IMPORTED_MODULE_4__["User"],
        _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
        _shared_user_user_service__WEBPACK_IMPORTED_MODULE_5__["UserService"],
        tns_core_modules_ui_page__WEBPACK_IMPORTED_MODULE_2__["Page"]])
], SignInComponent);



/***/ }),

/***/ "./app/supported-child/supported-child.component.css":
/***/ (function(module, exports) {

module.exports = "/* Add mobile styles for the component here.  */\n\n:disabled {\n\topacity: 0.5;\n}\n\n:disabled> :disabled {\n\topacity: 1;\n}\n\nFlexboxLayout {\n\tjustify-content: center;\n\talign-items: center;\n\tbackground-size: cover;\n\tbackground-color: #82CC33;\n}\n\nGridLayout {\n\twidth: 300;\n\tpadding: 10 16;\n}\n\n/* Button, Label {\n\tmargin: 10 0;\n}\n*/\n.btn-primary {\n\tmargin-right: 0;\n\tbackground-color: #82CC33;\n\tcolor: black;\n\t/* \n\theight: fit-content; */\n} \n\nTextField {\n\tplaceholder-color: #C4AFB4;\n\tcolor: black;\n}\n\n/* .input, .btn-primary {\n\tbackground-color: white;\n\tcolor: black;\n} */\n\n.web-form {\n\tdisplay: flex;\n\talign-items: center;\n\theight: 100vh;\n\tmargin: auto;\n\twidth: auto;\n\tmax-width: 100%;\n}\n\n.web-form-contents {\n\twidth: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tmargin: auto;\n}\n\n/* button {\n\tfont-size: 15;\n\thorizontal-align: center;\n} */\n\n.drawerContentText {\n\tfont-size: 13;\n\tpadding: 10;\n}\n\n.drawerContentButton {\n\tmargin: 10;\n\thorizontal-align: center;\n}\n\n.sideStackLayout {\n\tbackground-color: #A8F259;\n}\n\n.sideLabel {\n\tpadding: 10;\n\ttext-align: center;\n}\n\n.footer {\n\tborder-color: black;\n\tborder-width: 1 0 0 0;\n\tvertical-align: center;\n\twidth: 100%;\n\tjustify-content: center;\n\tdisplay: flex;\n\talign-items: center;\n\tbox-pack: center;\n\tjustify-content: center;\n\toverflow: hidden;\n\tmargin: auto;\n\theight: 80;\n}\n\n#actionBar {\n\tbackground-color: #82CC33;\n\tborder-color: black;\n\tborder-width: 0 0 1 0;\n\t/* #A8F259 */\n\t/* background-color: #A8F259 */\n}\n\n.action-image {\n\theight: 30;\n\tvertical-align: center;\n\thorizontal-align: center;\n}\n\n.btn-img {\n\tborder-radius: 5;\n\tborder-width: 1;\n\tmargin: 10;\n\tcolor: black;\n\tborder-color: #A8F259;\n\tbackground-color: #82CC33;\n\ttext-align: center;\n}\n\n.flex-btn {\n\talign-items: center;\n\tjustify-content: center;\n}\n\n/* Add mobile styles for the component here.  */\n.btn-img{\n    border-radius: 5;\n    border-width: 1;\n    margin: 10;\n    color: black;\n    border-color: #A8F259;\n    background-color: #82CC33;\n    text-align: center;\n}\n\n.flex-btn {\n    align-items: center;\n    justify-content: center;\n}\n\n.logo {\n    border-radius:100%;\n    width:45;\n    height:45;\n}\n\n.page {\n    background-color: #A8F259;\n}\n\n.txt-left {\n\ttext-align: left;\n}\n\n.date-picker, .list-picker {\n\tbackground-color: lightgray\n}\n\n.hr-light {\n\tmargin-bottom: 20\n}"

/***/ }),

/***/ "./app/supported-child/supported-child.component.html":
/***/ (function(module, exports) {

module.exports = "<ScrollView>\n    <GridLayout rows=\"auto, auto\" columns=\"*\">\n        <GridLayout columns=\"auto, *, auto, auto\" row=\"0\">\n            <Image src=\"res://userImg\" stretch=\"aspectFit\" class=\"logo\" col=\"0\"></Image>\n            <Label text=\"ID: {{target.id}}\" class=\"p-6\" col=\"2\"></Label>\n            <Label text=\"Age: {{target.age}}\" class=\"p-10\" col=\"3\"></Label>\n        </GridLayout>\n        <StackLayout class=\"form\" row=\"1\">\n\n            <Label text=\"Details\" class=\"h1\"></Label>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- First Name -->\n            <StackLayout>\n                <Label text=\"First Name\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"FirstNameLabel\" #labelField [text]=\"target.first_name\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"FirstNameEdit\" #textField [text]=\"target.first_name\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"FirstNameButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('FirstNameLabel','FirstNameEdit','FirstNameButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Family Name -->\n            <StackLayout>\n                <Label text=\"Family Name\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"FamilyNameLabel\" #labelField [text]=\"target.last_name\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"FamilyNameEdit\" #textField [text]=\"target.last_name\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"FamilyNameButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('FamilyNameLabel','FamilyNameEdit','FamilyNameButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Date of Birth -->\n            <StackLayout>\n                <Label text=\"Date of Birth\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"DateOfBirthLabel\" #labelField text=\"{{target.date_of_birth.day}}/{{target.date_of_birth.month}}/{{target.date_of_birth.year}}\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"DateOfBirthButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"datePickerButton('DateOfBirthLabel', 'DateOfBirthPicker', 'DateOfBirthButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <DatePicker id=\"DateOfBirthPicker\" #datePicker [year]=\"target.date_of_birth.year\" [month]=\"target.date_of_birth.month\" [day]=\"target.date_of_birth.day\" visibility=\"collapsed\" class=\"date-picker\"></DatePicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Gender -->\n            <StackLayout>\n                <Label text=\"Gender\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"GenderLabel\" #labelField [text]=\"target.gender\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"GenderButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('GenderLabel', 'GenderPicker', 'GenderButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"GenderPicker\" #listPicker [picked]=\"target.gender\" [items]=\"gender\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- School -->\n            <StackLayout>\n                <Label text=\"School\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"SchoolLabel\" #labelField [text]=\"target.school.school\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"SchoolEdit\" #textField [text]=\"target.school.school\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"SchoolButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('SchoolLabel','SchoolEdit','SchoolButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- School Level -->\n            <StackLayout>\n                <Label text=\"School Level\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"SchoolLevelLabel\" #labelField [text]=\"target.school.level\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"SchoolLevelButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('SchoolLevelLabel', 'SchoolLevelPicker', 'SchoolLevelButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"SchoolLevelPicker\" #listPicker [picked]=\"target.school.level\" [items]=\"school.level\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- School Books -->\n            <StackLayout>\n                <Label text=\"School Books\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"SchoolBooksLabel\" #labelField [text]=\"target.school.books\" class=\"input input-border labelField\" col=\"0\"></Label>\n                    <Button id=\"SchoolBooksButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('SchoolBooksLabel', 'SchoolBooksPicker', 'SchoolBooksButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"SchoolBooksPicker\" #listPicker [picked]=\"target.school.books\" [items]=\"school.books\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Head of Family -->\n            <!-- Need to change to relating to a head of family member -->\n            <StackLayout>\n                <Label text=\"Head of Family\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"HeadOfFamilyLabel\" #labelField [text]=\"target.head_of_family.hof\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"HeadOfFamilyEdit\" #textField [text]=\"target.head_of_family.hof\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"HeadOfFamilyButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('HeadOfFamilyLabel','HeadOfFamilyEdit','HeadOfFamilyButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Relation to Head of Family -->\n            <StackLayout>\n                <Label text=\"Relation to Head of Family\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"HeadOfFamilyRelationLabel\" #labelField [text]=\"target.head_of_family.relation\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextField id=\"HeadOfFamilyRelationEdit\" #textField [text]=\"target.head_of_family.relation\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextField>\n                    <Button id=\"HeadOfFamilyRelationButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('HeadOfFamilyRelationLabel','HeadOfFamilyRelationEdit','HeadOfFamilyRelationButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Personal Status -->\n            <StackLayout>\n                <Label text=\"Personal Status\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"PersonalStatusLabel\" #labelField [text]=\"target.personal_status\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"PersonalStatusButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('PersonalStatusLabel', 'PersonalStatusPicker', 'PersonalStatusButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"PersonalStatusPicker\" #listPicker [picked]=\"target.personal_status\" [items]=\"personal_status\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Future Educational Goals -->\n            <StackLayout>\n                <Label text=\"Future Educational Goals\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"EducationalGoalsLabel\" #labelField [text]=\"target.future_educational_goals\" class=\"input input-border\" col=\"0\"></Label>\n                    <TextView id=\"EducationalGoalsEdit\" #textField [text]=\"target.future_educational_goals\" visibility=\"collapsed\" class=\"input input-border\" col=\"0\"></TextView>\n                    <Button id=\"EducationalGoalsButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"textFieldButton('EducationalGoalsLabel','EducationalGoalsEdit','EducationalGoalsButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Hygiene Kits -->\n            <StackLayout>\n                <Label text=\"Hygiene Kits\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"HygieneKitsLabel\" #labelField [text]=\"target.hygiene_kits\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"HygieneKitsButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('HygieneKitsLabel', 'HygieneKitsPicker', 'HygieneKitsButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"HygieneKitsPicker\" #listPicker [picked]=\"target.personal_status\" [items]=\"personal_status\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Medical Support -->\n            <StackLayout>\n                <Label text=\"Medical Support\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"MedicalSupportLabel\" #labelField [text]=\"target.medical_support\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"MedicalSupportButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('MedicalSupportLabel', 'MedicalSupportPicker', 'MedicalSupportButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"MedicalSupportPicker\" #listPicker [picked]=\"target.medical_support\" [items]=\"medical_support\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n            <StackLayout class=\"hr-light\"></StackLayout>\n            <!-- Transport to Clinic -->\n            <StackLayout>\n                <Label text=\"Transport To Clinic\" class=\"font-weight-bold m-b-5\"></Label>\n                <GridLayout columns=\"*,auto\" orientation=\"horizontal\">\n                    <Label id=\"TransportToClinicLabel\" #labelField [text]=\"target.transport_to_clinic\" class=\"input input-border\" col=\"0\"></Label>\n                    <Button id=\"TransportToClinicButton\" #editButton [text]=\"Text.genericEditButton\" (tap)=\"listPickerButton('TransportToClinicLabel', 'TransportToClinicPicker', 'TransportToClinicButton')\" class=\"btn btn-primary\" col=\"1\"></Button>\n                </GridLayout>\n                <StackLayout>\n                    <ListPicker id=\"TransportToClinicPicker\" #listPicker [picked]=\"target.transport_to_clinic\" [items]=\"transport_to_clinic\" visibility=\"collapsed\" class=\"list-picker\"></ListPicker>\n                </StackLayout>\n            </StackLayout>\n\n        </StackLayout>\n    </GridLayout>\n</ScrollView>"

/***/ }),

/***/ "./app/supported-child/supported-child.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SupportedChildComponent", function() { return SupportedChildComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./app/shared/supported-children/supported-children.service.ts");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../node_modules/tns-core-modules/ui/page/page.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shared_text__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/shared/text.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var view = __webpack_require__("../node_modules/tns-core-modules/ui/core/view/view.js");
let SupportedChildComponent = class SupportedChildComponent {
    constructor(route, page, renderer) {
        this.route = route;
        this.page = page;
        this.renderer = renderer;
        this.supportedChildren = new _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_2__["SupportedChildrenService"]().defaultSupportedChildren;
        this.dataAvailable = false;
        this.Text = _shared_text__WEBPACK_IMPORTED_MODULE_4__["Text"];
        this.gender = ["Male", "Female", "Other"];
        this.school = {
            level: ["education high"],
            books: ["Yes", "No"]
        };
        this.personal_status = ["Single"];
        this.hygiene_kits = ["Yes", "No"];
        this.medical_support = ["Yes", "No"];
        this.transport_to_clinic = ["Yes", "No"];
        this.page.actionBarHidden = true;
        this.textFieldButtonStatus = false;
        this.listPickerButtonStatus = false;
        this.datePickerButtonStatus = false;
    }
    ngOnInit() {
        this.targetId = this.route.snapshot.params['child'];
        for (let i of this.supportedChildren) {
            if (i.id == this.targetId) {
                this.target = i;
            }
        }
    }
    ngAfterViewInit() {
        /*console.log("datePickers")
        console.log(this.datePickers.toArray())
        console.log("listPickers")
        console.log(this.listPickers.toArray())
        console.log("textFieldLabels")
        console.log(this.textFieldLabels.toArray())
        console.log("textFieldTextFields")
        console.log(this.textFieldTextFields.toArray())
        console.log("editButtons")
        console.log(this.editButtons.toArray())*/
    }
    listPickerButton(labelID, pickerID, buttonID, status = this.listPickerButtonStatus) {
        console.log(view.getViewByID(labelID).visibility);
        view.getViewByID(labelID).visibility = "collapse";
        console.log(view.getViewByID(labelID).visibility);
        console.log(view.getViewByID(pickerID).visibility);
        view.getViewByID(pickerID).visibility = "visible";
        console.log(view.getViewByID(pickerID).visibility);
        console.log(view.getViewByID(buttonID).text);
        view.getViewByID(buttonID).text = this.Text.genericDoneButton;
        console.log(view.getViewByID(buttonID).text);
        /*//if (status) { // If Editing Is Active
        this.textFieldLabels.forEach((i) => {
            if (i.nativeElement.id == labelID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "visible"
                console.log(i.nativeElement.visibility)
            }
        })
        this.listPickers.forEach((i) => {
            if (i.nativeElement.id == pickerID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "collapse"
                console.log(i.nativeElement.visibility)
            }
        })
        //console.log(buttonID)
        this.editButtons.forEach((i) => {
            if (i.nativeElement.id == buttonID) {
                console.log(i.nativeElement.text)
                this.renderer.setProperty(i.nativeElement.text, "text", this.Text.genericEditButton)
                console.log(i.nativeElement.text)
            }
        })*/
    } /*else { // If Editing Isn't Active
            console.dir(this.textFieldLabels.toArray())
            this.textFieldLabels.forEach((i) => {
                if (i.nativeElement.id == labelID) {
                    i.nativeElement.visibility = "collapse"
                }
            })
            console.dir(this.listPickers.toArray())
            this.listPickers.forEach((i) => {
                if (i.nativeElement.id == pickerID) {
                    i.nativeElement.visibility = "visible"
                }
            })
            console.dir(this.editButtons.toArray())
            this.editButtons.forEach((i) => {
                if (i.nativeElement.id == buttonID) {
                    i.nativeElement.Text = this.Text.genericDoneButton
                }
            })
            this.listPickerButtonStatus = false
        }
    }*/
    datePickerButton(labelID, pickerID, buttonID, status = this.datePickerButtonStatus) {
        console.log(view.getViewByID(labelID).visibility);
        view.getViewByID(labelID).visibility = "collapse";
        console.log(view.getViewByID(labelID).visibility);
        console.log(view.getViewByID(pickerID).visibility);
        view.getViewByID(pickerID).visibility = "visible";
        console.log(view.getViewByID(pickerID).visibility);
        console.log(view.getViewByID(buttonID).text);
        view.getViewByID(buttonID).text = this.Text.genericDoneButton;
        console.log(view.getViewByID(buttonID).text);
        //if (status) { // If Editing Is Active
        /*this.textFieldLabels.forEach((i) => {
            if (i.nativeElement.id == labelID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "visible"
                console.log(i.nativeElement.visibility)
                //console.log(i.nativeElement.text)
            }
        })
        this.datePickers.forEach((i) => {
            if (i.nativeElement.id == pickerID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "collapse"
                console.log(i.nativeElement.visibility)
            }
        })
        this.editButtons.forEach((i) => {
            if (i.nativeElement.id == buttonID) {
                console.log(i.nativeElement.text)
                this.renderer.setProperty(i.nativeElement.text, "text", this.Text.genericEditButton)
                console.log(i.nativeElement.text)
                //console.log(i.nativeElement.text)
            }
        })*/
    } /*else { // If Editing Isn't Active
            console.dir(this.textFieldLabels.toArray())
            this.textFieldLabels.forEach((i) => {
                if (i.nativeElement.id == labelID) {
                    i.nativeElement.visibility = "collapse"
                }
            })
            console.dir(this.datePickers.toArray())
            this.datePickers.forEach((i) => {
                if (i.nativeElement.id == pickerID) {
                    i.nativeElement.visibility = "visible"
                }
            })
            console.dir(this.editButtons.toArray())
            this.editButtons.forEach((i) => {
                if (i.nativeElement.id == buttonID) {
                    i.nativeElement.Text = this.Text.genericDoneButton
                }
            })
            this.datePickerButtonStatus = false
        }
    }*/
    textFieldButton(labelID, editID, buttonID, status = this.textFieldButtonStatus) {
        console.log(view.getViewByID(labelID).visibility);
        view.getViewByID(labelID).visibility = "collapse";
        console.log(view.getViewByID(labelID).visibility);
        console.log(view.getViewByID(editID).visibility);
        view.getViewByID(editID).visibility = "visible";
        console.log(view.getViewByID(editID).visibility);
        console.log(view.getViewByID(buttonID).text);
        view.getViewByID(buttonID).text = this.Text.genericDoneButton;
        console.log(view.getViewByID(buttonID).text);
        /*//if (status) { // If Editing Is Active
        this.textFieldLabels.forEach((i) => {
            if (i.nativeElement.id == labelID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "collapse"
                console.log(i.nativeElement.visibility)
                //console.log(i.nativeElement.text)
            }
        })
        this.textFieldTextFields.forEach((i) => {
            if (i.nativeElement.id == editID) {
                console.log(i.nativeElement.visibility)
                i.nativeElement.visibility = "visible"
                console.log(i.nativeElement.visibility)
                //console.log(i.nativeElement.text)
            }
        })
        this.editButtons.forEach((i) => {
            if (i.nativeElement.id == buttonID) {
                console.log(i.nativeElement.text)
                this.renderer.setProperty(i.nativeElement.text, "innerHTML", this.Text.genericEditButton)
                console.log(i.nativeElement.text)
            }
        })*/
    } /*else { // If Editing Isn't Active
            console.dir(this.textFieldLabels.toArray())
            this.textFieldLabels.forEach((i) => {
                if (i.nativeElement.id == labelID) {
                    i.nativeElement.visibility = "collapse"
                }
            })
            console.dir(this.textFieldTextFields.toArray())
            this.textFieldTextFields.forEach((i) => {
                if (i.nativeElement.id == editID) {
                    i.nativeElement.visibility = "visible"
                }
            })
            console.dir(this.editButtons.toArray())
            this.editButtons.forEach((i) => {
                if (i.nativeElement.id == buttonID) {
                    i.nativeElement.Text = this.Text.genericDoneButton
                }
            })
            this.textFieldButtonStatus = false
        }
    }*/
};
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('datePicker'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], SupportedChildComponent.prototype, "datePickers", void 0);
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('listPicker'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], SupportedChildComponent.prototype, "listPickers", void 0);
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('labelField'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], SupportedChildComponent.prototype, "textFieldLabels", void 0);
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('textField'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], SupportedChildComponent.prototype, "textFieldTextFields", void 0);
__decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('editButton'),
    __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
], SupportedChildComponent.prototype, "editButtons", void 0);
SupportedChildComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-supported-child',
        template: __webpack_require__("./app/supported-child/supported-child.component.html"),
        styles: [__webpack_require__("./app/supported-child/supported-child.component.css")]
    }),
    __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
        tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__["Page"],
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]])
], SupportedChildComponent);



/***/ }),

/***/ "./app/supported-children/supported-children.component.css":
/***/ (function(module, exports) {

module.exports = "/* Add mobile styles for the component here.  */\n\n:disabled {\n\topacity: 0.5;\n}\n\n:disabled> :disabled {\n\topacity: 1;\n}\n\nFlexboxLayout {\n\tjustify-content: center;\n\talign-items: center;\n\tbackground-size: cover;\n\tbackground-color: #82CC33;\n}\n\nGridLayout {\n\twidth: 300;\n\tpadding: 10 16;\n}\n\nButton, TextField {\n\tmargin: 10 0;\n}\n\n.btn-primary {\n\tmargin-left: 0;\n\tmargin-right: 0;\n}\n\nTextField {\n\tplaceholder-color: #C4AFB4;\n\tcolor: black;\n}\n\n.input, .btn-primary {\n\tbackground-color: white;\n\tcolor: black;\n}\n\n.web-form {\n\tdisplay: flex;\n\talign-items: center;\n\theight: 100vh;\n\tmargin: auto;\n\twidth: auto;\n\tmax-width: 90%;\n}\n\n.web-form-contents {\n\twidth: fit-content;\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tmargin: auto;\n}\n\nbutton {\n\tfont-size: 15;\n\thorizontal-align: center;\n}\n\n.drawerContentText {\n\tfont-size: 13;\n\tpadding: 10;\n}\n\n.drawerContentButton {\n\tmargin: 10;\n\thorizontal-align: center;\n}\n\n.sideStackLayout {\n\tbackground-color: #A8F259;\n}\n\n.sideLabel {\n\tpadding: 10;\n\ttext-align: center;\n}\n\n.footer {\n\tborder-color: black;\n\tborder-width: 1 0 0 0;\n\tvertical-align: center;\n\twidth: 100%;\n\tjustify-content: center;\n\tdisplay: flex;\n\talign-items: center;\n\tbox-pack: center;\n\tjustify-content: center;\n\toverflow: hidden;\n\tmargin: auto;\n\theight: 80;\n}\n\n#actionBar {\n\tbackground-color: #82CC33;\n\tborder-color: black;\n\tborder-width: 0 0 1 0;\n\t/* #A8F259 */\n\t/* background-color: #A8F259 */\n}\n\n.action-image {\n\theight: 30;\n\tvertical-align: center;\n\thorizontal-align: center;\n}\n\n.btn-img {\n\tborder-radius: 5;\n\tborder-width: 1;\n\tmargin: 10;\n\tcolor: black;\n\tborder-color: #A8F259;\n\tbackground-color: #82CC33;\n\ttext-align: center;\n}\n\n.flex-btn {\n\talign-items: center;\n\tjustify-content: center;\n}\n\n/* Add mobile styles for the component here.  */\n.btn-img{\n    border-radius: 5;\n    border-width: 1;\n    margin: 10;\n    color: black;\n    border-color: #A8F259;\n    background-color: #82CC33;\n    text-align: center;\n}\n\n.flex-btn {\n    align-items: center;\n    justify-content: center;\n}\n\n.logo {\n    border-radius:100%;\n    width:45;\n    height:45;\n}\n\n.page {\n    background-color: #A8F259;\n}\n\n.txt-left {\n\ttext-align: left;\n}"

/***/ }),

/***/ "./app/supported-children/supported-children.component.html":
/***/ (function(module, exports) {

module.exports = "<ScrollView class=\"page\">\n    <StackLayout>\n        <FlexboxLayout class=\"p-20 btn-img flex-btn\">\n            <Label [text]=\"Text.supportedChildrenTitle\" class=\"h2 text-center\" textWrap=\"true\"></Label>\n            <!-- <SearchBar></SearchBar> -->\n        </FlexboxLayout>\n        \n        <GridLayout *ngFor=\"let i of supportedChildren\" rows=\"*,2*,*\" columns=\"*,auto,auto,auto,*\" class=\"p-20 btn-img flex-btn\">\n            <Label row=\"0\" col=\"4\" [text]=\"i.id\" class=\"p-6\"></Label>\n            <Image row=\"1\" col=\"0\" src=\"res://userImg\" stretch=\"aspectFit\" class=\"logo\"></Image>\n            <Image row=\"1\" col=\"4\" src=\"res://rightArrow\" (tap)=\"viewChild(i.id)\"></Image>\n            <Label row=\"1\" col=\"1\" colSpan=\"2\" text=\"{{i.first_name}} {{i.last_name}}\" class=\"p-10\"></Label>\n            <Label row=\"1\" col=\"3\" text=\"|  {{ i.age}}\" class=\"p-10\"></Label>\n            <Label row=\"2\" col=\"1\" colSpan=\"2\" [text]=\"i.school.school\" class=\"p-10\"></Label>\n        </GridLayout>\n    </StackLayout>\n</ScrollView>"

/***/ }),

/***/ "./app/supported-children/supported-children.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SupportedChildrenComponent", function() { return SupportedChildrenComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/nativescript-feedback/feedback.js");
/* harmony import */ var nativescript_feedback__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nativescript_feedback__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../node_modules/tns-core-modules/ui/page/page.js");
/* harmony import */ var tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./app/shared/supported-children/supported-children.service.ts");
/* harmony import */ var _shared_text__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./app/shared/text.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let SupportedChildrenComponent = class SupportedChildrenComponent {
    constructor(page, router, feedback) {
        this.page = page;
        this.router = router;
        this.feedback = feedback;
        this.supportedChildren = new _shared_supported_children_supported_children_service__WEBPACK_IMPORTED_MODULE_4__["SupportedChildrenService"]().defaultSupportedChildren;
        this.Text = _shared_text__WEBPACK_IMPORTED_MODULE_5__["Text"];
        this.page.actionBarHidden = true;
    }
    ngOnInit() {
    }
    viewChild(target) {
        this.router.navigate(['/supported-child/', target]);
    }
};
SupportedChildrenComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-supported-children',
        template: __webpack_require__("./app/supported-children/supported-children.component.html"),
        styles: [__webpack_require__("./app/supported-children/supported-children.component.css")]
    }),
    __metadata("design:paramtypes", [tns_core_modules_ui_page_page__WEBPACK_IMPORTED_MODULE_3__["Page"],
        _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
        nativescript_feedback__WEBPACK_IMPORTED_MODULE_1__["Feedback"]])
], SupportedChildrenComponent);



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