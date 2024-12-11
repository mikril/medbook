// ClientDataContext.js
import React, { createContext, useReducer, useContext, useEffect } from 'react';

// Инициализация состояния
const initialState = {
  clientData: null,
  loading: true,
  error: null,
};

// Действия для редюсера
const actionTypes = {
  SET_CLIENT_DATA: 'SET_CLIENT_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Редюсер
const clientDataReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_CLIENT_DATA:
      return { ...state, clientData: action.payload, loading: false };
    case actionTypes.SET_LOADING:
      return { ...state, loading: true };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Создание контекста
const ClientDataContext = createContext();

// Хук для использования контекста
export const useClientData = () => {
  return useContext(ClientDataContext);
};

// Провайдер
export const ClientDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clientDataReducer, initialState);

  // Имитация запроса данных клиента после авторизации
  const fetchClientData = async () => {
    dispatch({ type: actionTypes.SET_LOADING }); // Устанавливаем состояние загрузки

    try {
      // Имитация запроса
      const data = {
        clientName: 'Имя',
        id:'226',
        logo: 'https://m.media-amazon.com/images/M/MV5BMTY1ODUzNzcxN15BMl5BanBnXkFtZTcwMjQ1MDUwOA@@._V1_.jpg',
        notifications: [
          { type: 'Посещение врача', title: 'Кардиолог', description: 'Завтра в 14:00' },
          { type: 'Прием лекарств', title: 'Ношпа', description: '12:30' },
        ],
        pressureChart: [
          { date: '10.09.2024', lower: 120, upper: 140, pulse: 60 },
          { date: '11.09.2024', lower: 130, upper: 150, pulse: 85 },
          { date: '12.09.2024', lower: 125, upper: 145, pulse: 88 },
          { date: '13.09.2024', lower: 140, upper: 160, pulse: 90 },
          { date: '14.09.2024', lower: 135, upper: 155, pulse: 87 }
        ],
        lastMeasurements: [
          { title: 'Давление', description: '120/80' },
          { title: 'Пульс', description: '72 уд./мин' },
          { title: 'Сахар', description: '5.5 ммоль/л' },
          { title: 'Вес', description: '70 кг' },
        ],
        nextAppointments:[
          { clinic:"Инвитро",doctorType:"Терапевт",date:'07.12.2024',time: "10:00" },
          { clinic:"Инвитро",doctorType:"Окулист",date:'10.12.2024',time: "11:00" },
          { clinic:"ДокторАйболит",doctorType:"Окулист",date:'13.12.2024',time: "12:00" },
          { clinic:"ДокторАйболит",doctorType:"Терапевт",date:'16.12.2024',time: "13:00" },
          { clinic:"ДокторАйболит",doctorType:"Терапевт",date:'02.05.2003',time: "13:00" },
          { clinic:"ДокторАйболит",doctorType:"Терапевт",date:'03.05.2003',time: "13:00" },
        ],
        medicines : [
          {
            data: '02.05.2003',
            drug: [
              {name:"Ингавирин 90", time: '10:00', dose: '5 мг' },
              {name:"Ингавирин 90", time: '11:00', dose: '5 мг' },
              {name:"Ингавирин 90", time: '12:00', dose: '5 мг' },
            ],
          },
          {
            data: '03.05.2003',
            drug: [
              {name:"Ингавирин 90", time: '10:00', dose: '5 мг' },
              {name:"Ингавирин 90", time: '11:00', dose: '5 мг' },
              {name:"Ингавирин 90", time: '12:00', dose: '5 мг' },
            ],
          }
        ],
        allMeasurements : [
          {
            title: 'Сахар7',
            descriptions: [
              {value:5.5, text: '5.5 ммоль/л', date: '21.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '22.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '23.01.2001' },
            ],
          },
          {
            title: 'Сахар6',
            descriptions: [
              {value:5.5, text: '5.5 ммоль/л', date: '21.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '22.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '23.01.2001' },
            ],
          },
          {
            title: 'Сахар5',
            descriptions: [
              {value:5.5, text: '5.5 ммоль/л', date: '21.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '22.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '23.01.2001' },
            ],
          },
          {
            title: 'Сахар4',
            descriptions: [
              {value:5.5, text: '5.5 ммоль/л', date: '21.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '22.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '23.01.2001' },
            ],
          },
          {
            title: 'Сахар3',
            descriptions: [
              {value:5.5, text: '5.5 ммоль/л', date: '21.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '22.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '23.01.2001' },
            ],
          },
          {
            title: 'Сахар2',
            descriptions: [
              {value:5.5, text: '5.5 ммоль/л', date: '21.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '22.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '23.01.2001' },
            ],
          },
          {
            title: 'Сахар1',
            descriptions: [
              {value:5.5, text: '5.5 ммоль/л', date: '21.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '22.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '23.01.2001' },
            ],
          },
          
          {
            title: 'Сахар',
            descriptions: [
              {value:5.5, text: '5.5 ммоль/л', date: '21.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '22.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '23.01.2001' },
            ],
          },
          {
            title: 'Кровь',
            descriptions: [
              {value:5.5, text: '5.5 ммоль/л', date: '21.01.2001' },
              {value:6.0, text: '6.0 ммоль/л', date: '22.01.2001' },
            ],
          },
          {
            title: 'Вес',
            descriptions: [
              { value:70, text: '70 кг', date: '21.01.2001' },
              { value:71, text: '71 кг', date: '22.01.2001' },
            ],
          },
        ],
        users: [
          { avatar: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ce0d6c2f-db6f-4bab-a5b6-b2773bed43e1/1920x', name: 'Ирина Вайт',gender:'male', role: 'Жена Волтера',birthDate:'19.05.1985',comment:'Миссис Вайт Хайзенберговна', id:'226' },
          { avatar: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1704946/cda9396d-5553-471d-8014-be50e3f0f0ff/1920x', name: 'Мл.Волтер Вайт',gender:'male', role: 'Сын Волтера',birthDate:'20.03.2003',comment:'Младший Волтер Вайт Хайзенбергович', id:'228' },
          { avatar: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/0e083240-de28-4b2b-b9cf-9963cf27aa57/1920x', name: 'Джесси Пикми',gender:'male', role: 'Жертва Волтера Вайтера',birthDate:'19.09.1999',comment:'Джесси Пикман #sadboy', id:'229' },
          { avatar: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/c80c11fa-e8d0-44ab-9b18-6b357ae8e03a/1920x', name: 'Хэнк Хэнкович',gender:'male', role: 'Свояк Волтера',birthDate:'19.01.1991',comment:'Самый злой Хэнк', id:'227' },
        ],
        appointments: [
          { 
            id:'220',
            doctorType: 'Кардиолог',
            appointmentData: '12.12.2023',
            doctorComment: 'Проверить давление jhsdfhjk skdjhjksdfh kjsdhfjkshdf ksjdhfjksdhf kjsdhfkjhsdf kjsdhfkываываываываываываsdfdsfsdfsdf',
            photo: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ce0d6c2f-db6f-4bab-a5b6-b2773bed43e1/1920x',
            clinic: 'Клиника 1',
            doctorFio: 'Иванов Иван Иванович',
            diagnosis: 'Гипертония',
            dateNextAppointment: '20.12.2023',
        },
          { 
            id:'221',
            doctorType: 'Кардиолог',
            appointmentData: '12.12.2023',
            doctorComment: 'Проверить давление jhsdfhjk skdjhjksdfh kjsdhfjkshdf ksjdhfjksdhf kjsdhfkjhsdf kjsdhfkываываываываываываsdfdsfsdfsdf',
            photo: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ce0d6c2f-db6f-4bab-a5b6-b2773bed43e1/1920x',
            clinic: 'Клиника 1',
            doctorFio: 'Иванов Иван Иванович',
            diagnosis: 'Гипертония',
            dateNextAppointment: '20.12.2023',
        },
          { 
            id:'222',
            doctorType: 'Кардиолог',
            appointmentData: '12.12.2023',
            doctorComment: 'Проверить давление jhsdfhjk skdjhjksdfh kjsdhfjkshdf ksjdhfjksdhf kjsdhfkjhsdf kjsdhfkываываываываываываsdfdsfsdfsdf',
            photo: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ce0d6c2f-db6f-4bab-a5b6-b2773bed43e1/1920x',
            clinic: 'Клиника 1',
            doctorFio: 'Иванов Иван Иванович',
            diagnosis: 'Гипертония',
            dateNextAppointment: '20.12.2023',
        },
          { 
            id:'223',
            doctorType: 'Кардиолог',
            appointmentData: '12.12.2023',
            doctorComment: 'Проверить давление jhsdfhjk skdjhjksdfh kjsdhfjkshdf ksjdhfjksdhf kjsdhfkjhsdf kjsdhfkываываываываываываsdfdsfsdfsdf',
            photo: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ce0d6c2f-db6f-4bab-a5b6-b2773bed43e1/1920x',
            clinic: 'Клиника 1',
            doctorFio: 'Иванов Иван Иванович',
            diagnosis: 'Гипертония',
            dateNextAppointment: '20.12.2023',
        },
          { 
            id:'224',
            doctorType: 'Кардиолог',
            appointmentData: '12.12.2023',
            doctorComment: 'Проверить давление jhsdfhjk skdjhjksdfh kjsdhfjkshdf ksjdhfjksdhf kjsdhfkjhsdf kjsdhfkываываываываываываsdfdsfsdfsdf',
            photo: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ce0d6c2f-db6f-4bab-a5b6-b2773bed43e1/1920x',
            clinic: 'Клиника 1',
            doctorFio: 'Иванов Иван Иванович',
            diagnosis: 'Гипертония',
            dateNextAppointment: '20.12.2023',
        },
          { 
            id:'225',
            doctorType: 'Кардиолог',
            appointmentData: '12.12.2023',
            doctorComment: 'Проверить давление jhsdfhjk skdjhjksdfh kjsdhfjkshdf ksjdhfjksdhf kjsdhfkjhsdf kjsdhfkываываываываываываsdfdsfsdfsdf',
            photo: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ce0d6c2f-db6f-4bab-a5b6-b2773bed43e1/1920x',
            clinic: 'Клиника 1',
            doctorFio: 'Иванов Иван Иванович',
            diagnosis: 'Гипертония',
            dateNextAppointment: '20.12.2023',
        },
          { 
            id:'226',
            doctorType: 'Кардиолог',
            appointmentData: '12.12.2023',
            doctorComment: 'Проверить давление jhsdfhjk skdjhjksdfh kjsdhfjkshdf ksjdhfjksdhf kjsdhfkjhsdf kjsdhfkываываываываываываsdfdsfsdfsdf',
            photo: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/ce0d6c2f-db6f-4bab-a5b6-b2773bed43e1/1920x',
            clinic: 'Клиника 1',
            doctorFio: 'Иванов Иван Иванович',
            diagnosis: 'Гипертония',
            dateNextAppointment: '20.12.2023',
        },
        { 
          id:'227',
            doctorType: 'Терапевт', 
            appointmentData: '15.12.2023', 
            doctorComment: 'Общий осмотр sdjhsjkldf skdfhjksdfh kjsdhfkjds fkjsdfh sdkfjh sdfkjsdhf',
            photo: 'https://i3.wp.com/profmed1-nsk.com/photo/13/КУПИТЬ%20СПРАВКУ%20О%20ПОСЕЩЕНИИ%20ВРАЧА.jpg?ssl=1',
            clinic: 'Клиника 2',
            doctorFio: 'Петров Петр Петрович',
            diagnosis: 'Острые респираторные инфекции',
            dateNextAppointment: '25.12.2023',
        }
        ],
      };

      // Сохранение данных в состояние
      dispatch({ type: actionTypes.SET_CLIENT_DATA, payload: data });
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Загружаем данные при монтировании компонента, если данных нет
  useEffect(() => {
    if (!state.clientData) {
      fetchClientData();
    }
  }, [state.clientData]); // Эффект зависит от состояния clientData

  return (
    <ClientDataContext.Provider value={{ state, dispatch }}>
      {children}
    </ClientDataContext.Provider>
  );
};
