export const registerUser = async (userData) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Ошибка при регистрации');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || 'Ошибка сети');
    }
  };
  