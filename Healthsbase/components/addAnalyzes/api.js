import Constants from 'expo-constants';
export const handleSubmit = async (imageFile, setDate, setAnalyzes) => {
  if (!imageFile) {
    console.error("Файл изображения не выбран");
    return;
  }

  const base64 = imageFile.uri.split(",")[1];
  const extension = imageFile.uri.split(",")[0].split(";")[1];

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
    const appointmentResponse = await fetch(`${vadimUrl}/analyses`, {
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

export const addAnalyze2  = async (accountId, analyzeData) => {
  console.log('Добавляем анализ', accountId, analyzeData);  // Логируем перед отправкой
  const apiUrl = Constants.manifest.extra.apiUrl;
  try {
    const response = await fetch(`${apiUrl}/user/${accountId}/analyzes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:  JSON.stringify(analyzeData), // В данном случае тело запроса пустое, так как на сервере используется дефолтные значения
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } 
  catch (error) {
    console.error("Ошибка при добавлении анализа:", error);
    throw error;
  }
};