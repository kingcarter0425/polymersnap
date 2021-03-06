# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!-- ## Unreleased -->
<!-- Add new, unreleased changes here. -->

## [3.8.1] - 2018-01-29
* Changed name of `excludes` property to more natural `exclude` in `js-minify`, `js-compile`, `css-minify` and `html-minify` options prior to releasing the feature as `exclude` is more natural.  The `bundle` options will remain `excludes` for now, as that is already implemented in `polymer-bundler`.

## [3.8.0] - 2018-01-23
* Updated the `build` options `js-minify`, `js-compile`, `css-minify` and `html-minify` to support an object with `excludes` property to list specific files to exclude from minification or compilation.

## [3.7.0] - 2018-01-01
* Added new option: `autoBasePath`. This new flag sets `basePath: true` on all builds. See that option for more details.
* Removed `addPushManifest` from bundled build presets.

## [3.6.0] - 2017-11-28
* Added a new lint option: `filesToIgnore`. We'll never report warnings for any
  file that matches any of these globs.
  * `ignoreWarnings` is a confusing phrasing. Added the `warningsToIgnore`
    spelling which will be used preferentially. This was better than making the
    options inconsistent, or spelling the new option `ignoreFiles`.
* Improved error messages when validation of a polymer.json object fails.

## [3.5.0] - 2017-11-21
* Added static methods for constructing a ProjectConfig directly from an unvalidated JSON object, in addition to the methods for reading it from disk.

## [3.4.0] - 2017-06-21
* Modified the `bundle` property in project build options to support the subset of `polymer-bundler` options which can be serialized in a JSON file.

## [3.3.0] - 2017-06-09
* Removed `insertPrefetchLinks` from build presets. See https://github.com/Polymer/polymer-build/issues/239 for details.

## [3.2.1] - 2017-05-19
* Turned on insertPrefetchLinks for the bundled presets after prefetch link bugs were fixed.

## [3.2.0] - 2017-05-15
* Add ProjectConfig toJSON method.

## [3.1.0] - 2017-05-15
* Add browserCapabilities and basePath options.

## [3.0.0] - 2017-05-09
* Add build preset support.
* Remove Node v4 support: Node v4 is no longer in Active LTS, so as per the [Polymer Tools Node.js Support Policy](https://www.polymer-project.org/2.0/docs/tools/node-support) we will not support Node v4 going forward. Please update to Node v6 or later to continue using the latest verisons of Polymer tooling.


## [2.1.1] - 2017-04-14
* Add more documentation, and expose it through the JSON Schema.

## [2.1.0] - 2017-04-11
* `builds`: Add support for `addPushManifest` build option. See [polymer-build README](https://github.com/Polymer/polymer-build#projectaddpushmanifest) for more information.


## [2.0.1] - 2017-02-28
* Update version of plylog.

## [2.0.0] - 2017-02-10

* [BREAKING] polymer.json is validated upon being read and an error will be thrown if any fields are of the wrong type. All toplevel fields are optional, and no error is thrown on encountering extra fields.
* Added "lint" config option for configuring polymer-lint.

## [1.2.0] - 2017-01-27

* Added `isSources()` method to ProjectConfig: validates that a given file path matches the project's "sources" globs. Useful for determining if a file should be treated as a source file or as a dependency.
* New Config Option: `builds` defines project build configurations.
* `validate()` now checks the `builds` property for missing and duplicate names.

## [1.1.0] - 2016-12-09

* Added `validate()` method to ProjectConfig: validates that polymer.json contains valid paths.

## [1.0.2] - 2016-09-23

* Add `package.json` metadata

## [1.0.1] - 2016-09-23

* Add `.npmignore`

## [1.0.0] - 2016-09-23

* Initial release!
