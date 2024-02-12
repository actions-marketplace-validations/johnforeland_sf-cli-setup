# Salesforce sf CLI action

This action allows to use the Salesforce sf CLI from GitHub Actions

## Inputs

### `sfdx-auth-url`

**Optional** Authorize a Salesforce org using an SFDX auth URL

The secret must have the format `force://<refreshToken>@<instanceUrl>` or `force://<clientId>:<clientSecret>:<refreshToken>@<instanceUrl>`

You can obtain the URL from a authorized org from your local machine using: `sfdx force:org:display -u ORG-ALIAS --verbose`

### sf-cli-version

**Optional** Set a specific sf cli version. No version number will install the latest. You can find the version number from [salesforcecli/cli releases](https://github.com/salesforcecli/cli/releases)

## Example usage

```yaml
name: SF Test Run on Push

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: johnforeland/sf-cli-setup@v1
        with:
          sfdx-auth-url: ${{ secrets.AUTH_SECRET }}
          sf-cli-version: 2.27.6
      - name: Run Tests
        run: sf force apex test run -l RunLocalTests -w 30
```

## License

Forked from [sfdx-actions/setup-sfdx](https://github.com/sfdx-actions/setup-sfdx)

```
MIT License

Copyright (c) 2019 Felipe Echanique Torres (felipe.echanique at gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
