# Fusion 360 Addin Helper

<a href="https://github.com/HiceS/fusion-360-helper">![Fusion Badge](https://img.shields.io/static/v1?label=Github&message=Fusion%20360%20Helper&color=bf5808&style=flat-square)</a>

This is an extension that provides some useful functions to help with Addin development.

## Features

Automatically detects and sets the following settings for the Python Interpreter if you open a Python Addin with a manifest.

* `python.pythonPath`: enables this and points to Fusion Python Location
* `python.autoComplete.extraPaths`: adds the adsk library for autocomplete

This can be manually reset with the following commands:

* `Shift+P` + `Link Fusion 360 Libraries`

## Requirements

Fusion 360 must be installed on your machine in order for the extension to locate the addin files for configuration.

## Extension Settings

Entension includes the following settings in `contributes.configuration`

This extension contributes the following settings:

* `fusion-360-helper.enable`: enable/disable this extension
* `fusion-360-helper.path`: fusion 360 python path
* `fusion-360-helper.definitions`: fusion 360 library definition locations

## Known Issues

TBD

**MACOS** : Possibility for unintended pathing. 

## Release Notes

### 1.0.0

Initial release of Fusion 360 Helper

## Legal Note

This is privately published and the above logo featured is a trademarked symbol of the Autodesk Coporation. I am publishing this as an individual to benefit the general public. I do not intend to imply Autodesk is in any way liable for any code published by this account or in this extension. Nor anything said or done by the Extension.
