// Generated by CoffeeScript 1.6.2
(function() {
  "use strict";
  var int, isEmpty;

  isEmpty = function(value) {
    return angular.isUndefined(value) || value === "" || value === null || value !== value;
  };

  int = function(str) {
    return parseInt(str, 10);
  };

  angular.module("unicode_eastasianwidth", []).directive("eastAsianWidth", function() {
    return {
      require: "ngModel",
      restrict: "A",
      link: function(scope, iElement, iAttrs, controller) {
        var maxLengthValidator, maxlength;

        maxlength = int(iAttrs.ngMaxlength || iAttrs.maxlength);
        maxLengthValidator = function(value) {
          if (!isEmpty(value) && unicodeEastAsianWidth.width(value) > maxlength) {
            controller.$setValidity("maxlength", false);
            return void 0;
          } else {
            controller.$setValidity("maxlength", true);
            return value;
          }
        };
        controller.$parsers.push(maxLengthValidator);
        controller.$formatters.push(maxLengthValidator);
      }
    };
  }).filter("truncate", [
    "length", function(length) {
      length = int(length);
      return function(value) {
        return unicodeEastAsianWidth.truncate(value, length, "…");
      };
    }
  ]).factory("hasEm", function() {
    return unicodeEastAsianWidth.hasEm;
  });

}).call(this);
// Generated by CoffeeScript 1.6.2
(function() {
  "use strict";
  var binaryRangeSearch, checkHighSurrogate, checkLowSurrogate, decodeErrorMessage, decodeSurrogatePair, end_group, isHighSurrogate, isLowSurrogate, isSurrogate, kHighSurrogateMask, kHighSurrogateMax, kHighSurrogateMin, kHighSurrogateOffset, kLowSurrogateMask, kLowSurrogateMax, kLowSurrogateMin, kSurrogateBits, kSurrogateMask, kSurrogateMax, kSurrogateMin, start_group, unicodeEastAsianWidth;

  if (typeof exports !== "undefined" && exports !== null) {
    unicodeEastAsianWidth = exports;
  } else {
    if (this.unicodeEastAsianWidth == null) {
      this.unicodeEastAsianWidth = unicodeEastAsianWidth = {};
    }
  }

  start_group = [161, 164, 167, 170, 173, 176, 182, 188, 198, 208, 215, 222, 230, 232, 236, 240, 242, 247, 252, 254, 257, 273, 275, 283, 294, 299, 305, 312, 319, 324, 328, 333, 338, 358, 363, 462, 464, 466, 468, 470, 472, 474, 476, 593, 609, 708, 711, 713, 717, 720, 728, 733, 735, 768, 913, 945, 963, 1025, 1040, 1105, 4352, 4515, 4602, 8208, 8211, 8216, 8220, 8224, 8228, 8240, 8242, 8245, 8251, 8254, 8308, 8319, 8321, 8364, 8451, 8453, 8457, 8467, 8470, 8481, 8486, 8491, 8531, 8539, 8544, 8560, 8585, 8632, 8658, 8660, 8679, 8704, 8706, 8711, 8715, 8719, 8721, 8725, 8730, 8733, 8739, 8741, 8743, 8750, 8756, 8764, 8776, 8780, 8786, 8800, 8804, 8810, 8814, 8834, 8838, 8853, 8857, 8869, 8895, 8978, 9001, 9312, 9451, 9552, 9600, 9618, 9632, 9635, 9650, 9654, 9660, 9664, 9670, 9675, 9678, 9698, 9711, 9733, 9737, 9742, 9748, 9756, 9758, 9792, 9794, 9824, 9827, 9831, 9836, 9839, 9886, 9918, 9924, 9935, 9955, 9960, 10045, 10071, 10102, 11093, 11904, 12353, 13312, 13312, 19894, 19968, 19968, 40908, 40960, 43360, 44032, 55216, 57344, 63744, 63744, 64046, 64110, 64218, 65024, 65072, 65281, 65504, 65533, 110592, 127232, 127280, 127488, 131072, 131072, 173783, 173824, 173824, 177973, 177984, 177984, 178206, 194560, 194560, 195102, 196608, 917760, 983040, 1048576];

  end_group = [161, 164, 168, 170, 174, 180, 186, 191, 198, 208, 216, 225, 230, 234, 237, 240, 243, 250, 252, 254, 257, 273, 275, 283, 295, 299, 307, 312, 322, 324, 331, 333, 339, 359, 363, 462, 464, 466, 468, 470, 472, 474, 476, 593, 609, 708, 711, 715, 717, 720, 731, 733, 735, 879, 937, 961, 969, 1025, 1103, 1105, 4447, 4519, 4607, 8208, 8214, 8217, 8221, 8226, 8231, 8240, 8243, 8245, 8251, 8254, 8308, 8319, 8324, 8364, 8451, 8453, 8457, 8467, 8470, 8482, 8486, 8491, 8532, 8542, 8555, 8569, 8601, 8633, 8658, 8660, 8679, 8704, 8707, 8712, 8715, 8719, 8721, 8725, 8730, 8736, 8739, 8741, 8748, 8750, 8759, 8765, 8776, 8780, 8786, 8801, 8807, 8811, 8815, 8835, 8839, 8853, 8857, 8869, 8895, 8978, 9002, 9449, 9547, 9587, 9615, 9621, 9633, 9641, 9651, 9655, 9661, 9665, 9672, 9675, 9681, 9701, 9711, 9734, 9737, 9743, 9749, 9756, 9758, 9792, 9794, 9825, 9829, 9834, 9837, 9839, 9887, 9919, 9933, 9953, 9955, 9983, 10045, 10071, 10111, 11097, 12350, 13311, 19893, 19903, 19903, 40907, 40959, 40959, 42182, 43388, 55203, 55291, 63743, 64047, 64111, 64217, 64255, 64255, 65049, 65131, 65376, 65510, 65533, 110593, 127277, 127386, 127569, 173782, 173791, 173823, 177972, 177983, 178205, 178207, 194367, 194559, 195101, 195103, 196605, 262141, 917999, 1048573, 1114109];

  kSurrogateBits = 10;

  kHighSurrogateMin = 0xD800;

  kHighSurrogateMax = 0xDBFF;

  kHighSurrogateMask = (1 << kSurrogateBits) - 1;

  kLowSurrogateMin = 0xDC00;

  kLowSurrogateMax = 0xDFFF;

  kLowSurrogateMask = (1 << kSurrogateBits) - 1;

  kSurrogateMin = kHighSurrogateMin;

  kSurrogateMax = kLowSurrogateMax;

  kSurrogateMask = (1 << (kSurrogateBits + 1)) - 1;

  kHighSurrogateOffset = kHighSurrogateMin - (0x10000 >> 10);

  isHighSurrogate = function(uc) {
    return (uc & ~kHighSurrogateMask) === kHighSurrogateMin;
  };

  isLowSurrogate = function(uc) {
    return (uc & ~kLowSurrogateMask) === kLowSurrogateMin;
  };

  isSurrogate = function(uc) {
    return (uc & ~kSurrogateMask) === kSurrogateMin;
  };

  decodeErrorMessage = "UTF-16 decode error";

  checkHighSurrogate = function(high_code) {
    if (!isHighSurrogate(high_code)) {
      throw new Error(decodeErrorMessage);
    }
  };

  checkLowSurrogate = function(low_code) {
    if (!isLowSurrogate(low_code)) {
      throw new Error(decodeErrorMessage);
    }
  };

  decodeSurrogatePair = function(high, low) {
    checkHighSurrogate(high);
    checkLowSurrogate(low);
    return ((high & kHighSurrogateMask) << kSurrogateBits) + (low & kLowSurrogateMask) + 0x10000;
  };

  unicodeEastAsianWidth._binaryRangeSearch = binaryRangeSearch = function(heads, tails, value) {
    var head, tail, where;

    head = 0;
    tail = heads.length - 1;
    while (head <= tail) {
      where = Math.floor((head + tail) / 2);
      if (value === heads[where]) {
        return true;
      } else if (value < heads[where]) {
        tail = where - 1;
      } else {
        head = where + 1;
      }
    }
    return value <= tails[tail];
  };

  unicodeEastAsianWidth.width = function(text) {
    var code, i, low_code, width;

    width = 0;
    i = 0;
    while (i < text.length) {
      code = text.charCodeAt(i);
      if (isSurrogate(code)) {
        low_code = text.charCodeAt(++i);
        code = decodeSurrogatePair(code, low_code);
      }
      if (binaryRangeSearch(start_group, end_group, code)) {
        width += 2;
      } else {
        ++width;
      }
      ++i;
    }
    return width;
  };

  unicodeEastAsianWidth.hasEm = function(text) {
    var code, i, low_code;

    i = 0;
    while (i < text.length) {
      code = text.charCodeAt(i);
      if (isSurrogate(code)) {
        low_code = text.charCodeAt(++i);
        code = decodeSurrogatePair(code, low_code);
      }
      if (binaryRangeSearch(start_group, end_group, code)) {
        return true;
      }
      ++i;
    }
    return false;
  };

  unicodeEastAsianWidth.truncate = function(string, length, suffix) {
    var c, clen, count, ret, slen, width, _i, _len, _ref;

    width = unicodeEastAsianWidth.width;
    if (width(string) <= length) {
      return string;
    }
    slen = width(suffix);
    ret = "";
    count = 0;
    _ref = string.split("");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      clen = width(c);
      if (count + clen + slen > length) {
        ret += suffix;
        break;
      }
      ret += c;
      count += clen;
    }
    return ret;
  };

}).call(this);
