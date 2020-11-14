'use strict';

(function () {
  var modal = document.querySelector('.popup-header');
  var close = document.querySelector('.close');
  var open = document.querySelector('.open-modal');
  var inputFocus = document.querySelector('.popup-header__tel');

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
  // var success = document.querySelector('.success');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  // var mainBlock = document.querySelector('main');
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


  // var showMessage = function () {
  //   modal.classList.add('hidden');
  //   success.classList.remove('hidden');
  //   resetForm();
  //   document.addEventListener('click', messageСloseHandler);
  //   document.addEventListener('keydown', messageСloseHandler);
  // };

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

  // var messageСloseHandler = function (evt) {
  //   if (evt.keyCode === 27 || evt.button === 0) {
  //     success.classList.add('hidden');
  //   }
  //   document.removeEventListener('click', messageСloseHandler);
  //   document.removeEventListener('keydown', messageСloseHandler);
  // };

  var successPostHandler = function () {
    showMessage('success');
  };

  var errorPostHandler = function () {
    showMessage('error');
  };


  var submitHandler = function (evt) {
    form.forEach(function (element) {
      save(new FormData(element), successPostHandler, errorPostHandler);
    });

    evt.preventDefault();
  };

  form.forEach(function (element) {
    element.addEventListener('submit', submitHandler);
  });

}());
