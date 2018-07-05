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

The rules `no-focused-tests` and `no-disabled-tests` can have a parameter `fixable` to fix them:

```json
{
  "no-focused-tests": [true, "fixable"],
  "no-disabled-tests": [true, "fixable"]
}
```