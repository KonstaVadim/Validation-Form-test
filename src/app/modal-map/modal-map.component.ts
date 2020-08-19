import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

declare var ymaps: any;

@Component({
  selector: "app-modal-map",
  templateUrl: "./modal-map.component.html",
  styleUrls: ["./modal-map.component.scss"],
})
export class ModalMapComponent implements OnInit {
  @Input() activeModal: string; // активное модальное окно первого уровня
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeAddress: EventEmitter<any> = new EventEmitter<any>();
  map: any;
  myPlacemark: any;

  constructor() {}

  ngOnInit() {
    ymaps.ready().then(() => {
      this.map = new ymaps.Map(
        "map",
        {
          center: [55.75396, 37.620393],
          zoom: 15,
        },
        {
          yandexMapDisablePoiInteractivity: true,
        }
      );

      // Слушаем клик на карте.
      this.map.events.add("mousedown", (event) => {
        var coords = event.get("coords");

        // Если метка уже создана – просто передвигаем ее.
        if (this.myPlacemark) {
          this.myPlacemark.geometry.setCoordinates(coords);
        }
        // Если нет – создаем.
        else {
          this.myPlacemark = this.createPlacemark(coords);
          this.map.geoObjects.add(this.myPlacemark);
          // Слушаем событие окончания перетаскивания на метке.
          this.myPlacemark.events.add("dragend", () => {
            this.getAddress(this.myPlacemark.geometry.getCoordinates());
          });
        }
        this.getAddress(coords);
      });
    });
  }

  /* Создание метки */
  createPlacemark(coords) {
    return new ymaps.Placemark(
      coords,
      {
        iconCaption: "поиск...",
      },
      {
        preset: "islands#violetDotIconWithCaption",
        draggable: true,
      }
    );
  }

  /* Получение данных из координат */
  getAddress(coords) {
    this.myPlacemark.properties.set("iconCaption", "поиск...");
    ymaps.geocode(coords).then((res) => {
      let firstGeoObject = res.geoObjects.get(0);

      this.myPlacemark.properties.set({
        // Формируем строку с данными об объекте.
        iconCaption: [
          // Название населенного пункта или вышестоящее административно-территориальное образование.
          firstGeoObject.getLocalities().length
            ? firstGeoObject.getLocalities()
            : firstGeoObject.getAdministrativeAreas(),
          // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
          firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
        ]
          .filter(Boolean)
          .join(", "),
        // В качестве контента балуна задаем строку с адресом объекта.
        balloonContent: firstGeoObject.getAddressLine(),
      });
      this.emitAddress(firstGeoObject.getAddressLine());
    });
  }

  /* Jотправка адреса родителю */
  emitAddress(address) {
    this.changeAddress.emit(address);
  }

  /* Закрыть модальное окно 1 уровня */
  closeActiveModal() {
    this.closeModal.emit("");
  }
}
