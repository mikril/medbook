export const handleSubmit = (imageFile, setDoctorType, setDateAppointment, setClinic, setDoctorFio, setDiagnosis, setComment, setDateNextAppointment) => {
  if (!imageFile) {
    console.error("Файл изображения не выбран");
    return;
  }
  var base64 = imageFile.uri.split(",")[1];
  var extension = imageFile.uri.split(",")[0].split(";")[1]

  async function sendAppointment(base64, extension) {
    try {
      // Первый запрос: получаем токен
      const tokenResponse = await fetch('http://192.168.0.106:5000/token', {
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
      const appointmentResponse = await fetch('http://192.168.0.106:5000/appointment', {
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
  
  sendAppointment(base64, extension);
};
