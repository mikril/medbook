import Constants from 'expo-constants';
export const acountUser = async (userData) => {
    try {
      const apiUrl = Constants.manifest.extra.apiUrl;
      const response = await fetch(`${apiUrl}/acount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Ошибка в личном кабинете');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || 'Ошибка сети');
    }
  };
  