"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.selectDeployPreview = void 0;

var _immutable = require("immutable");

var _deploys = require("../actions/deploys");

const deploys = function deploys() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.Map)({
    deploys: (0, _immutable.Map)()
  });
  let action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _deploys.DEPLOY_PREVIEW_REQUEST:
      {
        const _action$payload = action.payload,
              collection = _action$payload.collection,
              slug = _action$payload.slug;
        return state.setIn(['deploys', `${collection}.${slug}`, 'isFetching'], true);
      }

    case _deploys.DEPLOY_PREVIEW_SUCCESS:
      {
        const _action$payload2 = action.payload,
              collection = _action$payload2.collection,
              slug = _action$payload2.slug,
              url = _action$payload2.url,
              status = _action$payload2.status;
        return state.setIn(['deploys', `${collection}.${slug}`], (0, _immutable.fromJS)({
          isFetching: false,
          url,
          status
        }));
      }

    case _deploys.DEPLOY_PREVIEW_FAILURE:
      {
        const _action$payload3 = action.payload,
              collection = _action$payload3.collection,
              slug = _action$payload3.slug;
        return state.setIn(['deploys', `${collection}.${slug}`], (0, _immutable.fromJS)({
          isFetching: false
        }));
      }

    default:
      return state;
  }
};

const selectDeployPreview = (state, collection, slug) => state.getIn(['deploys', `${collection}.${slug}`]);

exports.selectDeployPreview = selectDeployPreview;
var _default = deploys;
exports.default = _default;