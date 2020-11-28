'use strict';

(function () {

  var setPopup = function () {
    var modal = document.querySelector('.popup-header');
    var close = document.querySelector('.close');
    var open = document.querySelector('.open-modal');
    var inputFocus = document.querySelector('.form__name--header-popup');
    var popupBtn = document.querySelector('.form__btn--header-popup');

    var popupEscPressHandler = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeModal();
      }
    };

    var openModal = function () {
      modal.classList.remove('hidden');
      inputFocus.focus();

      document.addEventListener('keydown', popupEscPressHandler);
    };

    open.addEventListener('click', openModal);

    var closeModal = function () {
      modal.classList.add('hidden');
      document.removeEventListener('keydown', popupEscPressHandler);
    };

    close.addEventListener('click', function () {
      closeModal();
    });

    popupBtn.addEventListener('click', function () {
      closeModal();
    });

    modal.addEventListener('click', function (e) {
      if (e.target !== e.currentTarget) {
        return;
      } else {
        closeModal();
      }
    });
  };


  if (document.querySelector('.popup-header')) {
    setPopup();
  }


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
        document.body.appendChild(successText);
        resetForm();
        break;
      case 'error':
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
  var name = document.querySelectorAll('#name');
  var tel = document.querySelectorAll('#tel');

  var isStorageSupport = true;

  try {
    localStorage.getItem('name');
    localStorage.getItem('tel');
  } catch (err) {
    isStorageSupport = false;
  }

  var submitHandler = function (evt) {
    form.forEach(function (element) {
      if (isStorageSupport) {
        localStorage.setItem('name', name.value);
        localStorage.setItem('tel', tel.value);
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


  // tabs
  var setTab = function () {
    var tabNav = document.querySelectorAll('.tabs__item');
    var tabContent = document.querySelectorAll('.tabs__inset');
    var tabName;

    tabNav.forEach(function (item) {
      item.addEventListener('click', selectTabNav);
    });

    function selectTabNav(e) {
      tabNav.forEach(function (item) {
        item.classList.remove('tabs__item--active');
      });

      e.currentTarget.classList.add('tabs__item--active');
      tabName = e.currentTarget.getAttribute('data-tab-name');
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

  if (document.querySelectorAll('.tabs')) {
    setTab();
  }

  // accordion
  var setAccordion = function () {
    document.querySelectorAll('.accordion__btn').forEach(function (item) {
      item.addEventListener('click', function () {
        var parent = item.parentNode;

        if (parent.classList.contains('accordion__item--active')) {
          parent.classList.remove('accordion__item--active');
        } else {
          document.querySelectorAll('.accordion__item').forEach(function (child) {
            child.classList.remove('accordion__item--active');
          });

          parent.classList.toggle('accordion__item--active');
        }
      });
    });
  };

  if (document.querySelectorAll('.accordion')) {
    setAccordion();
  }

}());
