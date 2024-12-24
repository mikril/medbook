import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; // Для редиректа

// Дефолтные данные
const data = {
  clientName: null,
  id: null,
  id_account: null,
  avatar: null,
  notifications: [],
  pressureChart: [],
  lastMeasurements: [],
  nextAppointments: [],
  medicines: [],
  allMeasurements: [],
  users: [],
  appointments: []
};

// Начальное состояние
const initialState = {
  clientData: data,
};

// Редьюсер для обновления состояния
const clientDataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CLIENT_DATA':
      return { ...state, clientData: { ...state.clientData, ...action.payload } };
    default:
      return state;
  }
};

const ClientDataContext = createContext();

// Провайдер для контекста
export const ClientDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clientDataReducer, initialState);
  const navigation = useNavigation();
  
  useEffect(() => {
    // Получаем данные из localStorage
    const storedClientData = localStorage.getItem('clientData');
   
    // Если данные из localStorage есть, обновляем состояние
    if (storedClientData) {
      const parsedClientData = JSON.parse(storedClientData);
     
      // Проверяем, что id существует и обновляем состояние
      if (parsedClientData?.id && parsedClientData.id !== state.clientData.id) {
        dispatch({
          type: 'SET_CLIENT_DATA',
          payload: parsedClientData,
        });
      }
      
      
    }

    // Логирование для отладки
    console.log('clientData (from localStorage):', state.clientData); 

    // Если id не найден, отправляем на страницу авторизации
    if (!state.clientData?.id_account) {
      navigation.navigate('Authorizate');
    } else {
      navigation.navigate('Main');
      // Только если id есть и данные еще не загружены (например, clientName или avatar)
       if (!state.clientData.clientName || !state.clientData.avatar) {
        const fetchUserData = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/user/${state.clientData.id}`);
            if (!response.ok) {
              throw new Error('Ошибка при получении данных пользователя');
            }
            const data = await response.json();

            // Обновляем данные в состоянии
            dispatch({
              type: 'SET_CLIENT_DATA',
              payload: {
                clientName: data.clientName,
                avatar: data.avatar,
              },
            });
          } catch (error) {
            console.error('Ошибка при запросе данных о пользователе:', error);
          }
        };

        fetchUserData();
      }


      if (state.clientData.users.length==0) {
        const fetchUsersByAccount  = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/account/${state.clientData.id_account}/users`);
            if (!response.ok) {
              throw new Error('Ошибка при получении данных пользователя');
            }
            const data = await response.json();

            // Обновляем данные в состоянии
            dispatch({
              type: 'SET_CLIENT_DATA',
              payload: {
                users: data,
              },
            });
          } catch (error) {
            console.error('Ошибка при запросе данных о пользователе:', error);
          }
        };
        fetchUsersByAccount();
      }


      if (state.clientData.appointments.length==0) {
        const fetchAppointmentsByUser  = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/user/${state.clientData.id}/appointments`);
            if (!response.ok) {
              throw new Error('Ошибка при получении данных о приемах');
            }
            const data = await response.json();

            // Обновляем данные в состоянии
            dispatch({
              type: 'SET_CLIENT_DATA',
              payload: {
                appointments: data,
              },
            });
          } catch (error) {
            console.error('Ошибка при запросе данных о приемах:', error);
          }
        };

        fetchAppointmentsByUser();
      }


      if (state.clientData.allMeasurements.length==0) {
        const fetchallMeasurementsByUser  = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/user/${state.clientData.id}/analyzes`);
            if (!response.ok) {
              throw new Error('Ошибка при получении данных об анализах');
            }
            const data = await response.json();

            // Обновляем данные в состоянии
            dispatch({
              type: 'SET_CLIENT_DATA',
              payload: {
                allMeasurements: data.allMeasurements,
              },
            });
          } catch (error) {
            console.error('Ошибка при запросе данных об анализах:', error);
          }
        };

        fetchallMeasurementsByUser();
      }

      if (state.clientData.pressureChart.length==0) {
        const fetchallPressureChartByUser  = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/user/${state.clientData.id}/pressure`);
            if (!response.ok) {
              throw new Error('Ошибка при получении данных об давлении');
            }
            const data = await response.json();

            // Обновляем данные в состоянии
            dispatch({
              type: 'SET_CLIENT_DATA',
              payload: {
                pressureChart: data,
              },
            });
          } catch (error) {
            console.error('Ошибка при запросе данных об давлении:', error);
          }
        };

        fetchallPressureChartByUser();
      }


      if (state.clientData.lastMeasurements.length==0) {
        const fetchLastMeasurementsByUser  = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/user/${state.clientData.id}/last_analyzes`);
            if (!response.ok) {
              throw new Error('Ошибка при получении данных о последних анализах');
            }
            const data = await response.json();

            // Обновляем данные в состоянии
            dispatch({
              type: 'SET_CLIENT_DATA',
              payload: {
                lastMeasurements: data.lastAnalyzes,
              },
            });
          } catch (error) {
            console.error('Ошибка при запросе данных о последних анализах:', error);
          }
        };

        fetchLastMeasurementsByUser();
      }

      if (state.clientData.nextAppointments.length==0) {
        const fetchNextAppointmentsByUser  = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/user/${state.clientData.id}/reminders`);
            if (!response.ok) {
              throw new Error('Ошибка при получении данных о последующих приемах');
            }
            const data = await response.json();

            // Обновляем данные в состоянии
            dispatch({
              type: 'SET_CLIENT_DATA',
              payload: {
                nextAppointments: data,
              },
            });
          } catch (error) {
            console.error('Ошибка при запросе данных о последующих приемах:', error);
          }
        };

        fetchNextAppointmentsByUser();
      }

      if (state.clientData.medicines.length==0) {
        const fetchMedicinesByUser  = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/user/${state.clientData.id}/reminders_before_date`);
            if (!response.ok) {
              throw new Error('Ошибка при получении данных о таблетках');
            }
            const data = await response.json();

            // Обновляем данные в состоянии
            dispatch({
              type: 'SET_CLIENT_DATA',
              payload: {
                medicines: data.medicines,
              },
            });
          } catch (error) {
            console.error('Ошибка при запросе данных о таблетках:', error);
          }
        };

        fetchMedicinesByUser();
      }

      if (state.clientData.notifications.length==0) {
        const fetchNotificationsByUser  = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/user/${state.clientData.id}/reminders/nearest`);
            if (!response.ok) {
              throw new Error('Ошибка при получении данных о последних уведомлениях');
            }
            const data = await response.json();

            // Обновляем данные в состоянии
            dispatch({
              type: 'SET_CLIENT_DATA',
              payload: {
                notifications: data,
              },
            });
          } catch (error) {
            console.error('Ошибка при запросе данных о последних уведомлениях:', error);
          }
        };

        fetchNotificationsByUser();
      }
    }
  }, [state.clientData.id, navigation]); // Используем state.clientData.id для зависимости

  return (
    <ClientDataContext.Provider value={{ state, dispatch }}>
      {children}
    </ClientDataContext.Provider>
  );
};

// Хук для доступа к данным
export const useClientData = () => useContext(ClientDataContext);
