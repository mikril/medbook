export const addUserToAccount  = async (accountId) => {
  console.log('Добовляем пользавателя', accountId);  // Логируем письку перед отправкой

  try {
    const response = await fetch(`http://127.0.0.1:8000/account/${accountId}/add_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // В данном случае тело запроса пустое, так как на сервере используется дефолтные значения
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Ошибка при добавлении пользователя:", error);
    throw error;
  }
};
