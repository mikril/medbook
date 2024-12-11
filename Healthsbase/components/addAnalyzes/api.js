// api.js
export const handleSubmit = async (imageFile, setDate, setAnalyzes) => {
  if (!imageFile) {
    console.error("Файл изображения не выбран");
    return;
  }

  const base64 = imageFile.uri.split(",")[1];
  const extension = imageFile.uri.split(",")[0].split(";")[1];

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
    const appointmentResponse = await fetch('http://192.168.0.106:5000/analyses', {
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
    setDate(result.date || '');
    setAnalyzes(result.analyses || []);

    console.log('Успех:', result);
  } catch (error) {
    console.error('Ошибка:', error);
  }
};
