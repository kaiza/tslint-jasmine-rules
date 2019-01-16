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

To disable these fixers, use `[true, "no-fix"]` instead of just `true`.
