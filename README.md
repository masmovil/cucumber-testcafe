# cucumber-testcafe

This package integrates cucumber and testcafe in one single CLI configurable via profiles.

Also provides a set of generic step-definitions implemented with testcafe.

## Requisites

* [nodejs](https://nodejs.org/)
* [cucumber vscode autocomplete](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)

## Super fast quick start

```
cd my-project && npm init
npm i cucumber-testcafe --save    # install
npx cucumber-testcafe init test   # bootstrap
npx cucumber-testcafe run         # run
```

## Quick start

* Install with npm

  ```
  npm i --save-dev cucumber-testcafe
  ```
  
* Install with yarn
  ```
  yarn add -D cucumber-testcafe
  ```

* Bootstrap a cucumber-testcafe project
  * Creates test folder estructure, with:
    * Example Home page object from [`BasePO`](https://github.com/masmovil/cucumber-testcafe/blob/master/example-project/test/book/home.po.ts)
    * Example page declaration in [`book`](https://github.com/masmovil/cucumber-testcafe/blob/master/example-project/test/book/index.ts)
    * Example Home steps definition [`Home.sd`](https://github.com/masmovil/cucumber-testcafe/blob/master/example-project/test/steps/home.sd.ts)
  * Creates [VSCode cucumber settings](https://github.com/masmovil/cucumber-testcafe/blob/master/example-project/.vscode/settings.json).
  * Creates default [`cucumber.profiles.json`](https://github.com/masmovil/cucumber-testcafe/blob/master/example-project/cucumber.profiles.json) config file.

  ```
  cucumber-testcafe init <folder> # ./test/ as default folder
  ```

* Runs cucumber-testcafe project

  ```
  cucumber-testcafe run CUCUMBER_PROFILE=default # default as defacto profile name to run
  ```

* Show help

  ```
  cucumber-testcafe --help
  ```


* Run this repo test

  ```
  npm test
  ```

* [Example project with tests](https://github.com/masmovil/cucumber-testcafe/tree/master/example-project)

* [Example config by profiles](https://github.com/masmovil/cucumber-testcafe/blob/master/example-project/cucumber.profiles.json)

* [List of available step definitions](https://github.com/masmovil/cucumber-testcafe/blob/master/src/lib/steps/base.sd.ts)

* [Example VSCode config](https://github.com/masmovil/cucumber-testcafe/blob/master/example-project/.vscode/settings.json)


## More info

* https://devexpress.github.io/testcafe/documentation/test-api/selecting-page-elements/selectors/
* https://cucumber.io/docs/cucumber/cucumber-expressions/
* https://cucumber.io/docs/gherkin/