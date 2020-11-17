/* eslint-disable */
/*stylelint-disable*/
'use strict';

(function () {
  var modal = document.querySelector('.popup-header');
  var close = document.querySelector('.close');
  var open = document.querySelector('.open-modal');
  var inputFocus = document.querySelector('.popup-header__name');

  var PopupEscPressHandler = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeModal();
    }
  };

  var openModal = function () {
    modal.classList.remove('hidden');
    inputFocus.focus();

    document.addEventListener('keydown', PopupEscPressHandler);
  };

  open.addEventListener('click', openModal);

  var closeModal = function () {
    modal.classList.add('hidden');
    document.removeEventListener('keydown', PopupEscPressHandler);
  };

  close.addEventListener('click', function () {
    closeModal();
  });

  modal.addEventListener('click', function (e) {
    if (e.target !== e.currentTarget) {
      return;
    } else {
      closeModal();
    }
  });

  // backend
  var TIMEOUT_IN_MS = 10000;

  var URL_POST = 'http://echo.htmlacademy.ru';

  var StatusCode = {
    OK: 200
  };

  var createNewXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    return xhr;
  };

  var save = function (data, onLoad, onError) {
    var xhr = createNewXhr(onLoad, onError);

    xhr.open('POST', URL_POST);
    xhr.send(data);
  };

  // message
  var form = document.querySelectorAll('.form');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successText = successTemplate.cloneNode(true);
  var errorText = errorTemplate.cloneNode(true);

  var resetForm = function () {
    form.forEach(function (element) {
      element.reset();
    });
  };

  var showMessage = function (result) {
    switch (result) {
      case 'success':
        modal.classList.add('hidden');
        document.body.appendChild(successText);
        resetForm();

        break;
      case 'error':
        modal.classList.add('hidden');
        document.body.appendChild(errorText);
        resetForm();
        break;
    }
    document.addEventListener('click', messageСloseHandler);
    document.addEventListener('keydown', messageСloseHandler);
  };

  var messageСloseHandler = function (evt) {
    var error = document.querySelector('.error');
    var success = document.querySelector('.success');

    if (error && (evt.keyCode === 27 || evt.button === 0)) {
      errorText.remove();
    } else
    if (success && (evt.keyCode === 27 || evt.button === 0)) {
      successText.remove();
    }
    document.removeEventListener('click', messageСloseHandler);
    document.removeEventListener('keydown', messageСloseHandler);
  };

  var successPostHandler = function () {
    showMessage('success');
  };

  var errorPostHandler = function () {
    showMessage('error');
  };

  // localStorage
  var headerForm = document.querySelector('.popup-header__form');
  var popupName = headerForm.querySelector('.popup-header__name');
  var popupTel = headerForm.querySelector('.popup-header__tel');

  var isStorageSupport = true;
  var storage = '';

  try {
    var storageName = localStorage.getItem('popupName');
    var storageTel = localStorage.getItem('popupTel');
  } catch (err) {
    isStorageSupport = false;
  }

  var submitHandler = function (evt) {
    form.forEach(function (element) {
      if (isStorageSupport) {
        localStorage.setItem('popupName', popupName.value);
        localStorage.setItem('popupTel', popupTel.value);
      }

      save(new FormData(element), successPostHandler, errorPostHandler);
    });

    evt.preventDefault();
  };

  form.forEach(function (element) {
    element.addEventListener('submit', submitHandler);
  });


  // validity
  var telInput = document.querySelectorAll('.tel');

  var telInputHandler = function () {
    telInput.forEach(function (element) {
      if (element.validity.patternMismatch) {
        element.setCustomValidity('Пожалуйста, введите номер в формате +7 (000) 000 00 00');
      } else if (element.validity.valueMissing) {
        element.setCustomValidity('Обязательное поле для заполнения');
      } else {
        element.setCustomValidity('');
      }
    });
  };

  var changeBorderHandler = function () {
    form.forEach(function (element) {
      var inputs = Array.from(element.querySelectorAll('input:invalid:not(:placeholder-shown)'));
      inputs.forEach(function (el) {
        el.classList.add('validation-error');
      });
    });

    form.forEach(function (element) {
      var inputsValid = Array.from(element.querySelectorAll('input:valid:not(:placeholder-shown)'));
      inputsValid.forEach(function (el) {
        el.classList.add('validation-success');
      });
    });
  };

  telInput.forEach(function (element) {
    element.addEventListener('input', telInputHandler);
    element.addEventListener('change', changeBorderHandler);
  });


  // маска для ввода номера
  var elements = document.getElementsByClassName('tel');
  for (var i = 0; i < elements.length; i++) {
    new IMask(elements[i], {
      mask: '+{7} (000) 000 00 00'
    });
  }


  // tabs
  var tab = function () {
    var tabNav = document.querySelectorAll('.tabs__item');
    var tabContent = document.querySelectorAll('.tabs__inset');
    var tabName;

    tabNav.forEach(function (item) {
      item.addEventListener('click', selectTabNav);
    });

    function selectTabNav() {
      tabNav.forEach(function (item) {
        item.classList.remove('tabs__item--active');
      });

      this.classList.add('tabs__item--active');
      tabName = this.getAttribute('data-tab-name');
      selectTabContent(tabName);
    }

    function selectTabContent(tabN) {
      tabContent.forEach(function (item) {
        if (item.classList.contains(tabN)) {
          item.classList.add('tabs__inset--active');
        } else {
          item.classList.remove('tabs__inset--active');
        }
      });
    }
  };

  tab();

}());
