'use strict';

(function () {
  var body = document.querySelector('body');

  var setPopup = function () {
    var modal = document.querySelector('.popup-header');
    var close = document.querySelector('.close');
    var open = document.querySelector('.open-modal');
    var inputFocus = document.querySelector('.form__name--header-popup');

    var popupEscPressHandler = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeModal();
      }
    };

    var openModal = function () {
      modal.classList.remove('hidden');

      body.classList.add('lock');
      body.classList.add('active');

      inputFocus.focus();

      document.addEventListener('keydown', popupEscPressHandler);
    };

    open.addEventListener('click', openModal);

    var closeModal = function () {
      modal.classList.add('hidden');

      body.classList.remove('lock');
      body.classList.remove('active');

      document.removeEventListener('keydown', popupEscPressHandler);
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
  };


  if (document.querySelector('.popup-header')) {
    setPopup();
  }


  // backend
  var URL_POST = 'https://echo.htmlacademy.ru';

  var StatusCode = {
    OK: 200
  };

  var createNewXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');

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

    return xhr;
  };

  var save = function (data, onLoad, onError) {
    var xhr = createNewXhr(onLoad, onError);

    xhr.open('POST', URL_POST);
    xhr.send(data);
  };

  // message
  var form = document.querySelectorAll('.form');
  var error = document.querySelector('.error');
  var success = document.querySelector('.success');

  var resetForm = function () {
    form.forEach(function (element) {
      element.reset();
    });
  };

  var showMessage = function (result) {
    switch (result) {
      case 'success':
        success.classList.remove('hidden');
        resetForm();
        break;
      case 'error':
        error.classList.remove('hidden');
        resetForm();
        break;
    }

    body.classList.add('lock');
    document.addEventListener('click', messageСloseHandler);
    document.addEventListener('keydown', messageСloseHandler);
  };

  var messageСloseHandler = function (evt) {
    if (error && (evt.keyCode === 27 || evt.button === 0)) {
      error.classList.add('hidden');
    }

    if (success && (evt.keyCode === 27 || evt.button === 0)) {
      success.classList.add('hidden');
    }

    if (!(body.classList.contains('active'))) {
      body.classList.remove('lock');
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


  // submit
  var submitHandler = function (evt) {
    form.forEach(function (element) {
      save(new FormData(element), successPostHandler, errorPostHandler);
    });

    evt.preventDefault();
  };

  form.forEach(function (element) {
    element.addEventListener('submit', submitHandler);
  });


  // localStorage
  var subPopup = function () {
    var name = document.querySelector('.form__name--header-popup');
    var tel = document.querySelector('.form__tel--header-popup');
    var popupForm = document.querySelector('.popup-header__form');

    var isStorageSupport = true;

    try {
      localStorage.getItem('name');
      localStorage.getItem('tel');
    } catch (err) {
      isStorageSupport = false;
    }

    var subPopupHandler = function (evt) {
      if (isStorageSupport) {
        localStorage.setItem('name', name.value);
        localStorage.setItem('tel', tel.value);
      }

      evt.preventDefault();
    };

    popupForm.addEventListener('submit', subPopupHandler);
  };

  if (document.querySelector('.popup-header')) {
    subPopup();
  }


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
      var inputs = element.querySelectorAll('input:invalid:not(:placeholder-shown)');
      inputs.forEach(function (el) {
        el.classList.add('validation-error');
      });
    });

    form.forEach(function (element) {
      var inputsValid = element.querySelectorAll('input:valid:not(:placeholder-shown)');
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

  if (document.querySelector('.tabs')) {
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

  if (document.querySelector('.accordion')) {
    setAccordion();
  }

}());
