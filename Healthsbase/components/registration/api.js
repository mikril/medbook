export const registerUser = async (userData, dispatch) => {
  console.log('Отправляем данные на сервер:', userData);  // Логируем перед отправкой данных

  try {
    const response = await fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('Ответ от сервера получен. Статус:', response.status);  // Логируем статус ответа от сервера
    const responseData = await response.json();  // Получаем данные от сервера
    console.log('Данные, полученные от сервера:', responseData);  // Логируем полученные данные от сервера

    if (!response.ok) {
      console.error('Ошибка при регистрации:', responseData);  // Логируем ошибку сервера
      throw new Error(responseData.detail || 'Ошибка при регистрации');
    }

    // Логируем, что данные успешно получены
    console.log('Регистрация прошла успешно, полученные данные:', responseData);

    // Сохраняем данные в localStorage
    localStorage.setItem('clientData', JSON.stringify({
      id: responseData.user_id,  // ID пользователя
      id_account: responseData.id_account,  // ID аккаунта
    }));
    console.log('Данные сохранены в localStorage:', {
      id: responseData.user_id,
      id_account: responseData.id_account
    });  // Логируем данные, которые были сохранены в localStorage

    // Если используешь Redux или useReducer, обновляем состояние через dispatch
    if (dispatch) {
      await dispatch({
        type: 'SET_CLIENT_DATA',
        payload: {
          id:  "asd",  // Оставляем только id
          id_account: responseData.id_account,  // Оставляем только id_account
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
        id: responseData.user_id,
        id_account: responseData.id_account
      });  // Логируем обновленные данные состояния
    }

    return responseData;  // Возвращаем полученные данные
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);  // Логируем ошибку запроса
    throw new Error(error.message || 'Ошибка сети');
  }
};
