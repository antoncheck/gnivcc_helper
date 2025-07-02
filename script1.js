// Инициализация пользователей
const DEFAULT_PASSWORD = "123456789Pp.";
let users = [
  { login: "MakhotinAA", password: DEFAULT_PASSWORD },
  { login: "admin", password: "admin" },
];

// DOM элементы
const loginForm = document.getElementById("login-form");
const changePasswordLink = document.getElementById("change-password-link");
const passwordModal = document.getElementById("password-modal");
const closeModal = document.querySelector(".close");
const passwordChangeForm = document.getElementById("password-change-form");
const mainPage = document.getElementById("main-page");
const loginContainer = document.getElementById("login-container");
const logoutBtn = document.getElementById("logout-btn");

// Открытие модального окна
changePasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  passwordModal.style.display = "block";
  clearPasswordMessages();
});

// Закрытие модального окна
closeModal.addEventListener("click", () => {
  passwordModal.style.display = "none";
  clearPasswordMessages();
});

// Клик вне модального окна
window.addEventListener("click", (e) => {
  if (e.target === passwordModal) {
    passwordModal.style.display = "none";
    clearPasswordMessages();
  }
});

// Очистка сообщений
function clearMessages() {
  document.getElementById("username-error").textContent = "";
  document.getElementById("password-error").textContent = "";
}

function clearPasswordMessages() {
  document.getElementById("modal-username-error").textContent = "";
  document.getElementById("current-password-error").textContent = "";
  document.getElementById("new-password-error").textContent = "";
  document.getElementById("confirm-password-error").textContent = "";
  document.getElementById("password-change-success").textContent = "";

  // Сброс подсветки требований
  const requirements = document.querySelectorAll("#password-requirements li");
  requirements.forEach((req) => (req.className = ""));
}

// Обработка авторизации
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearMessages();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  let isValid = true;

  if (!username) {
    document.getElementById("username-error").textContent = "Введите логин";
    isValid = false;
  }

  if (!password) {
    document.getElementById("password-error").textContent = "Введите пароль";
    isValid = false;
  }

  if (!isValid) return;

  const user = users.find(
    (u) => u.login === username && u.password === password
  );

  if (user) {
    window.location.href = "glavn.html"; // укажи нужную страницу
  } else {
    document.getElementById("password-error").textContent =
      "Неверный логин или пароль";
  }
});

// Валидация нового пароля
function validatePassword(password) {
  const requirements = {
    length: password.length === 12,
    digit: /\d/.test(password),
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  // Обновляем отображение требований
  document.getElementById("length-req").className = requirements.length
    ? "requirement-met"
    : "requirement-not-met";
  document.getElementById("digit-req").className = requirements.digit
    ? "requirement-met"
    : "requirement-not-met";
  document.getElementById("upper-req").className = requirements.upper
    ? "requirement-met"
    : "requirement-not-met";
  document.getElementById("lower-req").className = requirements.lower
    ? "requirement-met"
    : "requirement-not-met";
  document.getElementById("special-req").className = requirements.special
    ? "requirement-met"
    : "requirement-not-met";

  return Object.values(requirements).every((req) => req === true);
}

// Обработка смены пароля
passwordChangeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearPasswordMessages();

  const username = document.getElementById("modal-username").value.trim();
  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  let isValid = true;

  // Проверка логина
  if (!username) {
    document.getElementById("modal-username-error").textContent =
      "Введите логин";
    isValid = false;
  }

  // Проверка текущего пароля
  if (!currentPassword) {
    document.getElementById("current-password-error").textContent =
      "Введите текущий пароль";
    isValid = false;
  }

  // Проверка нового пароля
  if (!newPassword) {
    document.getElementById("new-password-error").textContent =
      "Введите новый пароль";
    isValid = false;
  }

  // Проверка подтверждения пароля
  if (!confirmPassword) {
    document.getElementById("confirm-password-error").textContent =
      "Подтвердите пароль";
    isValid = false;
  }

  if (!isValid) return;

  // Проверка совпадения паролей
  if (newPassword !== confirmPassword) {
    document.getElementById("confirm-password-error").textContent =
      "Пароли не совпадают";
    return;
  }

  // Валидация пароля
  if (!validatePassword(newPassword)) {
    document.getElementById("new-password-error").textContent =
      "Пароль не соответствует требованиям";
    return;
  }

  // Поиск пользователя
  const userIndex = users.findIndex((u) => u.login === username);

  if (userIndex === -1) {
    document.getElementById("modal-username-error").textContent =
      "Пользователь не найден";
    return;
  }

  // Проверка текущего пароля
  if (users[userIndex].password !== currentPassword) {
    document.getElementById("current-password-error").textContent =
      "Неверный текущий пароль";
    return;
  }

  // Проверка, что новый пароль отличается от старого
  if (currentPassword === newPassword) {
    document.getElementById("new-password-error").textContent =
      "Новый пароль должен отличаться от старого";
    return;
  }

  // Обновление пароля
  users[userIndex].password = newPassword;

  // Показ успешного сообщения
  document.getElementById("password-change-success").textContent =
    "Пароль успешно изменен!";

  // Очистка формы через 2 секунды
  setTimeout(() => {
    passwordChangeForm.reset();
    clearPasswordMessages();
    passwordModal.style.display = "none";
  }, 2000);
});

// Валидация пароля в реальном времени
document.getElementById("new-password").addEventListener("input", function () {
  validatePassword(this.value);
});

// Выход из системы
logoutBtn.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  loginForm.reset();
  clearMessages();
});

// Инициализация требований к паролю
clearPasswordMessages();
