import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { DateTimeAdapter } from "ng-pick-datetime";
import { transition, trigger, animate, state, style, query } from '@angular/animations';
@Component({
  selector: "app-input-form",
  templateUrl: "./input-form.component.html",
  styleUrls: ["./input-form.component.scss"],
  animations: [
    trigger('animateBlock', [
      transition(':enter', [
        style({opacity: 0}),
        animate('500ms', style({opacity: 1}))
      ])
    ]),
    trigger('animateModal', [
      transition(':leave', [
        style({opacity: 1}),
        animate('500ms', style({opacity: 0}))
      ]),
      transition(':enter', [
        style({opacity: 0}),
        animate('500ms', style({opacity: 1}))
      ]),
      
    ])
  ]
})
export class InputFormComponent implements OnInit  {

  numberStage: number = 1; /* Номер открытого этапа */

  activeModal: string; // активное модальное окно первого уровня

  /* Формы для каждого этапа */
  reactiveFormFirstStage: FormGroup; //Форма первого этапа
  reactiveFormSecondStage: FormGroup; //Форма второго этапа
  reactiveFormThirdStage: FormGroup; //Форма третьего этапа

  constructor(private fb: FormBuilder, dateTimeAdapter: DateTimeAdapter<any>) {
    dateTimeAdapter.setLocale("ru-RU");
    this.initForm(); // инициализация формы
  }

  ngOnInit() {}

  /* Инициализация формы */
  initForm() {
    // Форма
    this.reactiveFormFirstStage = this.fb.group({
      first_name: null,
      last_name: null,
    });
    this.reactiveFormSecondStage = this.fb.group({
      email: null,
      number_phone: null,
      address: null,
      date_time: null,
    });
    this.reactiveFormThirdStage = this.fb.group({
      personal_data: null,
      notification: false,
    });
  }
 
  /* Смена этапа для заполнения данных */
  changeStage() {
    let reactiveFormName: string; // наименование форгруппы на выбранном жтапе заполнения данных

    // Определяем на с каким этапом работать
    switch (this.numberStage) {
      case 1: // этап 1
        reactiveFormName = "reactiveFormFirstStage";
        break;
      case 2: // этап 2
        reactiveFormName = "reactiveFormSecondStage";
        break;
      case 3: // этап 3
        reactiveFormName = "reactiveFormThirdStage";
        break;
    }

    let controls = this[reactiveFormName].controls;

    /* Проверяем форму на валидность */
    if (this[reactiveFormName].invalid) {
      /* Если форма не валидна, то помечаем все контролы как touched */
      Object.keys(controls).forEach((controlName) => {
        controls[controlName].markAsTouched();
      });

      /* Выходим из метода */
      return;
    }

    /* Если не последний этап, то переходим на следующий этап */
    if (this.numberStage != 3) {
      this.numberStage++;
    } else {
      // если последний этап - завершаем
      this.completeDataEntry();
    }
  }

  /* Завершение заполнения данных */
  completeDataEntry() {
    /* Проверяем на валидность первый этап, в случае, когда мы перешли на последний через меню */
    if (this.reactiveFormFirstStage.invalid) {
      // Если есть невалидные данные, то перемещаемся к данному этапу и подкрашиваем
      this.numberStage = 1;
      this.changeStage();
      return;
    }

    /* Проверяем на валидность второй этап, в случае, когда мы перешли на последний через меню */
    if (this.reactiveFormSecondStage.invalid) {
      // Если есть невалидные данные, то перемещаемся к данному этапу и подкрашиваем
      this.numberStage = 2;
      this.changeStage();
      return;
    }
    // Объединяем данные со всех этапов
    let assignData = Object.assign(
      this.reactiveFormFirstStage.value,
      this.reactiveFormSecondStage.value,
      this.reactiveFormThirdStage.value
    );
    // Избавляемся от ссылки
    let dataFromInputForm = JSON.parse(JSON.stringify(assignData));
    this.simulateSendingData(dataFromInputForm);

  }

  /* Метод для симуляции отправки данных */
  simulateSendingData(data) {
    console.log("Собранные данные: ", data);
  }

  /* Закрыть модальное окно 1 уровня */
  closeActiveModal(event) {
    this.activeModal = event;
  }

  /* Изменить адрес на выбранный */
  changeAddress(address) {
    this.reactiveFormSecondStage.patchValue({address: address}, {emitEvent: false});
  }

   /* Гетеры для получения данных из форм */
  // Имя
  get _firstName() {
    return this.reactiveFormFirstStage.get('first_name');
  }
  // Фамилия
  get _last_name() {
    return this.reactiveFormFirstStage.get('last_name');
  }
  
  // Почта
  get _email() {
    return this.reactiveFormSecondStage.get('email');
  }

  // Номер телефона
  get _number_phone() {
    return this.reactiveFormSecondStage.get('number_phone');
  }
  
  // Адрес
  get _address() {
    return this.reactiveFormSecondStage.get('address');
  }
  
  // Дата и время
  get _date_time() {
    return this.reactiveFormSecondStage.get('date_time');
  }

  // Согаласие на обработку пер. данных
  get _personal_data() {
    return this.reactiveFormThirdStage.get('personal_data');
  }
}
