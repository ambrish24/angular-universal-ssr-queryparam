import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

/*Angular platform-server package (as opposed to platform-browser),
which provides server implementations of the DOM, XMLHttpRequest,
  and other low-level features that don't rely on a browser.*/

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [
    // Add server-only providers here.
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
