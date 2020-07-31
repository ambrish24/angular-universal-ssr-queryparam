import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { renderModule, renderModuleFactory } from '@angular/platform-server';

/*

Under the hood, this calls Universal's renderModule() function, while providing caching and other helpful utilities.

The renderModule() function

1.  takes as inputs a template HTML page - index.html,
2.  an Angular module containing components, and
3.  a route that determines which components to display.

The route comes from the client's request to the server.
Each request results in the appropriate view for the requested route.
The renderModule() function renders the view within the <app> tag of the template, creating a finished HTML page for the client.

*/
