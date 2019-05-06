# tslint-jasmine-rules

tslint rules for jasmine tests

## Install

`npm install tslint-jasmine-rules --save-dev`

Then reference the rules in your `tslint.json` and enable the rules you want:
```json
{
  "extends": [
    "tslint-jasmine-rules"
  ],
  "rules":{
  }
}
```

## Available rules

```json
{
  "no-focused-tests": true,
  "no-disabled-tests": true,
  "expect-length": true
}
```

## Fixable

The following rules are fixable:
* no-focused-tests
* no-disabled-tests

Fixes are __not__ applied when `"severity": "warning"` is used.
