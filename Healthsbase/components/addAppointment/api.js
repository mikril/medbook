import Constants from 'expo-constants';
export const handleSubmit = async (imageFile, setDoctorType, setDateAppointment, setClinic, setDoctorFio, setDiagnosis, setComment, setDateNextAppointment) => {
  if (!imageFile) {
    console.error("Файл изображения не выбран");
    return;
  }
  var base64 = imageFile.uri.split(",")[1];
  var extension = imageFile.uri.split(",")[0].split(";")[1]

   async function sendAppointment(base64, extension) {
    try {
      // Первый запрос: получаем токен
      const vadimUrl = Constants.manifest.extra.vadimUrl;
      const tokenResponse = await fetch(`${vadimUrl}/token`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!tokenResponse.ok) {
        throw new Error('Ошибка получения токена');
      }
  
      const tokenData = await tokenResponse.json();
      const token = tokenData.token;
  
      // Второй запрос: отправляем данные с использованием токена
      const appointmentResponse = await fetch(`${vadimUrl}/appointment`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          file: base64,
          extension: extension,
        }),
      });
  
      if (!appointmentResponse.ok) {
        throw new Error('Ошибка отправки данных на сервер');
      }
  
      const result = await appointmentResponse.json();
      console.log(imageFile)
    // Используем переданные функции для обновления состояния
    setDoctorType(result.doctorSpec || '');
    setDateAppointment(result.dateFirst || '');
    setClinic(result.clinic || '');
    setDoctorFio(result.doctorName || '');
    setDiagnosis(result.diagnosis || '');
    setComment(result.treatment || '');
    setDateNextAppointment(result.dateNext || '');
    console.log('Успех:', result);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
  
  await sendAppointment(base64, extension);
};

export const addAppointment  = async (accountId, appointmentData) => {
  console.log('Добавляем приём врача', accountId, appointmentData);  // Логируем перед отправкой
  const apiUrl = Constants.manifest.extra.apiUrl;
  try {
    const response = await fetch(`${apiUrl}/user/${accountId}/appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:  JSON.stringify(appointmentData), // В данном случае тело запроса пустое, так как на сервере используется дефолтные значения
    });
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } 
  catch (error) {
    console.error("Ошибка при добавлении приёма врача:", error);
    throw error;
  }
};