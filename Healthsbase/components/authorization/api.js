export const authorizateUser = async (userData, dispatch) => {
  console.log('Отправляем данные на сервер для авторизации:', userData);  // Логируем данные перед отправкой

  try {
    const response = await fetch('http://127.0.0.1:8000/authorizate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('Ответ от сервера получен. Статус:', response.status);  // Логируем статус ответа от сервера
    const data = await response.json();  // Получаем данные от сервера
    console.log('Данные, полученные от сервера:', data);  // Логируем полученные данные от сервера

    if (!response.ok) {
      console.error('Ошибка при авторизации:', data);  // Логируем ошибку сервера
      throw new Error(data.detail || 'Ошибка при авторизации');
    }

    console.log('Авторизация прошла успешно, полученные данные:', data);  // Логируем успешный ответ от сервера

    // Сохраняем данные в localStorage
    localStorage.setItem('clientData', JSON.stringify({
      id: data.user_id,  // ID пользователя
      id_account: data.id_account,  // ID аккаунта
    }));
    console.log('Данные сохранены в localStorage:', {
      id: data.user_id,
      id_account: data.id_account
    });  // Логируем данные, которые были сохранены в localStorage

    // Если используешь Redux или useReducer, обновляем состояние через dispatch
    if (dispatch) {
      await dispatch({
        type: 'SET_CLIENT_DATA',
        payload: {
          id:  "asd",  // Оставляем только id
          id_account: data.id_account,  // Оставляем только id_account
          clientName: null,  // Обнуляем clientName
          avatar: null,  // Обнуляем avatar
          notifications: [],  // Обнуляем notifications
          pressureChart: [],  // Обнуляем pressureChart
          lastMeasurements: [],  // Обнуляем lastMeasurements
          nextAppointments: [],  // Обнуляем nextAppointments
          medicines: [],  // Обнуляем medicines
          allMeasurements: [],  // Обнуляем allMeasurements
          users: [],  // Обнуляем users
          appointments: []
        },
      });
      console.log('Состояние обновлено через dispatch:', {
        id: data.user_id,
        id_account: data.id_account
      });  // Логируем обновленные данные состояния
    }

    return data;  // Возвращаем полученные данные
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);  // Логируем ошибку запроса
    throw new Error(error.message || 'Ошибка сети');
  }
};
