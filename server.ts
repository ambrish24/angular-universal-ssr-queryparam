import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import {AppServerModule, renderModuleFactory} from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import {InjectionToken} from '@angular/core';
import {HERO_DETAIL_ID} from './src/app/app.module';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const fs = require('fs');
  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  // The NodeJS Server passes client requests for application pages to the NgUniversal ngExpressEngine.
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // TODO: implement data requests securely
  server.get('/api/**', (req, res) => {
    res.status(404).send('data requests are not yet supported');
  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  let generateHTML;

  // All regular routes use the Universal engine
  // @ts-ignore
  server.get('*', (req, res) => {
    // tslint:disable-next-line:max-line-length
    console.log('req.query ======' +req.query);

    // tslint:disable-next-line:max-line-length
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }, { provide: HERO_DETAIL_ID, useValue: req.query.id }] }, (err, html) => {
      // console.log('HTML ======' +html);
      generateHTML = html;
      // tslint:disable-next-line:no-shadowed-variable
      fs.writeFile('generatedHTML.html', html, (writeFileErr) => {
        // throws an error, you could also catch it here
        if (writeFileErr) throw writeFileErr;
        // success case, the file was saved
        console.log('HTML Save for Dynamic Route');
      });
      // res.send('Hello');
      res.send(html);
    });
  });

  return server;
}

async function printPDF(html) {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({  executablePath: './node_modules/puppeteer/.local-chromium/win64-756035/chrome-win/chrome.exe'});
  // const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setContent(html, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({ format: 'A4' });

  await browser.close();
  return pdf;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
