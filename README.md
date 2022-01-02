# PRS Project

## Dependencies
- [Node.JS v10.15.3](https://nodejs.org/en/)
    - NPM v6.14.5
- [VS Code](https://code.visualstudio.com)
    - any text editor/IDE will work

## Getting Environment Configured
- Install Dependencies
- Clone/download this Project Repository
- Run `npm install` within downloaded directory using Terminal/PowerShell/Command Prompt
    - This pulls specific libraries used by the scripts. Node's `npm` is similar to Python's `pip`.

## Breakdown
The codebase is split into three major sections. The first two are solely data cleansing and validating the proof of concept prior to synthesizing the information into a web dashboard.

1. `node process.js`
    - Primary script used to generate final JSON presented on site, seen at `index.html`. 
    - This script runs some minor calculations, does keyword analysis and basic sentiment analysis and then outputs `data-synthesized.json`.

## Website
Site is dependent on `index.html`, `index.css` and `data-synthesized.json`.

The website simply takes `data-synthesized.json` and visualizes the information in a more user-friendly interface.

By uploading to the GitHub repository master branch, the [GitHub Pages](https://pages.github.com) hosting service will automatically update the live website.

## Adding new Data
Within `process.js`, there are comments `/* NEW PHYSICIAN METRICS GO HERE */` and `/* NEW COMMENT METRICS GO HERE */`. Those sections is traversed for each physician/comment and is currently used to join the high-level doctor metadata with individual comments to one consolidated JSON structure for the web page.

If needed, more JSON/CSV files can be loaded to the script and joined into the data structure. This allows for easy integration of other approaches of topic modeling, keywords and sentiment analysis.

## Domain Configuration
1. Purchase Domain
2. Configure Domain Name in GitHub Repository Settings
3. DNS, choose one of the following based on Chosen (Sub)Domain
    - a. Configure following A records for Apex domain (i.e. domain.com)
        - 185.199.108.153
        - 185.199.109.153
        - 185.199.110.153
        - 185.199.111.153
    - b. Configure CNAME records for Subdomain (i.e. www.domain.com)
        - lmotiwalla.github.io

Please see [GitHub Pages Custom Domains](https://docs.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site) for more information about how to change the URL in future after domain purchase.