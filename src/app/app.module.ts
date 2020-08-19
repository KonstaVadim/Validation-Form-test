import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";

import { AppComponent } from "./app.component";
import { InputFormComponent } from "./input-form/input-form.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ModalMapComponent } from './modal-map/modal-map.component';


@NgModule({
  declarations: [
    AppComponent,
    InputFormComponent,
    HeaderComponent,
    FooterComponent,
    ModalMapComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,

    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
